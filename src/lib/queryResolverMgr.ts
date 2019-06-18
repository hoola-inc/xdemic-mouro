import { AuthMgr } from './authMgr';
import { StorageMgr } from './storageMgr';
import { headersType } from './commonTypes';

export class QueryResolverMgr {

    authMgr: AuthMgr;
    storageMgr: StorageMgr;

    constructor(authMgr: AuthMgr,storageMgr: StorageMgr) {
        this.authMgr = authMgr
        this.storageMgr = storageMgr
    }

    async me(headers: headersType){
        const authToken=await this.authMgr.verifyAuthorizationHeader(headers);
        return {
            did: authToken.issuer
        }
    }

    async edgeByHash(headers: headersType, hash: string){
        const authToken=await this.authMgr.verifyAuthorizationHeader(headers);
        let edge=await this.storageMgr.getEdge(hash)

        //Check if authorized
        if(!(await this.authMgr.isAllowed(authToken,edge))) throw Error("Unauthorized")

        //Transformations
        edge.from={did: edge.from}
        edge.to={did: edge.to}
        edge.claim=JSON.stringify(edge.claim)
        return edge;
    }

    async findEdges(headers: headersType, args: any){
        const auth=await this.authMgr.verifyAuthorizationHeader(headers);
        const params={args};
        let edges=await this.storageMgr.findEdges(params)

        let allowedEdges:any[]=[];

        for(let i=0;i<edges.length;i++){
            let edge=edges[i];
            try{
                //Check if authorized
                if(await this.authMgr.isAllowed(auth,edge)){
                    //Transformations
                    edge.from={did: edge.from}
                    edge.to={did: edge.to}
                    edge.claim=JSON.stringify(edge.claim)
                    allowedEdges.push(edge);
                }
            }catch(err){
                console.error(err);
            }

        }
            
        console.log(allowedEdges)
        return allowedEdges;
    }
}


