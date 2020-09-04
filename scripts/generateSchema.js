const fs = require("fs");
const path = require("path");
const { printSchema } = require("graphql");
const ccimsSchema = require("../out/api/resolvers/CCIMSSchema");

var gqlSchema = printSchema(ccimsSchema.default);

var outFileName = "";
outFileName = process.argv.filter(param => param.match(/.*.graphql/i))[0] || "";
if (outFileName.length > 0 && outFileName != "-") {
    fs.writeFileSync(path.join(outFileName), gqlSchema);
} else {
    process.stdout.write(gqlSchema);
}