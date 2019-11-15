import { DidResolverMgr } from "../didResolverMgr";


describe('DidResolverMgr', () => {

    let sut: DidResolverMgr;

    beforeAll((done) =>{
        sut = new DidResolverMgr();
        done();
    })

    test('empty constructor', () => {
        expect(sut).not.toBeUndefined();
    });

    test('no infura project id', () => {
        delete process.env.INFURA_PROJECT_ID;
        let didres=new DidResolverMgr();
        expect(didres.resolver.registry.ethr).not.toBeDefined();            
    });

    test('getResolver()', ()=>{
        const res=sut.getResolver();
        expect(res.registry).toBeDefined();
        expect(res.registry.ethr).toBeDefined();
    })
})