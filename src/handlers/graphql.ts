const { ApolloServer } = require('apollo-server-lambda');

module.exports = class GraphQLHandler {

    schemaMgr: any;

    constructor (schemaMgr: any) {
        this.schemaMgr=schemaMgr
    }

    getHandler(){
        const schema = this.schemaMgr.getSchema()
        const server = new ApolloServer({
            schema,
            context: (p: any) => {
                const event=p.event;
                const context=p.context;
                return ({
                    headers: event.headers,
                    functionName: context.functionName,
                    event,
                    context,
                });
            },
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