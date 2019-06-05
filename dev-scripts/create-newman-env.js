const { Credentials } = require('uport-credentials')
const {did, privateKey}=Credentials.createIdentity();
const blake = require('blakejs')

const credentials = new Credentials({
    appName: 'Test', did, privateKey
})

let authToken
let edgeJWT

//Create AuthToken
credentials.createVerification({
      sub: did,
      claim: {
          access: []
      }
})
.then((res)=>{
    authToken=res;

    //Create Edge JWT
    const payload={
        sub: did,
        type: 'ALL',
        tag: 'test',
        claim:{
            email: 'email@example.com'
        }
    }
    return credentials.signJWT(payload)
})
.then((res)=>{
    edgeJWT=res;
    edgeHash=blake.blake2bHex(edgeJWT);
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
            },
            {
                "key": "edgeHash",
                "value": edgeHash
            },
            
        ]
    }
    console.log(JSON.stringify(env,null,3));
})