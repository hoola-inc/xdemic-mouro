const didJWT = require('did-jwt')

module.exports = class AuthMgr {

    constructor() {
        require('ethr-did-resolver').default()
    }

    async verify(authToken: string) {
        if (!authToken) throw new Error('no authToken')
        const verifiedToken = await didJWT.verifyJWT(authToken);
        return verifiedToken;
   }

   async verifyAuthorizationHeader(headers: any){
    if(!headers) throw new Error('no headers')
    if(!headers.Authorization) throw Error('no Authorization');

    const authHead = headers.Authorization;

    const parts = authHead.split(" ");
    if (parts.length !== 2) throw Error("Format is Authorization: Bearer [token]");
    const scheme = parts[0];
    if (scheme !== "Bearer") throw Error("Format is Authorization: Bearer [token]");
 
    return this.verify(parts[1]);
        
   }

    
}


