require('dotenv').config();
const fs = require('fs');

const content = 'Some Content!';
const folderPath = process.env.LOCAL_FILE_PATH;
const folderName = `${folderPath}/friendly_name`;
// try {
//     if (!fs.existsSync(folderName)) {
//         fs.mkdirSync(folderName);
//     }
// } catch (err) {
//     console.error(err)
// }
// fs.writeFile(`${folderName}/test.txt`, content, (err) => {
//     if (err) {
//         console.error(err);
//         return;
//     }
//     console.log("File created!");
// });

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

createFile(folderPath, folderName, "test.txt", content);

