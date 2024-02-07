(async () => {
    const fs = require("fs/promises");

    const numberJSON = await fs.readFile("number.json");
    const number = JSON.parse(numberJSON.toString("utf-8"));
    const databaseJSON = await fs.readFile(`database/${number - 1}.json`);
    await fs.writeFile(`database.json.backup`, databaseJSON.toString());
})();
