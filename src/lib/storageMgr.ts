export interface StorageInterface {
    someQuery(someParam: string): string;
}

export class StorageMgr {

    storage!: StorageInterface;

    constructor() {
        
        if(process.env.PG_URL) this.storage = new (require("./pgMgr"))();
        if(process.env.DYNAMODB_TABLE) this.storage = new (require("./dynamoMgr"))();
        if(process.env.MONGODB_URI) this.storage = new (require("./mongoMgr"))();
    }

    async someQuery(someParam: string){
        if (!this.storage) throw Error('no underlying storage')
        return await this.storage.someQuery(someParam);
    }
}


