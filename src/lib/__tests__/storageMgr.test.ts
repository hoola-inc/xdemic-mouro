import {StorageMgr} from '../storageMgr';


describe('StorageMgr', () => {
    
    
    let sut: StorageMgr;

    beforeAll((done) =>{
        sut = new StorageMgr();
        done();
    })

    test('empty constructor', () => {
        expect(sut).not.toBeUndefined();
    });


    describe("someQuery()", () => {
        test('no storage', (done)=> {
            sut.someQuery('')
            .then((resp: string)=> {
                fail("shouldn't return"); done()
            })
            .catch( (err: Error)=>{
                expect(err.message).toEqual('no underlying storage')
                done()
            })
        })
    })

});
