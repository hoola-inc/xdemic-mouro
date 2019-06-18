import {QueryResolverMgr} from '../queryResolverMgr';

const { Credentials } = require('uport-credentials')
const {did, privateKey} = Credentials.createIdentity();
const credentials = new Credentials({
    appName: 'Test App', did, privateKey
})

import { StorageMgr } from '../storageMgr';
import { AuthMgr } from '../authMgr';

jest.mock('../storageMgr')
jest.mock('../authMgr')

describe('QueryResolverMgr', () => {
    
    let sut: QueryResolverMgr;
    let mockStorageMgr:StorageMgr=new StorageMgr();
    let mockAuthMgr:AuthMgr=new AuthMgr();
    let validToken='';

    beforeAll((done) =>{
        sut = new QueryResolverMgr(mockAuthMgr,mockStorageMgr);

        const payload={
            sub: did,
            claim:{
                token: 'valid'
            }
        }
        credentials.signJWT(payload)
        .then((token: string)=>{
            validToken=token;
        }).then(done);
    })

    test('empty constructor', () => {
        expect(sut).not.toBeUndefined();
    });


    describe("me()", () => {
        mockAuthMgr.verifyAuthorizationHeader=
            jest.fn().mockImplementationOnce(()=>{throw Error('fail')})

        test('authMgr.verifyAuthorizarionHeader fail', (done)=> {
            sut.me({Authorization: 'Bearer '+validToken})
            .then(()=> {
                fail("shouldn't return"); done()
            })
            .catch( (err: Error)=>{
                expect(err.message).toEqual('fail')
                done()
            })
        })


        test('valid token', (done)=> {
            mockAuthMgr.verifyAuthorizationHeader=
                jest.fn().mockResolvedValueOnce({issuer: did});
    
                sut.me({Authorization: 'Bearer '+validToken})
            .then((resp: any)=> {
                expect(resp).not.toBeNull();
                expect(resp.did).toEqual(did)
                done();
            })
            .catch( (err: Error)=>{
                fail(err); done()
            })
        })
    })

    describe("edgeByHash()", () => {

        test('authMgr.verifyAuthorizarionHeader fail', (done)=> {
            mockAuthMgr.verifyAuthorizationHeader=
                jest.fn().mockImplementationOnce(()=>{throw Error('fail')})
            sut.edgeByHash({Authorization: 'Bearer '+validToken},'hash')
            .then(()=> {
                fail("shouldn't return"); done()
            })
            .catch( (err: Error)=>{
                expect(err.message).toEqual('fail')
                done()
            })
        })

        test('storageMgr.getEdge fail', (done)=> {
            mockAuthMgr.verifyAuthorizationHeader=
                jest.fn().mockResolvedValue({issuer: did})
            mockStorageMgr.getEdge=
                jest.fn().mockImplementationOnce(()=>{throw Error('failS')})
            sut.edgeByHash({Authorization: 'Bearer '+validToken},'hash')
            .then(()=> {
                fail("shouldn't return"); done()
            })
            .catch( (err: Error)=>{
                expect(err.message).toEqual('failS')
                done()
            })
        })

        test('unauthorized', (done)=> {
            mockAuthMgr.verifyAuthorizationHeader=
                jest.fn().mockResolvedValue({issuer: did})
            mockStorageMgr.getEdge=
                jest.fn().mockResolvedValue({to: 'other-did'})
            mockAuthMgr.isAllowed=
                jest.fn().mockResolvedValueOnce(false)
                
            sut.edgeByHash({Authorization: 'Bearer '+validToken},'hash')
            .then(()=> {
                fail("shouldn't return"); done()
            })
            .catch( (err: Error)=>{
                expect(err.message).toEqual('Unauthorized')
                done()
            })
        })


        test('valid hash', (done)=> {
            mockAuthMgr.verifyAuthorizationHeader=
                jest.fn().mockResolvedValue({issuer: did})
            mockStorageMgr.getEdge=
                jest.fn().mockResolvedValue({from: 'other-did', to: did, claim:{}})
            mockAuthMgr.isAllowed=
                jest.fn().mockResolvedValue(true)

            sut.edgeByHash({Authorization: 'Bearer '+validToken},'hash')
            .then((resp: any)=> {
                expect(resp).not.toBeNull();
                expect(resp.from).toEqual({did: 'other-did'})
                expect(resp.to).toEqual({did: did})
                expect(resp.claim).toEqual("{}")
                done();
            })
            .catch( (err: Error)=>{
                fail(err); done()
            })
        })
    })

    describe("findEdges()", ()=>{

        test('authMgr.verifyAuthorizarionHeader fail', (done)=> {
            mockAuthMgr.verifyAuthorizationHeader=
                jest.fn().mockImplementationOnce(()=>{throw Error('fail')})
            sut.findEdges({Authorization: 'Bearer '+validToken},'args')
            .then(()=> {
                fail("shouldn't return"); done()
            })
            .catch( (err: Error)=>{
                expect(err.message).toEqual('fail')
                done()
            })
        })

        test('storageMgr.findEdges fail', (done)=> {
            mockAuthMgr.verifyAuthorizationHeader=
                jest.fn().mockResolvedValue({})
            mockStorageMgr.findEdges=
                jest.fn().mockImplementationOnce(()=>{throw Error('failS')})
            sut.findEdges({Authorization: 'Bearer '+validToken},'args')
            .then(()=> {
                fail("shouldn't return"); done()
            })
            .catch( (err: Error)=>{
                expect(err.message).toEqual('failS')
                done()
            })
        })

        test('authMgr.isAllowed fail', (done)=> {
            mockAuthMgr.verifyAuthorizationHeader=
                jest.fn().mockResolvedValue({})
            mockStorageMgr.findEdges=
                jest.fn().mockResolvedValue([{hash:'someEdgeHash'}])
            mockAuthMgr.isAllowed=
                jest.fn().mockImplementationOnce(()=>{throw Error('failI')})
            sut.findEdges({Authorization: 'Bearer '+validToken},'args')
            .then((resp: any)=> {
                expect(resp).not.toBeNull();
                expect(resp).toEqual([])
                done();
            })
            .catch( (err: Error)=>{
                fail(err); done()
            })
        })

        test('edge not allowed', (done)=> {
            mockAuthMgr.verifyAuthorizationHeader=
                jest.fn().mockResolvedValue({})
            mockStorageMgr.findEdges=
                jest.fn().mockResolvedValue([{hash:'someEdgeHash'}])
            mockAuthMgr.isAllowed=
                jest.fn().mockResolvedValueOnce(false)
            sut.findEdges({Authorization: 'Bearer '+validToken},'args')
            .then((resp: any)=> {
                expect(resp).not.toBeNull();
                expect(resp).toEqual([])
                done();
            })
            .catch( (err: Error)=>{
                fail(err); done()
            })
        })

        test('edge allowed (happy path)', (done)=> {
            mockAuthMgr.verifyAuthorizationHeader=
                jest.fn().mockResolvedValue({})
            mockStorageMgr.findEdges=
                jest.fn().mockResolvedValue([{from: 'other-did', to: did, claim:{}}])
            mockAuthMgr.isAllowed=
                jest.fn().mockResolvedValueOnce(true)
            sut.findEdges({Authorization: 'Bearer '+validToken},'args')
            .then((resp: any)=> {
                expect(resp).not.toBeNull();
                expect(resp[0]).not.toBeNull();
                expect(resp[0].from).toEqual({did: 'other-did'})
                expect(resp[0].to).toEqual({did: did})
                expect(resp[0].claim).toEqual("{}")
                done();
            })
            .catch( (err: Error)=>{
                fail(err); done()
            })
        })

    })

});
