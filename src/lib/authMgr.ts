const didJWT = require('did-jwt')

import { headersType } from './commonTypes';

export class AuthMgr {

    constructor() {
        require('ethr-did-resolver').default()
    }

    async verify(authToken: string) {
        if (!authToken) throw new Error('no authToken')
        const verifiedToken = await didJWT.verifyJWT(authToken);
        return verifiedToken;
   }

   async verifyAuthorizationHeader(headers: headersType){
    const authHead = headers.Authorization;

    const parts = authHead.split(" ");
    if (parts.length !== 2) throw Error("Format is Authorization: Bearer [token]");
    const scheme = parts[0];
    if (scheme !== "Bearer") throw Error("Format is Authorization: Bearer [token]");
 
    return this.verify(parts[1]);
        
   }

    
}


