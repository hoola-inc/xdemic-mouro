import {EdgeResolverMgr} from '../edgeResolverMgr';

const { Credentials } = require('uport-credentials')
const {did, privateKey} = Credentials.createIdentity();
const credentials = new Credentials({
    appName: 'Test App', did, privateKey
})

import { StorageMgr } from '../storageMgr';
jest.mock('../storageMgr')

describe('EdgeResolverMgr', () => {
    
    let sut: EdgeResolverMgr;
    let mockStorageMgr:StorageMgr=new StorageMgr();
    let validToken='';

    const sub='0x0'

    beforeAll((done) =>{
        sut = new EdgeResolverMgr(mockStorageMgr);

        const payload={
            sub: did,
            type: 'ALL',
            tag: 'test',
            claim:{
                email: 'email@example.com'
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


    describe("addEdge()", () => {

        test('empty jwt', (done)=> {
            sut.addEdge('')
            .then(()=> {
                fail("shouldn't return"); done()
            })
            .catch( (err: Error)=>{
                expect(err.message).toEqual('no JWT passed into decodeJWT')
                done()
            })
        })


        test('valid token', (done)=> {
            sut.addEdge(validToken)
            .then((resp: any)=> {
                expect(resp).not.toBeNull();
                expect(resp.from).toEqual(did)
                done();
            })
            .catch( (err: Error)=>{
                fail(err); done()
            })
        })
    })


});
