"use strict";
const createSecretsWrappedHandler = require("./lib/secrets_wrapper");

//Load Mgrs
const QueryResolverMgr = require("./lib/queryResolverMgr");
const SchemaMgr = require('./lib/schemaMgr');

//Instanciate Mgr
let queryResolverMgr = new QueryResolverMgr();
let schemaMgr = new SchemaMgr(queryResolverMgr);

//Mgr that needs secrets handling
const secretsMgrArr=[];

//Load handlers
const GraphQLHandler = require("./handlers/graphql");

//Instanciate handlers
const graphqlHandler = (new GraphQLHandler(schemaMgr)).getHandler()

//Exports for serverless
exports.graphql = createSecretsWrappedHandler(secretsMgrArr,graphqlHandler);
