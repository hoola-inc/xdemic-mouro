const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;
import { readFileSync } from 'fs'
import { QueryResolverMgr } from './queryResolverMgr'
import { EdgeResolverMgr } from './edgeResolverMgr';
import { GraphQLScalarType } from 'graphql/type/definition';
import { Kind } from 'graphql/language/kinds';



export class SchemaMgr {

    queryResolverMgr: QueryResolverMgr;
    edgeResolverMgr: EdgeResolverMgr;

    constructor(queryResolverMgr: QueryResolverMgr, edgeResolverMgr: EdgeResolverMgr) {
        this.queryResolverMgr = queryResolverMgr
        this.edgeResolverMgr = edgeResolverMgr
    }

    _getTypeDefs(){
        return readFileSync(__dirname + '/schema.graphqls', 'utf8')
    }

    _getResolvers(){
        return {
            Query: {
                //Return identity for the API token issuer
                me: async (parent: any, args: any, context: any, info: any) => {
                    const res=await this.queryResolverMgr.me(context.headers)
                    return res
                },
                // Return an edge by hash
                edgeByHash: async (parent: any, args: any, context: any, info: any) => {
                    const res=await this.queryResolverMgr.edgeByHash(context.headers,args.hash)
                    return res
                },
                //Find edges
                findEdges: async (parent: any, args: any, context: any, info: any) => {
                    const res=await this.queryResolverMgr.findEdges(context.headers,args)
                    return res
                },
            },
            Mutation: {
                addEdge: async (parent: any, args: any, context: any, info: any) => {
                    const res=await this.edgeResolverMgr.addEdge(args.edgeJWT)
                    return res
                }, 
            },
            Date: new GraphQLScalarType({
                name: 'Date',
                description: 'Date custom scalar type',
                parseValue(value) {
                  return value; // value from the client
                },
                serialize(value) {
                    //value is a Date object
                    return value.getTime()/1000; // value sent to the client
                },
                parseLiteral(ast) {
                  if (ast.kind === Kind.INT) {
                    return parseInt(ast.value) // ast value is always in string format
                  }
                  return null;
                },
            }),

        };

    }

    getSchema() {
        const typeDefs=this._getTypeDefs();
        const resolvers = this._getResolvers();
        return makeExecutableSchema({
            typeDefs,
            resolvers,
        });
    }

}
