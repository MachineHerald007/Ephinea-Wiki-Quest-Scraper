const _has = require("lodash.hasin")

function area_check(arr, node) {
    const str = node.textContent.replace(/(\r\n|\n|\r)/gm, "")
    let bool = false
    for (let i=0; i<arr.length; i++) {
        if
        (
            str.includes(arr[i].split(" ")[0]) &&
            _has(node, "parentElement.parentElement.nextElementSibling.children") &&
            node.parentElement.parentElement.nextElementSibling.children[0].textContent.replace(/(\r\n|\n|\r)/gm, "") == "Enemy"
        )
        {
            bool = true
        }
    }
    return bool
}

module.exports = (DOM, quests, areas, i) => {
    let episode, category, name, client, author, info, reward, boxes
    let _areas, area_links, mob_table, bosses, bosses_table
    let total_xp = {}, mobs = {}

    if 
    (
        DOM.window.document.querySelector(".mw-page-title-main") &&
        DOM.window.document.querySelector(".mw-page-title-main").textContent
    ) {
        name = DOM.window.document.querySelector(".mw-page-title-main").textContent.replace(/(\r\n|\n|\r)/gm, "")
    } else {
        name = ""
    }
    
    DOM.window.document.querySelectorAll("th").forEach(n => {
        const cleaned_text = n.textContent.replace(/(\r\n|\n|\r)/gm, "")
        if (cleaned_text == "Episode 1") episode = "EPISODE 1"
        if (cleaned_text == "Episode 2") episode = "EPISODE 2"
        if (cleaned_text == "Episode 4") episode = "EPISODE 4"
        if (cleaned_text == "Category:") category = n.nextElementSibling.textContent
        if (cleaned_text == "Client:") client = n.nextElementSibling.textContent
        if (cleaned_text == "Reward:") reward = n.nextElementSibling.textContent
        if (cleaned_text == "Info:") info = n.nextElementSibling.textContent
        if (cleaned_text == "Author:") author = n.nextElementSibling.textContent
        if (cleaned_text == "Bosses") bosses = n
    })

    //find Total XP element and create total_xp object
    DOM.window.document.querySelectorAll(".tabbertab").forEach(n => {
        //only scrape from xp table
        if (n.parentElement.id == "tabber-c6bec37eb5f1309e19ddd9d886339c70") {
            const table_rows = n.querySelectorAll("tr")
            let xp_obj, xp_rows, total = {}
            
            //loop to 2nd row containing xp values
            for (const [key, value] of Object.entries(table_rows)) {
                if (key == 1) xp_obj = value
            }
            //loop through xp rows and add to total xp object
            xp_rows = xp_obj.querySelectorAll("td")
            for (const [key, value] of Object.entries(xp_rows)) {
                if (key == 0) total["Normal"] = value.textContent || ""
                if (key == 1) total["Hard"] = value.textContent || ""
                if (key == 2) total["Very Hard"] = value.textContent || ""
                if (key == 3) total["Ultimate"] = value.textContent || ""
            }

            if (n.title == "Normal") {
                total_xp["Multi"] = total
            } else {
                total_xp["Solo"] = total
            }
        }
    })

    _areas = areas.split(",").map(area => area.trim())
    area_links = DOM.window.document.querySelectorAll("a")
    area_links.forEach(n => {
        //ensures only the area table covering enemy mobs, not enemy boxes table, is parsed
        if (area_check(_areas, n)) {
            let area_name = ""

            if (_has(mobs, n.textContent)) {
                area_name = n.textContent + " Random Spawns"
            } else {
                area_name = n.textContent
            }
            //check if table is a boss room
            if (!area_name.includes("Final")) {
                mobs[area_name] = {}
                mob_table = n.parentElement.parentElement.parentElement.querySelectorAll("tr")
                //filter out title and headers to only parse out mob data & loop through key value node pairs
                for (const [key, value] of Object.entries(mob_table)) {
                    if (key > 1) {
                        const mob_name = value.children[0].firstChild.textContent.replace(/(\r\n|\n|\r)/gm, "") || ""
                        const mob_number = value.children[1].textContent.replace(/(\r\n|\n|\r)/gm, "") || ""
                        mobs[area_name][mob_name] = mob_number
                    }
                }
            }
        }
    })

    if (bosses) {
        bosses_table = bosses.parentElement.parentElement.querySelectorAll("tr")
        mobs["Bosses"] = {}
        for (const [key, value] of Object.entries(bosses_table)) {
            if (key > 1) {
                const boss_name = value.children[0].firstChild.textContent.replace(/(\r\n|\n|\r)/gm, "") || ""
                const boss_number = value.children[1].textContent.replace(/(\r\n|\n|\r)/gm, "") || ""
                mobs["Bosses"][boss_name] = boss_number
            }
        }
    }

    quests[episode][category][i] = {
        "Name": name,
        "Category": category || "",
        "Client": client || "",
        "Reward": reward || "",
        "Info": info || "",
        "Author": author,
        "Areas": areas,
        "Mobs": mobs,
        "Total XP": total_xp
    }
}