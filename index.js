const axios = require("axios")
const jsdom = require("jsdom")
const { JSDOM } = jsdom

const URL = "https://wiki.pioneer2.net"
const quest_names = require("./questnames")
const quests = require("./quest_data")
const parse_quest = require("./parse_quest_html")

axios
    .get(`${URL}/w/Quests`)
    .then(response => {
        const DOM = new JSDOM(response.data)
        DOM.window.document.querySelectorAll("a").forEach(n => {
            if (quest_names.includes(n.textContent)) {
                //parsing out areas data is much easier here than on quest page
                const areas = n.parentElement.nextElementSibling.textContent.replace(/(\r\n|\n|\r)/gm, "") || ''
                
                if (n.href.includes("redlink=1") ) {
                    console.log("LINK IS BROKEN")
                    return
                } 

                axios
                    .get(`${URL}${n.href}`)
                    .then(response => {
                        const DOM = new JSDOM(response.data)
                        parse_quest(DOM, quests, areas)
                    })

            }
        })
    })
  .catch(err => console.log(err))