//create axios fetch request
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
//const fw = import('./filewriter');
//env variables
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const folderPath = process.env.LOCAL_FILE_PATH;
const requestUrl = `https://${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}@serverless.twilio.com/v1/Services`;
//https://serverless.twilio.com/v1/Services/ZS186e4c332336cd165b8edede4c37cd5a/Builds

const buildUrl = `https://${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}@serverless.twilio.com/v1/Services/ZS186e4c332336cd165b8edede4c37cd5a/Builds`;

//VERSIONS: https://${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}@serverless.twilio.com/v1/Services/${ZS}/Functions/ZH2/Versions'

//https://${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}@serverless.twilio.com/v1/Services/${serviceSid}/Functions/${functionSid}/Versions


//https://serverless.twilio.com/v1/Services/ZSd40d69ad093d7d4cce9468ece50e6210/Functions
//SERVICE BUILD > https://serverless.twilio.com/v1/Services/ZScf622767d7b278463c37bcbab181c4b2/Builds/ZB3921e0ef51fd90689dd5a8e77c8445b1
const options = {
    method: 'GET',
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    }

}
//FILE WRITING FUNCTION
function createFile(folderPath, folderName, fileName, content) {
    try {
        if (!fs.existsSync(`${folderPath}/${folderName}`)) {
            fs.mkdirSync(folderName);
        }
    } catch (err) {
        console.error(err)
    }
    fs.writeFile(`${folderName}/${fileName}`, content, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("File created!");
    });
}

//END OF FILE WRITING FUNCTION

const versionResponseGenerator = (serviceSid, functionSid) => {
    const requestFunctionsUrl = `https://${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}@serverless.twilio.com/v1/Services/${serviceSid}/Functions/${functionSid}/Versions`;
    return axios.get(requestFunctionsUrl)
        .then(response => {
            const versions = response.data.function_versions[0].sid
            console.log(versions);
            //console.log(functions)
            return versions
        })
        .catch(error => {
            console.log(error)
        }
        );
}

const versionResponseWriter = async (serviceSid, functionSid, versionSid) => {
    //Services/[ServiceSid]/Functions/[FunctionSid]/Versions/[FunctionVersionContentSid]/Content
    const versionUrl = `https://${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}@serverless.twilio.com/v1/Services/${serviceSid}/Functions/${functionSid}/Versions/${versionSid}/Content`;
    const versionResponse = await axios.get(versionUrl)
        .then(response => {
            console.log(response.data.content);
            createFile(folderPath, "versions", `${functionSid}_${versionSid}.js`, response.data.content);
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
                console.log("service sid", serviceSid);
                console.log(element.sid);
                console.log(element.friendly_name);

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
                console.log(element.sid);
                console.log(element.friendly_name);
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

//buildSids();
serviceApi()
//versionResponseGenerator("ZS186e4c332336cd165b8edede4c37cd5a", "ZHa375573dfe8c1d9fe0d1d9bbfa768cd2")
//functionResponseGenerator("ZS186e4c332336cd165b8edede4c37cd5a");
//assetResonseGenerator("ZScf622767d7b278463c37bcbab181c4b2");

/*
Service Friendly Name: voicemail
Service Sid: ZHd0b9ed932b5b8d4bfe70fcecfce983e7
Function Sid: ZS186e4c332336cd165b8edede4c37cd5a
Version Sid: ZN9c04146376f699a5ba329ac981b61eae
*/

//versionResponseWriter("ZS186e4c332336cd165b8edede4c37cd5a", "ZHa375573dfe8c1d9fe0d1d9bbfa768cd2", "ZN9c04146376f699a5ba329ac981b61eae");