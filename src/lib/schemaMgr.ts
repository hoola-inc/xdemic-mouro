const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;

module.exports = class SchemaMgr {

    queryResolverMgr: any;

    constructor(queryResolverMgr) {
        this.queryResolverMgr = queryResolverMgr
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
        `;

        const resolvers = {
            Query: {
                //Return identity for the API token issuer
                me: async (parent, args, context, info) => {
                    const res=await this.queryResolverMgr.me(context.headers)
                    return res
                },
            },
        };

        return makeExecutableSchema({
            typeDefs,
            resolvers,
        });
    }

}
