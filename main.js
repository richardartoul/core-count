function onChange() {
    const newURL = generateRacksURL({
        "numCores": document.getElementById("numCores").value,
        "numCoresPerServer": document.getElementById("numCoresPerServer").value,
        "numServersPerRack": document.getElementById("numServersPerRack").value,
        "renderLights": document.getElementById("renderLights").value === "on" ? true : false,
        "renderServers": document.getElementById("renderServers").value === "on" ? true : false,
    })
    console.log("newURL", newURL);
    console.log(document.getElementById("renderServers").value);
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

onChange();

function generateRacksURL(data) {
    const searchParams = new URLSearchParams(data);
    return "racks.html?" + searchParams.toString();
}