//create axios fetch request
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
//const fw = import('./filewriter');
//env variables
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const folderPath = `${process.env.LOCAL_FILE_PATH}`;
const requestUrl = `https://${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}@serverless.twilio.com/v1/Services`;

const buildUrl = `https://${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}@serverless.twilio.com/v1/Services/ZS186e4c332336cd165b8edede4c37cd5a/Builds`;
h
const options = {
    method: 'GET',
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    }

}
//creates file on your local machine
function createFile(folderPath, folderName, fileName, content) {
    try {
        if (!fs.existsSync(`versions/${folderPath}/${folderName}`)) {
            fs.mkdirSync(`versions/${folderName}`);
        }
    } catch (err) {
        console.error(err)
    }
    fs.writeFile(`versions/${folderName}/${fileName}`, content, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("File created!");
    });
}

//END OF FILE WRITING FUNCTION
//determines version of function
const versionResponseGenerator = (serviceSid, functionSid, friendly_name, function_friendly_name) => {
    const requestFunctionsUrl = `https://${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}@serverless.twilio.com/v1/Services/${serviceSid}/Functions/${functionSid}/Versions`;
    return axios.get(requestFunctionsUrl)
        .then(response => {
            const versions = response.data.function_versions[0].sid
            console.log(`${functionSid}`);
            console.log("Function Name", function_friendly_name)
            console.log("serviceSid", serviceSid);
            console.log("functionSid", functionSid);
            console.log("version", versions);
            versionResponseWriter(friendly_name, serviceSid, functionSid, versions, function_friendly_name);
            //console.log(functions)
            return versions
        })
        .catch(error => {
            console.log(error)
        }
        );
}

const versionResponseWriter = async (friendly_name, serviceSid, functionSid, versionSid, function_friendly_name) => {
    //Services/[ServiceSid]/Functions/[FunctionSid]/Versions/[FunctionVersionContentSid]/Content
    const versionUrl = `https://${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}@serverless.twilio.com/v1/Services/${serviceSid}/Functions/${functionSid}/Versions/${versionSid}/Content`;
    const versionResponse = await axios.get(versionUrl)
        .then(response => {
            console.log(response.data.content);
            console.log(`${friendly_name}`);
            createFile(`${folderPath}`, friendly_name, `${function_friendly_name}.js`, response.data.content);
            return response.data.content;
        })
        .catch(error => {
            console.log(error);
        });

}

const functionResponseGenerator = (serviceSid, friendlyName) => {
    const requestFunctionsUrl = `https://${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}@serverless.twilio.com/v1/Services/${serviceSid}/Functions`;
    return axios.get(requestFunctionsUrl)
        .then(response => {
            const functions = response.data.functions
            // console.log("format", formatResponse(functions));
            functions.forEach(element => {
                console.log("FRIENDLY", element.friendly_name);
                versionResponseGenerator(serviceSid, element.sid, friendlyName, element.friendly_name);
                //   console.log("service sid", serviceSid);
                //  console.log(element.sid);
                // console.log(element.friendly_name);

            });
            //console.log(functions)
            return functions
        })
        .catch(error => {
            console.log(error)
        }
        );
}
const assetResonseGenerator = (serviceSid) => {
    const requestFunctionsUrl = `https://${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}@serverless.twilio.com/v1/Services/${serviceSid}/Assets`;
    return axios.get(requestFunctionsUrl)
        .then(response => {
            const assets = response.data.assets
            console.log(assets);
            console.log(formatResponse(assets));
            //console.log(functions)
            return assets
        })
        .catch(error => {
            console.log(error)
        }
        );
}


function formatResponse(response) {
    let responseString = "";
    const responseArray = [];
    response.forEach(element => {
        responseString += `${element.sid} ${element.friendly_name}\n`;
        //console.log(responseString);
        responseArray.push({
            sid: element.sid,
            friendly_name: element.friendly_name
        })
    }

    );
    return responseArray;
}

const serviceApi = async () => {
    const axioResponse = await axios.get(requestUrl)
        .then(response => {
            const services = response.data.services

            services.forEach(element => {
                // console.log(element.sid);
                // console.log(element.friendly_name);
                functionResponseGenerator(element.sid, element.friendly_name);
                //functionResponseGenerator(element.sid, element.friendly_name);
                // functionResponseGenerator(element.sid, element.friendly_name);


            });
            //console.log(formatResponse(services));
            //  const serviceList = formatResponse(services);
            //  console.log(serviceList);
            return services;
        })
        .catch(error => {
            console.log(error);
        }
        );
}

const buildSids = async () => {
    const axioResponse = await axios.get(buildUrl)
        .then(response => {
            console.log(response.data);
            // return service.sid;
            //console.log(service);
            console.log("buildUrl", buildUrl);

        })
        .catch(error => {
            console.log("error");
            console.log("buildUrl", buildUrl);
        }
        );
}

//creates 
serviceApi()
