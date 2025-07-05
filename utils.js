const { BrowserWindow } = require("electron");
const path = require("node:path");

Array.prototype.randItem = function () {
    return this[Math.floor(Math.random() * this.length)];
};

function exportFuncs(module, ...funcs) {
    for (const func of funcs) {
        module.exports[func.name] = func;
    }
}

for (const dirname of [
    "css",
    "html",
    "image",
    "js",
    "preload"
]) {
    module.exports[`dir_${dirname}`] = (...paths) => path.join(__dirname, dirname, ...paths);
}

module.exports.dir_data = (...paths) => {
    return path.join("data", ...paths);
}

function windowBuilder(html, options, ...initialize) {
    return () => {
        const win = new BrowserWindow(options);
        win.loadFile(html);
        for (const func of initialize) {
            func(win);
        }
        return win;
    }
}

exportFuncs(module, exportFuncs, windowBuilder);