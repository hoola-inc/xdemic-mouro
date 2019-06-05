import { createJsendHandler } from "../jsend";
import { eventType, contextType } from "../commonTypes";

describe('createJsendHandler', () => {

    test('ok', (done) => {
        const handler = {
            handle: (event:eventType ,context:contextType ,cb:any ) => {
                cb(null,{good: "data"});
                return;
            }
        }
        const jsendHandler = createJsendHandler(handler);
        jsendHandler({},{},(err:any,res:any)=>{
            expect(err).toBeNull()
            expect(res).not.toBeNull()
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual('{\"status\":\"success\",\"data\":{\"good\":\"data\"}}');
            expect(res.headers['Access-Control-Allow-Origin']).toEqual('*')
            expect(res.headers['Access-Control-Allow-Credentials']).toEqual(true)
            done();
        })
    })

    test('error without code', (done) => {
        const handler = {
            handle: (event:eventType,context:contextType,cb:any) => {
                cb("bad");
                return;
            }
        }
        const jsendHandler = createJsendHandler(handler);
        jsendHandler({},{},(err:any,res:any)=>{
            expect(err).toBeNull()
            expect(res).not.toBeNull()
            expect(res.statusCode).toEqual(500);
            expect(res.body).toEqual('{\"status\":\"error\",\"message\":\"bad\"}');
            expect(res.headers['Access-Control-Allow-Origin']).toEqual('*')
            expect(res.headers['Access-Control-Allow-Credentials']).toEqual(true)
            done();
        })
    })


    test('error with code', (done) => {
        const handler = {
            handle: (event:eventType,context:contextType,cb:any) => {
                cb({code: 401, message: "bad"});
                return;
            }
        }
        const jsendHandler = createJsendHandler(handler);
        jsendHandler({},{},(err:any,res:any)=>{
            expect(err).toBeNull()
            expect(res).not.toBeNull()
            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual('{\"status\":\"error\",\"message\":\"bad\"}');
            expect(res.headers['Access-Control-Allow-Origin']).toEqual('*')
            expect(res.headers['Access-Control-Allow-Credentials']).toEqual(true)
            done();
        })
    })

});
