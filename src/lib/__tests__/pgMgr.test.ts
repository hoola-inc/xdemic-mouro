import { StorageInterface } from "../storageMgr";
import { AuthMgr } from "../authMgr";

jest.mock("pg");
const { Client } = require("pg");
let pgClientMock = {
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn()
};
Client.mockImplementation(() => {
  return pgClientMock;
});


describe('PgMgr', () => {
    
    
    let sut:StorageInterface;

    beforeAll((done) =>{
        sut = new (require("../pgMgr"))()
        done();
    })

    test('empty constructor', () => {
        expect(sut).not.toBeUndefined();
    });

    describe("init", ()=>{
        test('fail', (done)=>{
            pgClientMock.query.mockImplementationOnce(()=>{ throw Error('fail')})
            sut.init()
            .then(()=>{
                fail("shouldn't return")
            })
            .catch((e)=>{
                expect(pgClientMock.connect).toBeCalled()
                expect(pgClientMock.query).toBeCalled()
                expect(pgClientMock.end).toBeCalled()
                expect(e.message).toEqual('fail')
                done()
            })
        })
        test('ok', ()=>{
            sut.init()
            .then(()=>{
                expect(pgClientMock.connect).toBeCalled()
                expect(pgClientMock.query).toBeCalled()
                expect(pgClientMock.end).toBeCalled()
                
            });
        })
    
    })

    describe("addEdge()", () => {
        test('fail', (done)=> {
            pgClientMock.query.mockImplementationOnce(()=>{throw Error('fail')});
            const edge={
                hash: 'someHash',
                from: 'did:from',
                to: 'did:to',
                type: 'someType',
                time: new Date(),
                jwt: 'ey...'
            }
            sut.addEdge(edge)
            .then((resp)=> {
                fail("shouldn't return")
            })
            .catch((e)=>{
                expect(pgClientMock.connect).toBeCalled()
                expect(pgClientMock.query).toBeCalled()
                expect(pgClientMock.end).toBeCalled()
                expect(e.message).toEqual('fail')
                done()
            })
        })

        test('ok', (done)=> {
            pgClientMock.query.mockImplementationOnce(()=>{return 'OK'});
            const edge={
                hash: 'someHash',
                from: 'did:from',
                to: 'did:to',
                type: 'someType',
                time: new Date(),
                jwt: 'ey...'
            }
            sut.addEdge(edge)
            .then((resp)=> {
                expect(resp).toEqual('OK')
                done()
            })
        })
    })

});
