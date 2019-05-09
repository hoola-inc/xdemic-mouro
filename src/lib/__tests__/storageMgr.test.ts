
describe('StorageMgr', () => {
    
    const sutMgr = require('../storageMgr');
    let sut;

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
            .then((resp)=> {
                fail("shouldn't return"); done()
            })
            .catch( (err)=>{
                expect(err.message).toEqual('no underlying storage')
                done()
            })
        })
    })

});
