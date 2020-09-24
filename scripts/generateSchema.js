const fs = require("fs");
const path = require("path");
const { printSchema } = require("graphql");
const ccimsSchema = require("../out/api/resolvers/CCIMSSchema");
const ccimsPublicSchema = require("../out/api/publicResolvers/ccimsPublicSchema");

const printPublicSchema = process.argv.some(param => !!param.match(/^-(-)?p(ublic)?$/i));
let gqlSchema = "";
if (printPublicSchema) {
    gqlSchema = printSchema(ccimsPublicSchema.default);
} else {
    gqlSchema = printSchema(ccimsSchema.default);
}

var outFileName = "";
outFileName = process.argv.filter(param => !!param.match(/.g(raph)?ql$/i))[0] || "";
console.log(process.argv);
console.log(outFileName);
if (outFileName.length > 0 && outFileName !== "-") {
    fs.writeFileSync(path.join(outFileName), gqlSchema);
} else {
    process.stdout.write(gqlSchema);
}