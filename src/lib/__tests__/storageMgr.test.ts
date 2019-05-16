import {StorageMgr, PersistedEdgeType} from '../storageMgr';


describe('StorageMgr', () => {
    
    
    let sut: StorageMgr;
    let edge: PersistedEdgeType;

    beforeAll((done) =>{
        sut = new StorageMgr();
        done();
    })

    test('empty constructor', () => {
        expect(sut).not.toBeUndefined();
    });


    describe("addEdge()", () => {
        test('no storage', (done)=> {
            edge={
                hash: 'someHash',
                from: 'did:from',
                to: 'did:to',
                type: 'someType',
                time: new Date()
            }
            sut.addEdge(edge)
            .then(()=> {
                fail("shouldn't return"); done()
            })
            .catch( (err: Error)=>{
                expect(err.message).toEqual('no underlying storage')
                done()
            })
        })
    })

});
