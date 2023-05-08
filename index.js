//PACKAGES
const axios = require("axios")
const _has = require("lodash.hasin")
const jsdom = require("jsdom")
const { JSDOM } = jsdom

//APP FILES & VARIABLES
const quests = require("./src/data/quest_data")
const quest_names = require("./src/data/questnames")
const episode_areas = require("./src/data/episode_areas")
const scrape_quest = require("./src/scrape_quest_html")
const JSON_TO_FILE = require("./src/util/JSON_to_file")
const questnames = require("./src/data/questnames")
const URL = "https://wiki.pioneer2.net"

function get_HTML(link, areas) {
    return new Promise((resolve, reject) => {
        axios
        .get(`${URL}${link}`)
        .then(response => {
            const DOM = new JSDOM(response.data)
            resolve({
                DOM: DOM,
                areas: areas
            })
        })
        .catch(err => reject(err))
    })
}

function main() {
    const request_stack = []
    axios
    .get(`${URL}/w/Quests`)
    .then(response => {
        const DOM = new JSDOM(response.data)
        DOM.window.document.querySelectorAll("a").forEach(n => {
            const quest_name = n.textContent.replace(/(\r\n|\n|\r)/gm, "")
            if (quest_names.includes(quest_name)) {
                let areas = ""
                //parsing out areas data is much easier here than on quest page
                if (_has(n, "parentElement.nextElementSibling.textContent"))
                    areas = n.parentElement.nextElementSibling.textContent.replace(/(\r\n|\n|\r)/gm, "")
                if (episode_areas["areas"].includes(areas))
                    areas = episode_areas[areas]
                request_stack.push(get_HTML(n.href, areas))
            }
        })
    })
    .then(() => Promise.all(request_stack))
    .then(response_stack => {
        for (let i=0; i<response_stack.length; i++) {
            const { DOM, areas } = response_stack[i]
            scrape_quest(DOM, quests, areas, i)
        }
        JSON_TO_FILE(quests, () => console.log("SUCCESSFULLY WROTE LUA TABLE TO FILE"))
    })
    .catch(err => console.log(err))
}

main()