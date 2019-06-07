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

});
