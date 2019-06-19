const didJWT = require('did-jwt')
import {DecisionTable} from 'decision_table';
import { headersType } from './commonTypes';
import { PersistedEdgeType } from './storageMgr';
const blake = require('blakejs')

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

   async isAllowed(authToken: any, edge: PersistedEdgeType, action='read') {
        //Always have access to your own edges
        if(authToken.issuer == edge.to) return true;
    
        let isAllowed=false;

        if(authToken.payload.claim.access){
            //Parse authz tokens.
            let dt = new DecisionTable();
            let access: any[] = authToken.payload.claim.access;

            for(let i=0;i<access.length;i++){
                const authzToken=access[i];
                //Verify token
                try{
                    //Decode token
                    const authZ=await this.verify(authzToken)
                    
                    //Create id
                    const authZid = blake.blake2bHex(authzToken)

                    //Check if issuer is the owner of the edge
                    dt.addCondition(authZid+'-0', 
                        ()=>{ return authZ.issuer == edge.to; }
                    );
                    //Check if sub is the authuser
                    dt.addCondition(authZid+'-1', 
                        ()=>{ return authZ.payload.sub == authToken.issuer; }
                    );

                    const claim=authZ.payload.claim;

                    //Check if action of the authz token is the required
                    dt.addCondition(authZid+'-2', 
                        ()=>{ return claim.action==action; }
                    );

                    //Parse authZ token
                    if(claim.condition.from){
                        dt.addCondition(authZid+'-3',  
                            ()=>{
                                return claim.condition.from==edge.from; 
                            }
                        );
                    }else{
                        //Not a condition
                        dt.addCondition(authZid+'-3',  
                            ()=>{ return false; }
                        );
                    }

                    dt.addAction({
                        whenTrue: [authZid+'-0',authZid+'-1',authZid+'-2',authZid+'-3'],
                        execute:()=>{isAllowed=true}
                    })
    
    
                }catch(err){ console.log(err)}
            }
    
            dt.run();
    
        }
        console.log((isAllowed?'':'not ')+'allowed to '+action+" :: "+authToken.issuer+" :: "+edge.hash)
        return isAllowed;

   }

    
}


