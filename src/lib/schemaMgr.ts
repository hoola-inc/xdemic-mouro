const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;

import { QueryResolverMgr } from './queryResolverMgr'
import { PersistedEdgeType, StorageMgr } from './storageMgr';
import { EdgeResolverMgr } from './edgeResolverMgr';



export class SchemaMgr {

    queryResolverMgr: QueryResolverMgr;
    edgeResolverMgr: EdgeResolverMgr;

    constructor(queryResolverMgr: QueryResolverMgr, edgeResolverMgr: EdgeResolverMgr) {
        this.queryResolverMgr = queryResolverMgr
        this.edgeResolverMgr = edgeResolverMgr
    }

    getSchema() {
        const typeDefs = `
            
            type Query {
                # Return identity for the API token issuer
                me: Identity! 
            }

            #Identity type.
            type Identity {
                # Decentralized Identifier (DID) of the Identity
                did: String!
            }

            scalar Date

            type Edge {
                hash: ID!
                jwt: String!
                from: Identity!
                to: Identity!
                type: String!
                time: Date!
                tag: String
            }

            type Mutation {
                addEdge(edgeJWT: String): Edge
            }
        `;

        const resolvers = {
            Query: {
                //Return identity for the API token issuer
                me: async (parent: any, args: any, context: any, info: any) => {
                    const res=await this.queryResolverMgr.me(context.headers)
                    return res
                },
            },
            Mutation: {
                addEdge: async (parent: any, args: any, context: any, info: any) => {
                    try{
                        const res=await this.edgeResolverMgr.addEdge(args.edgeJWT)
                        return res
                    }catch(e){
                        console.error(e);
                        throw e;
                    }
                }, 
            }
        };

        return makeExecutableSchema({
            typeDefs,
            resolvers,
        });
    }

}
