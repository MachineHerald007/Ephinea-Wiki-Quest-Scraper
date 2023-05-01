module.exports = (DOM, quests, areas) => {
    let episode, category, name, client, author, info, reward, boxes
    let _areas, area_links, mob_table
    let total_xp = {}, mobs = {}

    if 
    (
        DOM.window.document.querySelector(".mw-page-title-main") &&
        DOM.window.document.querySelector(".mw-page-title-main").textContent
    ) {
        name = DOM.window.document.querySelector(".mw-page-title-main").textContent
    } else {
        name = ""
    }
    
    DOM.window.document.querySelectorAll("th").forEach(n => {
        if (n.textContent == "Episode 1") episode = "Episode 1"
        if (n.textContent == "Episode 2") episode = "Episode 2"
        if (n.textContent == "Episode 4") episode = "Episode 4"
        if (n.textContent == "Category:") category = n.nextElementSibling.textContent
        if (n.textContent == "Client:") client = n.nextElementSibling.textContent
        if (n.textContent == "Reward:") reward = n.nextElementSibling.textContent
        if (n.textContent == "Info:") info = n.nextElementSibling.textContent
        if (n.textContent == "Author:") author = n.nextElementSibling.textContent
    })

    //find Total XP element and create total_xp object
    DOM.window.document.querySelectorAll(".tabbertab").forEach(n => {
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
    })

    _areas = areas.split(",").map(area => area.trim())
    area_links = DOM.window.document.querySelectorAll("a")
    area_links.forEach(n => {
        //ensures only the area table covering enemy mobs, not enemy boxes table, is parsed
        if
        (
            _areas.includes(n.textContent) &&
            n.parentElement.parentElement.nextElementSibling.children[0].textContent.replace(/(\r\n|\n|\r)/gm, "") == "Enemy"
        ) {
            mobs[n.textContent] = {}
            mob_table = n.parentElement.parentElement.parentElement.querySelectorAll("tr")

            //filter out title and headers to only parse out mob data & loop through key value node pairs
            for (const [key, value] of Object.entries(mob_table)) {
                if (key > 1) {
                    const mob_name = value.children[0].firstChild.textContent.replace(/(\r\n|\n|\r)/gm, "") || ""
                    const mob_number = value.children[1].textContent.replace(/(\r\n|\n|\r)/gm, "") || ""

                    mobs[n.textContent][mob_name] = mob_number
                }
            }

        }
    })

    quests[episode][category][name] = {
        "Name": name,
        "Category": category || "",
        "Client": client || "",
        "Reward": reward || "",
        "info": info || "",
        "Author": author,
        "Areas": areas,
        "Mobs": mobs,
        "Total XP": total_xp
    }
}