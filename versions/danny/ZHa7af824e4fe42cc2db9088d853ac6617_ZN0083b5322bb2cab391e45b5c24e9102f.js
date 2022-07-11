exports.handler = function (context, event, callback) {
    const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.appendHeader('Content-Type', 'application/json');
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    client.taskrouter.workspaces(event.WorkspaceSid)
        .workers(event.workerSid)
        .update({
            attributes: JSON.stringify(event.attributes)
        })
        .then(worker => {
            response.setStatusCode(200);
            response.setBody({success: worker})
            callback(null, response)
        })
        .catch(error => {
            console.log(error)
            response.setStatusCode(500);
            response.setBody({error: error})
        })
    
}