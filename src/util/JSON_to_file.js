const fs = require("fs")
const path = require('node:path')
const output_dir = path.join(__dirname, "..", "..", "output", "quests.lua")
const { format } = require("./lua_json")

function JSON_TO_LUA(quests) {
    console.log(output_dir)
    try {
        const parsed = JSON.parse(JSON.stringify(quests))
        const options = { eol: '\n', singleQuote: false, spaces: 2 }
        const _quests = format(parsed, options)
        return _quests
    } catch(e) {
        console.log(e)
    }
}

module.exports = (quests, callback) => fs.writeFile(output_dir, JSON_TO_LUA(quests), callback)