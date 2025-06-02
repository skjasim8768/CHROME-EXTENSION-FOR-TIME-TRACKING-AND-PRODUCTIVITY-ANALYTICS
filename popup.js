const productiveSites =
    [
        "stackoverflow.com",
        "github.com",
        "geeksforgeeks.org",
        "leetcode.com",
        "chatgpt.com"
    ];
const unproductiveSites =
    [
        "youtube.com",
        "facebook.com",
        "instagram.com",
        "netflix.com",
        "twitter.com"
    ];

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return "0m 0s";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}m ${sec}s`;
}

function isProductive(site) {
    return productiveSites.some(p => site.includes(p));
}

function isUnproductive(site) {
    return unproductiveSites.some(u => site.includes(u));
}

document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get(null, (items) => {
        const reportDiv = document.getElementById("report");
        if (!reportDiv) return;

        let html = "<h2>Time Spent:</h2><ul>";
        let productiveTime = 0;
        let unproductiveTime = 0;

        for (const key in items) {
            if (key.startsWith("time_")) {
                const site = key.replace("time_", "");
                const time = parseInt(items[key]) || 0;

                if (isProductive(site)) {
                    productiveTime += time;
                    console.log(`[Productive] ${site}: ${time}s`);
                } else if (isUnproductive(site)) {
                    unproductiveTime += time;
                    console.log(`[Unproductive] ${site}: ${time}s`);
                } else {
                    console.log(`[Neutral] ${site}: ${time}s`);
                }

                html += `<li>${site}: ${formatTime(time)}</li>`;
            }
        }

        html += "</ul><hr>";
        html += `<p><strong> Productive:</strong> ${formatTime(productiveTime)}</p>`;
        html += `<p><strong> Unproductive:</strong> ${formatTime(unproductiveTime)}</p>`;
        reportDiv.innerHTML = html;
    });
});
