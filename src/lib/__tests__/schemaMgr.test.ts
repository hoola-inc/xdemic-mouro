import {SchemaMgr} from '../schemaMgr';
import { QueryResolverMgr } from '../queryResolverMgr'
import { GraphQLSchema } from 'graphql';


describe('SchemaMgr', () => {
    
    
    let sut: SchemaMgr;
    let mockQueryResolverMgr:QueryResolverMgr;  

    beforeAll((done) =>{
        sut = new SchemaMgr(mockQueryResolverMgr);
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
