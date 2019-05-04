const { Credentials } = require('uport-credentials')
const {did, privateKey}=Credentials.createIdentity();

const credentials = new Credentials({
    appName: 'Test', did, privateKey
})
  
credentials.createVerification({
      sub: '*',
      claims: {address: '*'}
})
.then((authToken)=>{
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

        ]
    }
    console.log(JSON.stringify(env,null,3));
})