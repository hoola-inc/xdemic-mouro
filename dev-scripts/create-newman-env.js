const { Credentials } = require('uport-credentials')
const didJWT = require('did-jwt')
const {did, privateKey}=Credentials.createIdentity();

const credentials = new Credentials({
    appName: 'Test', did, privateKey
})
  
const signer = didJWT.SimpleSigner(privateKey);

let authToken
let edgeJWT

credentials.createVerification({
      sub: '*',
      claims: {address: '*'}
})
.then((res)=>{
    authToken=res;

    const payload={
        sub: 'did:ethr:0xsomeSub',
        type: 'ALL',
        tag: 'test',
        claim:{
            email: 'email@example.com'
        }
    }

    return didJWT.createJWT(payload,{issuer: did, signer})
})
.then((res)=>{
    edgeJWT=res;
    const env={
        "values": [
            {
                "key": "mouroUrl",
                "value": process.argv[2]
            },
            {
                "key": "authToken",
                "value": authToken
            },
            {
                "key": "did",
                "value": did
            },
            {
                "key": "edgeJWT",
                "value": edgeJWT
            }

        ]
    }
    console.log(JSON.stringify(env,null,3));
})