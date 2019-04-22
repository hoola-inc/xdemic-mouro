"use strict";

//Load Mgrs
const AuthMgr = require('./lib/authMgr');
const QueryResolverMgr = require("./lib/queryResolverMgr");
const SchemaMgr = require('./lib/schemaMgr');

//Instanciate Mgr
let authMgr = new AuthMgr();
let queryResolverMgr = new QueryResolverMgr(authMgr);
let schemaMgr = new SchemaMgr(queryResolverMgr);

//Load handlers
const GraphQLHandler = require("./handlers/graphql");

//Instanciate handlers
const graphqlHandler = (new GraphQLHandler(schemaMgr)).getHandler()

//Exports for serverless
exports.graphql = graphqlHandler;
