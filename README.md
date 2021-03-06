# Twilio Services Download
The purpose of this script is to download all your twilio service functions automatically.
## Set Up and Running
1. pull the git project
1. npm install
1. functions
    * node service_sid.js
1. Assets
    * node asset_sids.js

### Issues
1. There is an issue with the downloading assets. The problem is when multiple folders are involved with your assets. for example /admin/functions/

### How the script works
The script leverages Twilio's API explorer to find a list of services on an account in an array, then loops through the array to find all functions related to that service, and then finds the lastest version of the function, then reads the function, copies it to your local machine.

Once the asset issue is resolved, the script takes a similar approuch to the assets. For assets you need to know the domain path and the name of your asset. You will need to append .twil.io 
> https://mydomain.twil.io/myassetname

### Notes
This is an open source script and not supported by Twilio. The script uses Twilio API calls that can be found by going to your Twilio console and typing in "Api Explorer" Select any one of the options. In the drop down select Serverless

change the sample-env to .env 
you will need you Account Sid / Auth Token || API Key / Secret. 
As you are free to use and modify this script, I do ask you to share any improvements you make on these scripts, though it is not required. 