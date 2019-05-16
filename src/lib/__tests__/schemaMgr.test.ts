import {SchemaMgr} from '../schemaMgr';
import { QueryResolverMgr } from '../queryResolverMgr'
import { GraphQLSchema } from 'graphql';
import { EdgeResolverMgr } from '../edgeResolverMgr';


describe('SchemaMgr', () => {
    
    
    let sut: SchemaMgr;
    let mockQueryResolverMgr:QueryResolverMgr;  
    let mockEdgeResolverMgr:EdgeResolverMgr;  

    beforeAll((done) =>{
        sut = new SchemaMgr(mockQueryResolverMgr, mockEdgeResolverMgr);
        done();
    })

    test('empty constructor', () => {
        expect(sut).not.toBeUndefined();
    });


    describe("getSchema()", () => {
        test('getSchema', ()=> {
            const schema:GraphQLSchema =sut.getSchema();
            expect(schema).toBeInstanceOf(GraphQLSchema)
        })
    })

});
