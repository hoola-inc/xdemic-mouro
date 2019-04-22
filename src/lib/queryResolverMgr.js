
module.exports = class QueryResolverMgr {

    constructor(authMgr) {
        this.authMgr = authMgr
    }

    async me(headers){
        const authToken=await this.authMgr.verifyAuthorizationHeader(headers);
        return {
            did: authToken.issuer
        }
    }
}


