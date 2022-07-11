
// This is your new function. To start, set the name and path on the left.

exports.handler = function(context, event, callback) {
const accountSid = context.ACCOUNT_SID; 
const authToken = context.AUTH_TOKEN; 
const client = require('twilio')(accountSid, authToken); 
console.log(event)
try{
// for (const [key, value] of Object.entries(event)) {
//   console.log(`${key}: ${value}`);
// }
console.log(event.From)
}catch(e){
      console.log("error", e)
}
client.messages 
      .create({ 
         body: 'I am glad you have this working.', 
         from: 'whatsapp:+14155238886',       
         to: 'whatsapp:+16268985404' 
       }) 
      .then(message => console.log(message.sid)) 
      .done();
};
