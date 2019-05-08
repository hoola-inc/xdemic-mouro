interface StorageInterface {
    someQuery(string): string;
}

module.exports = class StorageMgr {

    storage: StorageInterface;

    constructor() {
        if(!this.storage && process.env.PG_URL) this.storage = new (require("./pgMgr"))();
        if(!this.storage && process.env.DYNAMODB_TABLE) this.storage = new (require("./dynamoMgr"))();
        if(!this.storage && process.env.MONGODB_URI) this.storage = new (require("./mongoMgr"))();
    }

    async someQuery(someParam){
        if (!this.storage) throw Error('no underlying storage')
        return await this.storage.someQuery(someParam);
    }
}


