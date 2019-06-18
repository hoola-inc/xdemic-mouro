import { PersistedEdgeType } from "./storageMgr";
const { Client } = require('pg')
const sql = require('sql-bricks-postgres');

module.exports = class PgMgr {

    constructor() {
        //Small hack to make sure date is in UTC all the time
        require('pg').types.setTypeParser(1114, (s:string)=>{
            return new Date(Date.parse(s + " UTC"));
        })
        
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

    async getEdge(hash: string){
        //Get edge
        const sql=`
        SELECT 
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
        FROM edges
        WHERE hash=$1
        `
        const client = this._getClient();
        try {
            await client.connect()
            const res = await client.query(sql,[hash]);
            return res.rows[0];
        } catch (e) {
            throw (e);
        } finally {
            await client.end()
        }

        
        

    }

    async findEdges(params: any){
        //find edges
        let where={};
        if(params.fromDID) where=sql.and(where,sql.in('from',params.fromDID))
        if(params.toDID)   where=sql.and(where,sql.in('to'  ,params.toDID))
        if(params.type)  where=sql.and(where,sql.in('type',params.type))
        if(params.since) where=sql.and(where,sql.gte('time', sql("to_timestamp("+params.since+")")))
        if(params.tag)   where=sql.and(where,sql.in('tag',params.tag))
        
        //TODO: param: claims

        const q=sql.select().from('edges')
            .where(where)
            .orderBy('time')
            .toString();
        console.log(q);

        const client = this._getClient();
        try {
            await client.connect()
            const res = await client.query(q);
            return res.rows;
        } catch (e) {
            throw (e);
        } finally {
            await client.end()
        }

    }

}

