exports.handler = async function (context, event, callback) {

    const response = new Twilio.Response();

    const client = context.getTwilioClient();
    const destination = event.number;
    console.log(destination)

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    client.calls.list({ to: destination, limit: 2 })
        .then(calls => {
            const results = calls.map(s => {
                return s.sid
            })
            console.log(results)
            const jsonresult = JSON.stringify(results);
            response.setHeaders(headers);
            response.setBody(jsonresult);
            return callback(null, response)
        })
        .catch((error) => {
            console.error(error);
            return callback(error);
        });
}