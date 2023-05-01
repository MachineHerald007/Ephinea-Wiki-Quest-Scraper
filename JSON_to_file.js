const fs = require("fs")
module.exports = (quests, callback) => {
    fs.writeFile('quests.json', JSON.stringify(quests), 'utf8', callback)
}