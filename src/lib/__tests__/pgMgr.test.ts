import { StorageInterface } from "../storageMgr";

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

    test('date fix', ()=>{
    })

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

    describe("getEdge()", () => {
        test('fail', (done)=> {
            pgClientMock.query.mockImplementationOnce(()=>{throw Error('fail')});
            sut.getEdge("someHash")
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
            pgClientMock.query.mockImplementationOnce(()=>{return {rows:['OK']}});
            sut.getEdge('someHash')
            .then((resp)=> {
                expect(resp).toEqual('OK')
                done()
            })
        })
    })

    describe("findEdge()", () => {
        test('fail', (done)=> {
            pgClientMock.query.mockImplementationOnce(()=>{throw Error('fail')});
            sut.findEdges({})
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

        test('ok (empty)', (done)=> {
            pgClientMock.query.mockReset()
            pgClientMock.query.mockImplementationOnce(()=>{return {rows: ['OK']}});
            sut.findEdges({})
            .then((resp)=> {
                expect(resp).toEqual(['OK'])
                expect(pgClientMock.query).toBeCalledWith("SELECT * FROM edges ORDER BY time")
                done()
            })
        })

        test('ok (empty)', (done)=> {
            pgClientMock.query.mockReset()
            pgClientMock.query.mockImplementationOnce(()=>{return {rows: ['OK']}});
            sut.findEdges({})
            .then((resp)=> {
                expect(resp).toEqual(['OK'])
                expect(pgClientMock.query).toBeCalledWith("SELECT * FROM edges ORDER BY time")
                done()
            })
        })

        test('ok (fromDID)', (done)=> {
            pgClientMock.query.mockReset()
            pgClientMock.query.mockImplementationOnce(()=>{return {rows: ['OK']}});
            sut.findEdges({fromDID:['did1','did2']})
            .then((resp)=> {
                expect(resp).toEqual(['OK'])
                expect(pgClientMock.query).toBeCalledWith("SELECT * FROM edges WHERE \"from\" IN ('did1', 'did2') ORDER BY time")
                done()
            })
        })
        test('ok (toDID)', (done)=> {
            pgClientMock.query.mockReset()
            pgClientMock.query.mockImplementationOnce(()=>{return {rows: ['OK']}});
            sut.findEdges({toDID:['did1','did2']})
            .then((resp)=> {
                expect(resp).toEqual(['OK'])
                expect(pgClientMock.query).toBeCalledWith("SELECT * FROM edges WHERE \"to\" IN ('did1', 'did2') ORDER BY time")
                done()
            })
        })
        test('ok (type,since and tag)', (done)=> {
            pgClientMock.query.mockReset()
            pgClientMock.query.mockImplementationOnce(()=>{return {rows: ['OK']}});
            sut.findEdges({type:['type1','type2'],since:'2019',tag:['tag1','tag2']})
            .then((resp)=> {
                expect(resp).toEqual(['OK'])
                expect(pgClientMock.query).toBeCalledWith("SELECT * FROM edges WHERE (type IN ('type1', 'type2') AND time >= to_timestamp(2019)) AND tag IN ('tag1', 'tag2') ORDER BY time")
                done()
            })
        })


    })

});
