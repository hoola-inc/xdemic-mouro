import { Resolver } from 'did-resolver'
import * as ethr from 'ethr-did-resolver'

export class DidResolverMgr {

    resolver: any //TODO: Fix resolver type

    constructor(){
        let resolvers={};
    
        if(process.env.INFURA_PROJECT_ID){
            const ethrDidResolverConfig = { 
                rpcUrl: 'https://mainnet.infura.io/v3/'+process.env.INFURA_PROJECT_ID 
            }
            const ethrResolver = ethr.getResolver(ethrDidResolverConfig)
            resolvers = {...ethrResolver};
        }else{
            console.error("no INFURA_PROJECT_ID env var. ethr-did-resolver not available")
        }
        this.resolver = new Resolver(resolvers)
    }

    getResolver(){
        return this.resolver;
    }

}