export interface StorageInterface {
    init(): void;
    addEdge(edge: PersistedEdgeType):void;
}

export type PersistedEdgeType = {
    hash: string,
    from: string,
    to: string,
    type: string,
    time: Date,
    tag?: string,
    claim?: any,
    encPriv?: any,
    encShar?: any
}

export class StorageMgr {

    storage!: StorageInterface;

    constructor() {
        if(process.env.PG_URL) this.storage = new (require("./pgMgr"))();
        if(process.env.DYNAMODB_TABLE) this.storage = new (require("./dynamoMgr"))();
        if(process.env.MONGODB_URI) this.storage = new (require("./mongoMgr"))();

        //Init Storage
        if(this.storage!=null){
            (async ()=>{
                await this.storage.init();
            })();
        }
        
    }

    async addEdge(edge: PersistedEdgeType){
        if (!this.storage) throw Error('no underlying storage')
        return this.storage.addEdge(edge);
    }
}


