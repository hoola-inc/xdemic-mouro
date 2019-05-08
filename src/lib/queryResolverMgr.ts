
module.exports = class QueryResolverMgr {

    authMgr: any;
    storageMgr: any;

    constructor(authMgr,storageMgr) {
        this.authMgr = authMgr
        this.storageMgr = storageMgr
    }

    async me(headers){
        const authToken=await this.authMgr.verifyAuthorizationHeader(headers);
        return {
            did: authToken.issuer
        }
    }
}


