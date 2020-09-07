const fs = require("fs");

const db = {
    readFile: (path) => {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path, {
                    flag: "a+",
                },
                (error, data) => {
                    if (error) reject(error);
                    let list = data.toString() ? JSON.parse(data.toString()) : [];
                    resolve(list);
                }
            );
        });
    },
    writeFile: (path, list) => {
        fs.writeFile(path, JSON.stringify(list) + "\n", (err) => {
            if (err) throw err;
            console.log("success");
        });
    }
}

module.exports = db;