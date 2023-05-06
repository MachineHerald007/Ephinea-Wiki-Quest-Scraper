const fs = require("fs")
const { format } = require("lua-json")

function JSON_TO_LUA(quests) {
    try {
        const parsed = JSON.parse(JSON.stringify(quests))
        const options = { eol: '\n', singleQuote: false, spaces: 2 }
        const _quests = format(parsed, options)
        return _quests
    } catch(e) {
        console.log(e)
    }
}
module.exports = (quests, callback) => fs.writeFile("quests.lua", JSON_TO_LUA(quests, callback), callback)