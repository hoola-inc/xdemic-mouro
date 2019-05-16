import { eventType, contextType } from "./commonTypes";

export function createJsendHandler(handler:any){
    return (event:eventType, context:contextType, callback: any) => {
        handler.handle(event, context, (err:any, resp:any) => {
            let response;
            if (err == null) {
              response = {
                statusCode: 200,
                body: JSON.stringify({
                  status: "success",
                  data: resp,
                }),
                headers: {}
              };
            } else {
              //console.log(err);
              let code = 500;
              if (err.code) code = err.code;
              let message = err;
              if (err.message) message = err.message;
        
              response = {
                statusCode: code,
                body: JSON.stringify({
                  status: "error",
                  message: message
                }),
                headers: {}
              };
            }
        
            //CORS
            response.headers={
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
            };
        
            callback(null, response);
          });
    }
}


