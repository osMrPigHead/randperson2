const fs = require("fs");
const { dir_data, exportFuncs } = require("./utils");

const PATH_CONFIG = dir_data("config.json");
const PATH_EXCLUDED = dir_data("excluded.json");

function ssrProbability(config) {
    if (config.ssr.count < config.ssr.lift) return config.ssr.probability;
    return config.ssr.probability + (config.ssr.count - config.ssr.lift + 1) *
        (1 - config.ssr.probability) / (config.ssr.max - config.ssr.lift + 1);
}

function getConfig() {
    return JSON.parse(fs.readFileSync(PATH_CONFIG).toString());
}
function setConfig(config) {
    fs.writeFileSync(PATH_CONFIG, JSON.stringify(config));
}

let excluded = [];
let local_excluded = [];
function getExcluded() {
    return JSON.parse(fs.readFileSync(PATH_EXCLUDED).toString());
}
function addExcluded(config, choice) {
    excluded.push(choice);
    local_excluded.push(choice);
    if (excluded.length === config.list.length) excluded = [];
    if (config.saveExcluded)
        fs.writeFileSync(PATH_EXCLUDED, JSON.stringify(excluded));
    return config.list[choice];
}
function clearExcluded() {
    excluded = [];
    fs.writeFileSync(PATH_EXCLUDED, "[]");
}

function randperson_old(number) {
    let config = getConfig();
    if (config.saveExcluded) excluded = getExcluded();
    if (Math.random() < ssrProbability(config)) {
        config.ssr.count = 0;
        setConfig(config);
        return {
            name: config.ssr.list.randItem(),
            ssr: true,
            ssrCount: config.ssr.max
        };
    }
    config.ssr.count += number;
    setConfig(config);
    let choices = [];
    for (let i = 0; i < number; i++) {
        choices.push(addExcluded(config, [...function *() {
            for (let i = 0; i < config.list.length; i++)
                if (!excluded.includes(i) || !local_excluded.includes(i)) yield i;
        }()].randItem()));
    }
    return [...function *() {
        for (const choice of choices) yield {
            name: choice[1],
            ssr: false,
            id: choice[0],
            ssrCount: config.ssr.max - config.ssr.count
        };
    }()];
}

function randperson(number) {
    let config = getConfig();
    if (config.list.length < number) return "err";
    if (config.saveExcluded) excluded = getExcluded();
    local_excluded = [];
    return {
        list: [...function* () {
            for (let i = 0; i < number; i++) {
                if (Math.random() < ssrProbability(config)) {
                    config.ssr.count = 0;
                    yield {
                        name: config.ssr.list.randItem(),
                        ssr: true
                    };
                    continue;
                }
                config.ssr.count++;
                let choice = addExcluded(config, [...function* () {
                    for (let i = 0; i < config.list.length; i++)
                        if (!excluded.includes(i) && !local_excluded.includes(i)) yield i;
                }()].randItem());
                yield {
                    name: choice[1],
                    id: choice[0],
                    ssr: false
                };
            }
            setConfig(config);
        }()],
        ssrCount: config.ssr.max - config.ssr.count
    };
}

exportFuncs(module, getConfig, setConfig, clearExcluded, randperson);