import {AuthMgr} from '../authMgr';

const { Credentials } = require('uport-credentials')
const {did, privateKey} = Credentials.createIdentity();
const credentials = new Credentials({
    appName: 'Test App', did, privateKey
})

const didJWT = require('did-jwt')
jest.mock("did-jwt");

describe('AuthMgr', () => {

    let sut: AuthMgr;
    let validToken: string;
    const sub='0x0'

    beforeAll((done) =>{
        sut = new AuthMgr();

        credentials.createVerification({
            sub: sub,
            claims: {valid: 'Token'}
        }).then((token: string)=>{
            validToken=token;
        }).then(done);
    })

    test('empty constructor', () => {
        expect(sut).not.toBeUndefined();
    });


    describe("verify()", () => {

        test('no token', (done)=> {
            sut.verify('')
            .then(()=> {
                fail("shouldn't return"); done()
            })
            .catch( (err: Error)=>{
                expect(err.message).toEqual('no authToken')
                done()
            })
        })

        test('invalid token', (done)=> {
            didJWT.verifyJWT.mockImplementationOnce(()=>{throw Error('Incorrect format JWT')})
            sut.verify("badtoken")
            .then(()=> {
                fail("shouldn't return"); done()
            })
            .catch( (err: Error)=>{
                expect(err.message).toEqual('Incorrect format JWT')
                done()
            })
        })

        test('valid token', (done)=> {
            didJWT.verifyJWT.mockResolvedValueOnce({issuer: did, payload: {sub: sub}})
            sut.verify(validToken)
            .then((resp: any)=> {
                expect(resp).not.toBeNull();
                expect(resp.issuer).toEqual(did)
                expect(resp.payload.sub).toEqual(sub)
                done();
            })
            .catch( (err: Error)=>{
                fail(err); done()
            })
        })
    })


    describe("verifyAuthorizationHeader()", () => {
        
        test('bad authorization format (single part)', (done)=> {
            didJWT.verifyJWT.mockImplementationOnce(()=>{throw Error('Incorrect format JWT')})

            sut.verifyAuthorizationHeader({"Authorization": "bad"})
            .then((resp: string)=> {
                fail("shouldn't return"); done()
            })
            .catch( (err: Error)=>{
                expect(err.message).toEqual('Format is Authorization: Bearer [token]')
                done()
            })
        })


        test('bad authorization format (no Bearer)', (done)=> {
            sut.verifyAuthorizationHeader({"Authorization": "bad format"})
            .then((resp: string)=> {
                fail("shouldn't return"); done()
            })
            .catch( (err: Error)=>{
                expect(err.message).toEqual('Format is Authorization: Bearer [token]')
                done()
            })
        })



        test('bad authorization token', (done)=> {
            sut.verifyAuthorizationHeader({"Authorization": "Bearer bad"})
            .then((resp: string)=> {
                fail("shouldn't return"); done()
            })
            .catch( (err: Error)=>{
                expect(err.message).toEqual('Incorrect format JWT')
                done()
            })
        })

    })

    describe("isAllowed()", () => {

        let testEdge={
            hash:'fakeHash',
            from: 'did:ethr:from',
            to: 'did:ethr:to',
            type: '',
            time: new Date(),
            jwt: 'ey.fake.jwt'
        }

        test("false if empty authZ", (done)=>{
            sut.isAllowed({access: []},testEdge)
            .then((resp: any)=> {
                expect(resp).not.toBeNull();
                expect(resp).toEqual(false)
                done();
            })
            .catch( (err: Error)=>{
                fail(err); done()
            })
        })

    })
});
