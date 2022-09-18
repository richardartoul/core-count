const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
var numCores = params["numCores"] ? params["numCores"] : 5000;
var numCoresPerServer = params["numCoresPerServer"] ? params["numCoresPerServer"] : 64;
var numServers = numCores / numCoresPerServer;
var numServersPerRack = 21;
numServersPerRack = params["numServersPerRack"] ? params["numServersPerRack"] : numServersPerRack;

var numRacks = numServers / numServersPerRack;
var rackWidth = 1;
var rackHeight = 5;
var rackDepth = 2;
var serverWidth = rackWidth * 0.9;
var portWidth = serverWidth / 20;
var serverHeight = (rackHeight / numServersPerRack);

var numLightsPerServer = 2;
var numPortsPerServer = 3;
if (numRacks >= 25) {
    numLightsPerServer = 0;
    numPortsPerServer = 0;
}
if (params["renderLights"] === "false") {
    numLightsPerServer = 0;
}
if (params["renderLights"] === "true") {
    numLightsPerServer = 2;
}

renderServers = true;
if (numRacks > 1000) {
    renderServers = false;
}
var lightDiameter = 0.05;
var totalRackSpace = numRacks * 4;
var minTotalRackSpace = 500;
if (minTotalRackSpace > totalRackSpace) {
    totalRackSpace = minTotalRackSpace;
}
var totalSkyboxSpace = totalRackSpace;
var minSkyboxSpace = 500;
if (minSkyboxSpace > totalSkyboxSpace) {
    totalSkyboxSpace = minSkyboxSpace;
}

var maxRacksZ = 20;

var cameraHeight = 15;
if (numRacks > 100) {
    cameraHeight = 25;
    cameraHeight += numRacks * 0.1;
} else {
    cameraHeight += numRacks;
}

maxRacksZ = 10;
if (numRacks > 100) {
    maxRacksZ = 50;
}
if (numRacks > 1000) {
    maxRacksZ = 100;
}

var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };

var createScene = function () {
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("camera1", - Math.PI, 5 * Math.PI / 12, cameraHeight, new BABYLON.Vector3(0, 0, 0), scene);

    engine.runRenderLoop(function () {
        camera.alpha += 0.006;
    });

    camera.setTarget(BABYLON.Vector3.Zero());

    BABYLON.ArcRotateCamera.prototype.spinTo = function (whichprop, targetval, speed) {
        var ease = new BABYLON.CubicEase();
        ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        BABYLON.Animation.CreateAndStartAnimation('at4', this, whichprop, speed, 120, this[whichprop], targetval, 0, ease);
    }

    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    renderScene(scene);

    scene.skipPointerMovePicking = true;
    return scene;
};

