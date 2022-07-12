
//import * as stream from 'stream';
const download = require('download');
const https = require("https");
const fs = require("fs");
const axios = require("axios");
require('dotenv').config();
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const folderPath = process.env.LOCAL_FILE_PATH;
console.log("folderPath", folderPath);
//add corisponding folder, this env variable is shared between functions and services sids. 
outputLocationPath = `${folderPath}/assets`;
const baseUrl = `https://${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}@serverless.twilio.com/v1/Services`;


console.log("starting");

console.log(baseUrl);
//gets domain name from url
//To Test the download asset, put in a test url to an image and supply the output location path
function downloadAsset(url, outputLocation) {
    //issue here, confused about the asset being downloaded. 
    //this is most likely due to the ammount of folders in the path
    //the checking to see if it exists is from service_sid.js, and would need to be addressed to create folder. 
    // if (!fs.existsSync(`${outputLocationPath}`)) {
    //     fs.mkdirSync(`versions/${folderName}`);
    // }
    https.get(url, (res) => {
        const writeStream = fs.createWriteStream(outputLocation);

        res.pipe(writeStream);

        writeStream.on("finish", () => {
            writeStream.close();
            console.log("Download Completed");
        });
    });
}


//gets domain for assets from the service sid
async function getDomainName(serviceSid) {
    const assetService = `${baseUrl}/${serviceSid}`;
    //console.log("assetService: ", assetService);
    const assetRequest = axios.get(assetService)
        .then(response => {
            const assetsBase = response.data.domain_base;
            console.log("assets", assetsBase);
            return assetsBase;
        })
        .catch(error => {
            console.log(error);
        }
        );
    return assetRequest;
}
//get versions
const versionApi = async (serivceSid, AssetSid, domainName, serviceUnqiueName) => {
    const versionRequest = axios.get(`${baseUrl}/${serivceSid}/Assets/${AssetSid}/Versions`)
        .then(response => {
            const versions = response.data;
            console.log("versions", versions.asset_versions[0].path);
            console.log("UNIQUENAME", serviceUnqiueName, "DOWNLOAD", `https://${domainName}.twil.io${versions.asset_versions[0].path}`);
            downloadAsset(`https://${domainName}.twil.io${versions.asset_versions[0].path}`, `${folderPath}${serviceUnqiueName}${versions.asset_versions[0].path}`);

            return versions;
        }
        )
        .catch(error => {
            console.log(error);
        }
        );
    return versionRequest;
}
//versionApi("ZScf622767d7b278463c37bcbab181c4b2", "ZHd13b8f9f3871bc9f134a840dbf199b71")



const assetList = async (serviceSid, domainBase, serverUniqueName) => {
    const assetService = `${baseUrl}/${serviceSid}/Assets`;
    const assetRequest = axios.get(assetService)
        .then(response => {
            const assets = response.data.assets;
            // console.log("assets", assets);
            getDomainName(serviceSid);
            console.log("SERVICE SIDE", serviceSid);
            assets.forEach(element => {
                console.log("service sid", element.service_sid);
                console.log("asset sid", element.sid);
                versionApi(serviceSid, element.sid, domainBase, serverUniqueName);
            });
            return assets;
        }
        )
        .catch(error => {
            console.log(error);
        }
        );
    return assetRequest;

}
//Lists all services
const serviceApi = async (requestUrl) => {
    //from service_sid.js
    //fix this request URL
    const axioResponse = await axios.get(requestUrl)
        .then(response => {
            const services = response.data.services
            services.forEach(element => {
                assetList(element.sid, element.domain_base, element.unique_name);
                console.log("service sid", element.sid);
                console.log("service_domain", element.domain_base);
            });
            return services;
        })
        .catch(error => {
            console.log(error);
        }
        );
}


//initiates the api call
//serviceApi(baseUrl);

