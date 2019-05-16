const didJWT = require('did-jwt');
const blake = require('blakejs')

import { StorageMgr, PersistedEdgeType } from "./storageMgr";

export class EdgeResolverMgr {

    storageMgr: StorageMgr;

    constructor(storageMgr: StorageMgr) {
        this.storageMgr = storageMgr
    }

    async addEdge(edgeJWT: string){
        //blake2b hash of the original message
        const hash = blake.blake2bHex(edgeJWT)
        console.log("hash:"+hash);

        //Verify that the body is a proper JWT
        //This can take up to 3 secc
        console.log("verifyJWT...")
        const verifiedJWT = await didJWT.verifyJWT(edgeJWT);
        console.log(verifiedJWT);

        const edgeObject:PersistedEdgeType={
            hash: hash,
            from: verifiedJWT.payload.iss,
            to:   verifiedJWT.payload.sub,
            type:  verifiedJWT.payload.type,
            time: new Date(verifiedJWT.payload.iat*1000),
            tag:  verifiedJWT.payload.tag,
            claim: verifiedJWT.payload.claim,
            encPriv: verifiedJWT.payload.encPriv,
            encShar: verifiedJWT.payload.encShar
        }
        console.log("edge decoded")
        console.log(edgeObject);

        //Persist edge
        await this.storageMgr.addEdge(edgeObject);
        return edgeObject;
    }
}


