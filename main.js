function onChange() {
    var urlData = {
        "numCores": document.getElementById("numCores").value,
        "numCoresPerServer": document.getElementById("numCoresPerServer").value,
        "numServersPerRack": document.getElementById("numServersPerRack").value,
    };
    if (document.getElementById("renderLights").value != "default") {
        urlData["renderLights"] = document.getElementById("renderLights").value === "enabled" ? true : false;
    }

    const newURL = generateRacksURL(urlData)
    document.getElementById("visualization").src = newURL;

    const shareURL = "https://richardartoul.github.io/core-count/" + newURL;;
    document.getElementById("shareURL").href = shareURL;
    document.getElementById("shareURL").textContent = shareURL;
}

document.getElementById("numCores").addEventListener("change", function() {
    onChange();
});
document.getElementById("numCoresPerServer").addEventListener("change", function() {
    onChange();
});
document.getElementById("numServersPerRack").addEventListener("change", function() {
    onChange();
});
document.getElementById("renderLights").addEventListener("change", function() {
    onChange();
});

onChange();

function generateRacksURL(data) {
    const searchParams = new URLSearchParams(data);
    return "racks.html?" + searchParams.toString();
}