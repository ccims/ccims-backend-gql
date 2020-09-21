const fs = require("fs");
const path = require("path");

var databaseScript = "";

var files = ["reset.sql", "common.sql", "issue.sql", "user.sql", "project.sql", "ims.sql", "coreData.sql"];
files.filter(name => name.match(/.*\.sql/i)).forEach(name => {
    databaseScript += fs.readFileSync(path.join(__dirname, "..", "database", name), { encoding: "utf-8" });
});

var outFileName = "";
outFileName = process.argv.filter(param => param.match(/.*.sql/i))[0] || "";
if (outFileName.length > 0 && outFileName != "-") {
    fs.writeFileSync(path.join(outFileName), databaseScript);
} else {
    process.stdout.write(databaseScript);
}