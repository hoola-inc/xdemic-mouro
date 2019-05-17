import { PersistedEdgeType } from "./storageMgr";
const { Client } = require('pg')

module.exports = class PgMgr {

    constructor() {
        console.log("Pg Driver Started.")
    }

    _getClient(){
        return new Client({
            connectionString: process.env.PG_URL,
        })
    }

    async init(){
        const sql=`
        CREATE TABLE IF NOT EXISTS edges
        (
            hash CHAR(128) NOT NULL, 
            "from" VARCHAR(64) NOT NULL, 
            "to" VARCHAR(64) NOT NULL, 
            type VARCHAR(128) NOT NULL, 
            "time" TIMESTAMP NOT NULL, -- from iat
            tag VARCHAR(128) NULL, 
            claim JSONB NULL, 
            encPriv JSONB NULL, 
            encShar JSONB NULL,
            jwt TEXT NOT NULL,
            CONSTRAINT edges_pkey PRIMARY KEY (hash)
        )
        `
        const client = this._getClient();
        try {
            await client.connect()
            const res = await client.query(sql);
            return res;
        } catch (e) {
            throw (e);
        } finally {
            await client.end()
        }
    }

    async addEdge(edge: PersistedEdgeType){
        //Store edge
        const sql=`
        INSERT INTO edges
        (
            hash, 
            "from", 
            "to", 
            type, 
            "time",
            tag, 
            claim, 
            encPriv, 
            encShar,
            jwt
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        ON CONFLICT ON CONSTRAINT edges_pkey 
        DO NOTHING;
        `
        const client = this._getClient();
        try {
            await client.connect()
            const res = await client.query(sql,[
                edge.hash,
                edge.from,
                edge.to,
                edge.type,
                edge.time,
                edge.tag,
                edge.claim,
                edge.encPriv,
                edge.encShar,
                edge.jwt
            ]);
            return res;
        } catch (e) {
            throw (e);
        } finally {
            await client.end()
        }

        

    }
}


