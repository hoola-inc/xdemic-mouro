const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;
import { readFileSync } from 'fs'
import { QueryResolverMgr } from './queryResolverMgr'
import { EdgeResolverMgr } from './edgeResolverMgr';



export class SchemaMgr {

    queryResolverMgr: QueryResolverMgr;
    edgeResolverMgr: EdgeResolverMgr;

    constructor(queryResolverMgr: QueryResolverMgr, edgeResolverMgr: EdgeResolverMgr) {
        this.queryResolverMgr = queryResolverMgr
        this.edgeResolverMgr = edgeResolverMgr
    }

    getSchema() {
        const typeDefs = readFileSync(__dirname + '/schema.graphqls', 'utf8')

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
