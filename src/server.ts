//Load Mgrs
import { DidResolverMgr } from "./lib/didResolverMgr";
import { AuthMgr } from "./lib/authMgr";
import { StorageMgr } from "./lib/storageMgr";
import { QueryResolverMgr } from "./lib/queryResolverMgr";
import { EdgeResolverMgr } from "./lib/edgeResolverMgr";
import { SchemaMgr } from "./lib/schemaMgr";

//Instanciate Mgr
let didResolverMgr = new DidResolverMgr();
let authMgr = new AuthMgr(didResolverMgr);
let storageMgr = new StorageMgr();
let queryResolverMgr = new QueryResolverMgr(authMgr, storageMgr);
let edgeResolverMgr = new EdgeResolverMgr(didResolverMgr, storageMgr);
let schemaMgr = new SchemaMgr(queryResolverMgr, edgeResolverMgr);

const { ApolloServer } = require("apollo-server-express");
const schema = schemaMgr.getSchema();
const server = new ApolloServer({
  schema,
  context: (p: any) => {
    return {
      headers: p.req.headers
    };
  },
  introspection: true,
  playground: true,
  graphqlPath: "/graphql"
});

import * as express from "express";
// import { declareFunction } from "@babel/types";
const app = express();
server.applyMiddleware({ app }); // app is from an existing express app

// default url

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Mouro"
  });
});

app.get("/authtoken", async (req, res) => {
  try {
    const token = await require("../dev-scripts/create-newman-env").f(req, res);
    // return res.status(200).json({
    //   status: true,
    //   data: token
    // });
  } catch (error) {
    res.status(200).json({
      status: false,
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  )
);
