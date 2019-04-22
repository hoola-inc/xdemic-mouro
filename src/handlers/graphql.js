const { ApolloServer } = require('apollo-server-lambda');

module.exports = class GraphQLHandler {
    constructor (schemaMgr) {
        this.schemaMgr=schemaMgr
    }

    getHandler(){
        const schema = this.schemaMgr.getSchema()
        const server = new ApolloServer({
            schema,
            context: ({ event, context }) => ({
                headers: event.headers,
                functionName: context.functionName,
                event,
                context,
            }),
            introspection: true
        });

        return server.createHandler({
            cors: {
                origin: '*',
                credentials: true,
            },
        });
    }

}