function renderScene(scene) {
    var highlight = new BABYLON.HighlightLayer("highlight", scene);
    highlight.innerGlow = false;

    var rackBuilder = BABYLON.MeshBuilder.CreateBox("rack-builder", { width: rackWidth, height: rackHeight, depth: rackDepth, segments: 32 }, scene);
    var rackMaterial = new BABYLON.StandardMaterial("rackMaterial");
    if (renderServers) {
        rackMaterial.diffuseColor = new BABYLON.Color3.Black();
    } else {
        rackMaterial.diffuseColor = new BABYLON.Color3.White();
    }
    rackMaterial.metallic = 1.0
    rackMaterial.freeze();
    rackBuilder.material = rackMaterial;
    if (!renderServers) {
        highlight.addMesh(rackBuilder, BABYLON.Color3.White(), { isStroke: true, alphaBlendingMode: 0 });
    }
    rackBuilder.edgesShareWithInstances = true;
    rackBuilder.freezeWorldMatrix();

    var serverBuilder = BABYLON.MeshBuilder.CreateBox("server-builder", { width: serverWidth, height: serverHeight, depth: rackDepth * 0.95, segments: 32 }, scene);
    serverBuilder.isVisible = false;
    const serverMaterial = new BABYLON.StandardMaterial("serverMaterial");
    serverMaterial.diffuseColor = new BABYLON.Color3(100 / 255, 144 / 255, 237 / 255);
    serverMaterial.freeze();
    serverBuilder.material = serverMaterial;
    serverBuilder.doNotSyncBoundingInfo = true;
    serverBuilder.freezeWorldMatrix()

    portBuilder = BABYLON.MeshBuilder.CreateBox("port-builder", { width: portWidth, height: serverHeight * 0.8, depth: 0.01 }, scene);
    const portMaterial = new BABYLON.StandardMaterial("portMaterial");
    portMaterial.diffuseColor = new BABYLON.Color3(51 / 255, 51 / 255, 237 / 255);
    portMaterial.freeze();
    portBuilder.material = portMaterial;
    portBuilder.doNotSyncBoundingInfo = true;
    portBuilder.freezeWorldMatrix();

    var greenLightBuilder = BABYLON.MeshBuilder.CreateSphere("green-light-builder", { diameter: lightDiameter }, scene);
    var blackLightBuilder = BABYLON.MeshBuilder.CreateSphere("black-light-builder", { diameter: lightDiameter }, scene);
    var redLightBuilder = BABYLON.MeshBuilder.CreateSphere("red-light-builder", { diameter: lightDiameter }, scene);

    const greenLightMaterial = new BABYLON.StandardMaterial("lightMaterial");
    greenLightMaterial.diffuseColor = BABYLON.Color3.Red();
    greenLightMaterial.emissiveColor = BABYLON.Color3.Green();
    greenLightMaterial.freeze();
    greenLightBuilder.material = greenLightMaterial;
    greenLightBuilder.freezeWorldMatrix();
    greenLightBuilder.doNotSyncBoundingInfo = true;

    const blackLightMaterial = new BABYLON.StandardMaterial("lightMaterial");
    blackLightMaterial.diffuseColor = BABYLON.Color3.Red();
    blackLightMaterial.emissiveColor = BABYLON.Color3.Black();
    blackLightMaterial.freeze();
    blackLightBuilder.material = blackLightMaterial;
    blackLightBuilder.freezeWorldMatrix();
    blackLightBuilder.doNotSyncBoundingInfo = true;

    const redLightMaterial = new BABYLON.StandardMaterial("lightMaterial");
    redLightMaterial.diffuseColor = BABYLON.Color3.Red();
    redLightMaterial.emissiveColor = BABYLON.Color3.Red();
    redLightMaterial.freeze();
    redLightBuilder.material = redLightMaterial;
    redLightBuilder.freezeWorldMatrix();
    redLightBuilder.doNotSyncBoundingInfo = true;

    var builders = {
        rack: rackBuilder,
        server: serverBuilder,
        port: portBuilder,
        greenLight: greenLightBuilder,
        blackLight: blackLightBuilder,
        redLight: redLightBuilder,
    };

    numRows = numRacks / maxRacksZ;
    var numServersRemaining = numServers;
    var numRacksRemaining = numRacks;
    for (var i = 0; i < numRows; i++) {
        for (var j = 0; j < maxRacksZ && numRacksRemaining > 0; j++) {
            numServersThisRack = numServersPerRack;
            if (numServersRemaining < numServersThisRack) {
                numServersThisRack = numServersRemaining;
            }

            rackX = j * rackWidth * 2;
            rackZ = i * rackDepth * 2;
            if (i % 2 == 1) {
                rackZ = -rackZ;
            }
            if (j % 2 == 1) {
                rackX = -rackX;
            }
            renderRack(scene, builders, rackX, rackZ, 0, numServersThisRack)
            numServersRemaining -= numServersThisRack;
            numRacksRemaining--;
        }
    }


    var gridMaterial = new BABYLON.GridMaterial("gridMaterial", scene);
    gridMaterial.majorUnitFrequency = 6;
    gridMaterial.minorUnitVisibility = 0.43;
    gridMaterial.gridRatio = 0.5;
    gridMaterial.mainColor = new BABYLON.Color3(0, 0.05, 0.2);
    gridMaterial.lineColor = new BABYLON.Color3(0, 1.0, 1.0);
    gridMaterial.backFaceCulling = false;

    var skySphere = BABYLON.Mesh.CreateSphere("skySphere", 30, totalSkyboxSpace, scene);
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: totalRackSpace, height: totalRackSpace }, scene);
    skySphere.material = gridMaterial;
    ground.material = gridMaterial;

}

