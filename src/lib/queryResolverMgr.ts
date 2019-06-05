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
        //TODO: Check if edge.to==authToken.issuer

        //Transformations
        edge.from={did: edge.from}
        edge.to={did: edge.to}
        edge.claim=JSON.stringify(edge.claim)
        return edge;
    }
}


