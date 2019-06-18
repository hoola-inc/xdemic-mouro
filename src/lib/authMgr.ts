const didJWT = require('did-jwt')
import {DecisionTable} from 'decision_table';
import { headersType } from './commonTypes';
import { PersistedEdgeType } from './storageMgr';


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
 
    return await this.verify(parts[1]);
        
   }

   //Permssions handling: https://www.npmjs.com/package/decision_table

   async isAllowed(authToken: any, edge: PersistedEdgeType) {
        
        //Always have access to your own edges
        if(authToken.issuer == edge.to) return true;
    
        //Parse authz tokens.
        let dt = new DecisionTable();
        let isAllowed=false;

        let authz: any[] = authToken.access;
        authz.forEach(async (authzToken) => {
            //Verify token
            try{
                const authZ=await this.verify(authzToken)
                const condId=authZ.hash;
                
                //Parse authZ token                
                
                
                //Create condition for authZ
                dt.addCondition(condId, 
                    ()=>{ return authZ.from==edge.from; }
                );

                dt.addAction({whenTrue: [condId],execute:()=>{isAllowed=true}})


            }catch(err){}
        });

        dt.run();
        return isAllowed;

   }

    
}


