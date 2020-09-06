const fs = require("fs");
const path = require("path");

const outPath = path.join(__dirname, "../src/api/resolvers");

var walk = function (dir, done) {
    var results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function (file) {
            file = path.resolve(dir, file);
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};


walk(outPath, (err, res) => {
    let out = "";
    let out2 = "[";
    console.log(path.extname(res[37]).endsWith("ts"));
    console.log(path.basename(res[37]).startsWith("GraphQL"));
    res.filter(name => path.extname(name).endsWith("ts") && path.basename(name).startsWith("GraphQL")).forEach(f => {
        let name = path.basename(f);
        name = name.substr(0, name.length - 3);
        let relPath = path.relative(outPath, f).replace(/\\/g, "/");
        relPath = relPath.substr(0, relPath.length - 3);
        out += (`import ${name} from "./${relPath}";`) + "\n";
        out2 += name + ",";
    })
    fs.writeFileSync(path.join(outPath, "typeImports.ts"), out + "\nexport default " + out2.substr(0, out2.length - 1) + "];");
});