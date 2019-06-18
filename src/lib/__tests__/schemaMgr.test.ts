import {SchemaMgr} from '../schemaMgr';
import { GraphQLSchema, Kind } from 'graphql';
import { QueryResolverMgr } from '../queryResolverMgr';
import { EdgeResolverMgr } from '../edgeResolverMgr';

let storageMgrMock = {
    storage: {
        init: jest.fn(),
        addEdge: jest.fn(), 
        getEdge: jest.fn(),
        findEdges: jest.fn()
    },
    addEdge: jest.fn(), 
    getEdge: jest.fn(),
    findEdges: jest.fn()
}
let mockQueryResolverMgr = {
    me: jest.fn(),
    edgeByHash: jest.fn(),
    findEdges: jest.fn(),
    authMgr: {
        verify: jest.fn(),
        verifyAuthorizationHeader: jest.fn(),
        isAllowed: jest.fn()
    },
    storageMgr: storageMgrMock
};

let mockEdgeResolverMgr = {
    storageMgr: storageMgrMock,
    addEdge: jest.fn()
}

describe('SchemaMgr', () => {
    
    
    let sut: SchemaMgr;

    beforeAll((done) =>{
        sut = new SchemaMgr(mockQueryResolverMgr, mockEdgeResolverMgr);
        done();
    })

    test('empty constructor', () => {
        expect(sut).not.toBeUndefined();
    });

    describe('getResolver',()=>{

        test('Query.me',(done)=>{
            mockQueryResolverMgr.me.mockImplementationOnce((h)=>{return h})
            const me = sut._getResolvers()['Query'].me;
            me({},{},{headers: 'head'},{})
            .then((res:any)=>{
                expect(res).toEqual('head');
                expect(mockQueryResolverMgr.me).toBeCalledWith('head')
                done();
            })
        })

        test('Query.edgeByHash',(done)=>{
            mockQueryResolverMgr.edgeByHash.mockImplementationOnce((h,hs)=>{return [h,hs]})
            const edgeByHash = sut._getResolvers()['Query'].edgeByHash;
            edgeByHash({},{hash: 'hash'},{headers: 'head'},{})
            .then((res:any)=>{
                expect(res).toEqual(['head','hash']);
                expect(mockQueryResolverMgr.edgeByHash).toBeCalledWith('head','hash')
                done();
            })
        })

        test('Query.findEdges',(done)=>{
            mockQueryResolverMgr.findEdges.mockImplementationOnce((h,args)=>{return [h,args]})
            const findEdges = sut._getResolvers()['Query'].findEdges;
            findEdges({},'args',{headers: 'head'},{})
            .then((res:any)=>{
                expect(res).toEqual(['head','args']);
                expect(mockQueryResolverMgr.findEdges).toBeCalledWith('head','args')
                done();
            })
        })

        test('Mutation.addEdge',(done)=>{
            mockEdgeResolverMgr.addEdge.mockImplementationOnce((e)=>{return [e]})
            const addEdge = sut._getResolvers()['Mutation'].addEdge;
            addEdge({},{edgeJWT: 'edge'},{},{})
            .then((res:any)=>{
                expect(res).toEqual(['edge']);
                expect(mockEdgeResolverMgr.addEdge).toBeCalledWith('edge')
                done();
            })
        })

        test('Date Scalar Type',()=>{
            const dateType = sut._getResolvers()['Date'];
            expect(dateType.parseValue('v')).toEqual('v');
            expect(dateType.serialize(new Date(100000000000))).toEqual(100000000);
            expect(dateType.parseLiteral({kind: Kind.BOOLEAN, value:false},null)).toBeNull();
            expect(dateType.parseLiteral({kind: Kind.INT, value:'1'},null)).toEqual(1);
            
        })
    })

    test('getSchema', ()=> {
        const schema:GraphQLSchema =sut.getSchema();
        expect(schema).toBeInstanceOf(GraphQLSchema)
    })

});
