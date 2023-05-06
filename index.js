//PACKAGES
const axios = require("axios")
const _has = require("lodash.hasin")
const jsdom = require("jsdom")
const { JSDOM } = jsdom

//APP FILES & VARIABLES
const quests = require("./quest_data")
const quest_names = require("./questnames")
const episode_areas = require("./episode_areas")
const scrape_quest = require("./scrape_quest_html")
const JSON_TO_FILE = require("./JSON_to_file")
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
            if (quest_names.includes(n.textContent)) {
                let areas = ""
                //parsing out areas data is much easier here than on quest page
                if (_has(n, "parentElement.nextElementSibling.textContent")) areas = n.parentElement.nextElementSibling.textContent.replace(/(\r\n|\n|\r)/gm, "")
                if (episode_areas["areas"].includes(areas)) areas = episode_areas[areas]
                request_stack.push(get_HTML(n.href, areas))
            }
        })
    })
    .then(() => Promise.all(request_stack))
    .then(response_stack => {
        response_stack.forEach(response => {
            const { DOM, areas } = response
            scrape_quest(DOM, quests, areas)
        })
        JSON_TO_FILE(quests, () => console.log("SUCCESSFULLY WROTE LUA TABLE TO FILE"))
    })
    .catch(err => console.log(err))
}

main()