window.initFunction = async function () {
    console.log("init", numCores);
    var asyncEngineCreation = async function () {
        try {
            return createDefaultEngine();
        } catch (e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    }

    window.engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';
    startRenderLoop(engine, canvas);
    window.scene = createScene();
};



initFunction().then(() => {
    sceneToRender = scene
});


window.addEventListener("resize", function () {
    engine.resize();
});


function renderRack(scene, builders, x, z, rotation, numServers) {
    var CoT = new BABYLON.TransformNode("root");
    CoT.freezeWorldMatrix();
    CoT.doNotSyncBoundingInfo = true;
    var rackName = "rack-" + x + "-" + z;
    var rack = builders.rack.createInstance(rackName);
    rack.parent = CoT;
    rack.position.x = x;
    rack.position.z = z;
    rack.position.y = rackHeight / 2;
    rack.freezeWorldMatrix();
    rack.doNotSyncBoundingInfo = true;

    var lights = [];

    for (var i = 0; i < numServers && renderServers; i++) {
        var serverName = rackName + "-server-" + i;
        var server = builders.server.createInstance(serverName);
        server.parent = CoT;
        server.position.x = x;
        server.position.y = serverHeight / 2 + i * serverHeight * 1.1;
        server.position.z = z - 0.1;
        server.freezeWorldMatrix();
        server.doNotSyncBoundingInfo = true;

        for (var j = 0; j < numLightsPerServer; j++) {
            var greenLight = builders.greenLight.createInstance(serverName + "-green-light-" + j);
            var blackLight = builders.blackLight.createInstance(serverName + "-black-light-" + j);
            var redLight = builders.redLight.createInstance(serverName + "-red-light-" + j);
            greenLight.position.y = server.position.y;
            blackLight.position.y = server.position.y;
            redLight.position.y = server.position.y;
            greenLight.position.z = server.position.z - 1;
            blackLight.position.z = server.position.z - 1;
            redLight.position.z = server.position.z - 1;
            greenLight.position.x = server.position.x - serverWidth / 2 + serverWidth * 0.1 + lightDiameter * (2 * j);
            blackLight.position.x = server.position.x - serverWidth / 2 + serverWidth * 0.1 + lightDiameter * (2 * j);
            redLight.position.x = server.position.x - serverWidth / 2 + serverWidth * 0.1 + lightDiameter * (2 * j);
            greenLight.parent = CoT;
            blackLight.parent = CoT;
            redLight.parent = CoT;

            greenLight.freezeWorldMatrix();
            blackLight.freezeWorldMatrix();
            redLight.freezeWorldMatrix();

            lights.push({
                green: greenLight,
                black: blackLight,
                red: redLight,
            });
        }

        for (var j = 0; j < numPortsPerServer; j++) {
            port = builders.port.createInstance(serverName + "-port-" + j, { width: portWidth, height: serverHeight * 0.8, depth: 0.01 }, scene);
            port.position.y = server.position.y;
            port.position.z = server.position.z - 1;
            port.position.x = server.position.x + serverWidth / 2 - portWidth / 2 - portWidth * 2 * j - serverWidth * 0.1;
            port.parent = CoT;
            port.freezeWorldMatrix()
        }
    }

    var renderIdx = 0;
    if (numLightsPerServer > 0) {
        scene.registerBeforeRender(function () {
            renderIdx++;
            if (renderIdx % 20 == 0) {
                lights.forEach(function (currLight) {
                    if (Math.random() > 0.25) {
                        return;
                    }

                    var rand = Math.random();
                    switch (true) {
                        case rand < 0.8:
                            currLight.green.isVisible = true;
                            currLight.black.isVisible = false;
                            currLight.red.isVisible = false;
                            break;
                        case rand < 0.98:
                            currLight.green.isVisible = false;
                            currLight.black.isVisible = true;
                            currLight.red.isVisible = false;
                            break;
                        default:
                            currLight.green.isVisible = false;
                            currLight.black.isVisible = false;
                            currLight.red.isVisible = true;
                            break;
                    }
                });

            }
        });
    }

    CoT.rotation.y = rotation;
}