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
}


