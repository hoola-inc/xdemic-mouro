
describe('StorageMgr', () => {
    
    const sutMgr = require('../storageMgr');
    let sut: any;

    beforeAll((done) =>{
        sut = new sutMgr();
        done();
    })

    test('empty constructor', () => {
        expect(sut).not.toBeUndefined();
    });


    describe("someQuery()", () => {
        test('no storage', (done)=> {
            sut.someQuery()
            .then((resp: any)=> {
                fail("shouldn't return"); done()
            })
            .catch( (err: Error)=>{
                expect(err.message).toEqual('no underlying storage')
                done()
            })
        })
    })

});
