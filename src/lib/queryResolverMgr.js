
module.exports = class QueryResolverMgr {

    constructor() {
        this.pgUrl = null
    }

    isSecretsSet() {
        return this.pgUrl !== null;
    }

    setSecrets(secrets) {
        console.log("QueryResolverMgr: Setting Secrets...")
        this.pgUrl = secrets.PG_URL;
    }

    async me(headers){
        if(!headers) throw Error('no headers');

        return {
            did: "did:not:implemented"
        }
    }
}


