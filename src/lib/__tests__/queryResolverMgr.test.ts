import {QueryResolverMgr} from '../queryResolverMgr';

const { Credentials } = require('uport-credentials')
const {did, privateKey} = Credentials.createIdentity();
const credentials = new Credentials({
    appName: 'Test App', did, privateKey
})

import { StorageMgr } from '../storageMgr';
import { AuthMgr } from '../authMgr';
import { resolve } from 'path';
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


});
