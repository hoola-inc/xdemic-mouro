
module.exports = class QueryResolverMgr {

    authMgr: any;
    storageMgr: any;

    constructor(authMgr: any,storageMgr: any) {
        this.authMgr = authMgr
        this.storageMgr = storageMgr
    }

    async me(headers: any){
        const authToken=await this.authMgr.verifyAuthorizationHeader(headers);
        return {
            did: authToken.issuer
        }
    }
}


