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
      sub: sub
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
      .then(()=> {
        fail("shouldn't return"); done()
      })
      .catch( (err: Error)=>{
        expect(err.message).toEqual('Format is Authorization: Bearer [token]')
        done()
      })
    })


    test('bad authorization format (no Bearer)', (done)=> {
      sut.verifyAuthorizationHeader({"Authorization": "bad format"})
      .then(()=> {
        fail("shouldn't return"); done()
      })
      .catch( (err: Error)=>{
        expect(err.message).toEqual('Format is Authorization: Bearer [token]')
        done()
      })
    })



    test('bad authorization token', (done)=> {
      sut.verifyAuthorizationHeader({"Authorization": "Bearer bad"})
      .then(()=> {
        fail("shouldn't return"); done()
      })
      .catch( (err: Error)=>{
        expect(err.message).toEqual('Incorrect format JWT')
        done()
      })
    })

  })


  describe("getAuthData()", () => {

    test('invalid token', (done)=> {
      didJWT.verifyJWT.mockImplementationOnce(()=>{throw Error('Incorrect format JWT')})
      sut.getAuthData({"Authorization": "Bearer bad"})
      .then(()=> {
        fail("shouldn't return"); done()
      })
      .catch( (err: Error)=>{
        expect(err.message).toEqual('Incorrect format JWT')
        done()
      })
    })

    test('valid token (no claim)', (done)=> {
      didJWT.verifyJWT.mockResolvedValueOnce({issuer: did, payload: {}})
      sut.getAuthData({"Authorization": "Bearer ey"})
      .then((resp: any)=> {
        expect(resp).not.toBeNull();
        expect(resp).toEqual({user: did})
        done();
      })
      .catch( (err: Error)=>{
        fail(err); done()
      })
    })

    test('valid token (no access)', (done)=> {
        didJWT.verifyJWT.mockResolvedValueOnce({issuer: did, payload: {claim:{}}})
        sut.getAuthData({"Authorization": "Bearer ey"})
        .then((resp: any)=> {
          expect(resp).not.toBeNull();
          expect(resp).toEqual({user: did})
          done();
        })
        .catch( (err: Error)=>{
          fail(err); done()
        })
    })
  
    test('valid token (empty access)', (done)=> {
        didJWT.verifyJWT.mockResolvedValueOnce({issuer: did, payload: {claim:{access:[]}}})
        sut.getAuthData({"Authorization": "Bearer ey"})
        .then((resp: any)=> {
          expect(resp).not.toBeNull();
          expect(resp).toEqual({user: did})
          done();
        })
        .catch( (err: Error)=>{
          fail(err); done()
        })
    })

    test('valid token (bad access)', (done)=> {
        didJWT.verifyJWT.mo
        didJWT.verifyJWT.mockResolvedValueOnce({issuer: did, payload: {sub: did, claim:{access:['a']}}})
        //Second call for authzToken
        didJWT.verifyJWT.mockImplementationOnce(()=>{throw Error('Incorrect format JWT')})
        
        sut.getAuthData({"Authorization": "Bearer ey"})
        .then((resp: any)=> {
          expect(resp).not.toBeNull();
          expect(resp).toEqual({user: did})
          done();
        })
        .catch( (err: Error)=>{
          fail(err); done()
        })
    })

    test('valid token (access: mismatch sub)', (done)=> {
        didJWT.verifyJWT.mo
        didJWT.verifyJWT.mockResolvedValueOnce({issuer: did, payload: {sub: did, claim:{access:['a']}}})
        //Second call for authzToken
        didJWT.verifyJWT.mockResolvedValueOnce({issuer: sub, payload: {sub: sub, claim:{}}})
        
        sut.getAuthData({"Authorization": "Bearer ey"})
        .then((resp: any)=> {
          expect(resp).not.toBeNull();
          expect(resp).toEqual({user: did})
          done();
        })
        .catch( (err: Error)=>{
          fail(err); done()
        })
    })

    test('valid token (access: read.from)', (done)=> {
        didJWT.verifyJWT.mo
        didJWT.verifyJWT.mockResolvedValueOnce({issuer: did, payload: {sub: did, claim:{access:['a']}}})
        //Second call for authzToken
        didJWT.verifyJWT.mockResolvedValueOnce({issuer: sub, payload: {sub: did, claim:{action:'read',condition:{from: did}}}})
        
        sut.getAuthData({"Authorization": "Bearer ey"})
        .then((resp: any)=> {
          expect(resp).not.toBeNull();
          expect(resp).toEqual({
              user: did,
              authzRead: [{iss: sub, from: did}]
            })
          done();
        })
        .catch( (err: Error)=>{
          fail(err); done()
        })
    })

    test('valid token (access: delete.from)', (done)=> {
        didJWT.verifyJWT.mo
        didJWT.verifyJWT.mockResolvedValueOnce({issuer: did, payload: {sub: did, claim:{access:['a']}}})
        //Second call for authzToken
        didJWT.verifyJWT.mockResolvedValueOnce({issuer: sub, payload: {sub: did, claim:{action:'delete',condition:{from: did}}}})
        
        sut.getAuthData({"Authorization": "Bearer ey"})
        .then((resp: any)=> {
          expect(resp).not.toBeNull();
          expect(resp).toEqual({
              user: did,
              authzDelete: [{iss: sub, from: did}]
            })
          done();
        })
        .catch( (err: Error)=>{
          fail(err); done()
        })
    })

  })

 });
