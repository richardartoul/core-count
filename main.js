var numVCPUs = 150000
var numVCPUsPerServer = 96
var numServers = numVCPUs/numVCPUsPerServer;
var numServersPerRack = 42;
if (numServers < 500) {
    numServersPerRack = 14;
}
var numRacks = numServers/numServersPerRack;
var rackWidth = 1;
var rackHeight = 5;
var rackDepth = 2;
var serverWidth = rackWidth * 0.9;
var portWidth = serverWidth / 20;
// var numServersPerRack = rackHeight / serverHeight;
var serverHeight = (rackHeight/numServersPerRack);
var numLightsPerServer = 2;
var numPortsPerServer = 3;
var lightDiameter = 0.05;
var totalRackSpace = numRacks * rackDepth*rackWidth*10;
var minTotalRackSpace = 10;
if (minTotalRackSpace > totalRackSpace) {
    totalRackSpace = minTotalRackSpace;
}

var maxRacksZ = 20;
// var maxRacksX = 1;

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

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(20, 10, -10), scene);
    // var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.75, 20, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());


    BABYLON.ArcRotateCamera.prototype.spinTo = function (whichprop, targetval, speed) {
        var ease = new BABYLON.CubicEase();
        ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        BABYLON.Animation.CreateAndStartAnimation('at4', this, whichprop, speed, 120, this[whichprop], targetval, 0, ease);
    }
    // This targets the camera to scene origin

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // camera.position.y = 10;
    scene.registerBeforeRender(function () {
    //     camera.spinTo("radius", 250, 50);
    //    camera.spinTo("alpha", Math.PI/2, 50);
    //    camera.spinTo("beta", 1.05, 50);
        // if (camera.position.x >= 0) {
        //     camera.position.x -= 0.1
        // } else {
        //     camera.position.x += 0.1
        // }
        // if (camera.position.z >= 10) {
        //     camera.position.z -= 0.1
        // } else {
        //     camera.position.z += 0.1
        // }
        // // camera.position.z += 0.1
        // camera.position.y += 0.1
        // camera.setTarget(BABYLON.Vector3.Zero());
    })

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    // light.diffuse = new BABYLON.Color3(0, 0, 0);
    // light.specular = new BABYLON.Color3(255, 255, 255);
    // light.groundColor = new BABYLON.Color3(0, 0, 0);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // racks = new Array(maxRacksZ).map(function(x) {
    //     return new Array(maxRacksX);
    // });
    // racks = [];
    // for (var i = 0; i < maxRacksZ; i++) {
    //     col = [];
    //     for (j = 0; j < maxRacksX; j++) {
    //         col.push()
    //     }
    // }
    // console.log(racks)

    console.log(numRacks, numServers);
    

    var rackBuilder = BABYLON.MeshBuilder.CreateBox("rack-builder", { width: rackWidth, height: rackHeight, depth: rackDepth, segments: 32 }, scene);
    var rackMaterial = new BABYLON.StandardMaterial("rackMaterial");
    rackMaterial.diffuseColor = new BABYLON.Color3.Black();
    rackMaterial.metallic = 1.0
    rackMaterial.freeze();
    rackBuilder.material = rackMaterial;
    rackBuilder.doNotSyncBoundingInfo = true;
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

    numRows = numRacks/maxRacksZ;
    var numServersRemaining = numServers;
    var numRacksRemaining = numRacks;
    for (var i = 0; i < numRows; i++) {
        for (var j = 0; j < maxRacksZ && numRacksRemaining > 0; j++) {
            numServersThisRack = numServersPerRack;
            if (numServersRemaining < numServersThisRack) {
                numServersThisRack = numServersRemaining;
            }
            renderRack(scene, builders, j*rackWidth*2, i*rackDepth*2, 0, numServersThisRack)
            numServersRemaining-=numServersThisRack;
            numRacksRemaining--;
        }
    }

    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: totalRackSpace, height: totalRackSpace }, scene);
    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.diffuseColor = BABYLON.Color3.White();
    // groundMaterial.emissiveColor = BABYLON.Color3.White();
    ground.material=groundMaterial;
    groundMaterial.freeze();

    // scene.freezeActiveMeshes();
    scene.skipPointerMovePicking = true;
    // scene.freezeActiveMeshes();
    return scene;
};

window.initFunction = async function () {
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

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});


function renderRack(scene, builders, x, z, rotation, numServers) {
    var CoT = new BABYLON.TransformNode("root");
    CoT.freezeWorldMatrix();
    CoT.doNotSyncBoundingInfo = true;
    // CoT.position.x = x/2;
    // CoT.position.z = z/2;
    // var rackHeight = numServers*serverHeight*1.08 + 0.2;
    var rackName = "rack-" + x + "-" + z;
    var rack = builders.rack.createInstance(rackName);
    rack.parent = CoT;
    rack.position.x = x;
    rack.position.z = z;
    rack.position.y = rackHeight / 2;
    rack.freezeWorldMatrix();
    rack.doNotSyncBoundingInfo = true;

    var lights = [];

    for (var i = 0; i < numServers; i++) {
        var serverName = rackName + "-server-"+i;
        var server = builders.server.createInstance(serverName);
        server.parent = CoT;
        server.position.x = x;
        server.position.y = serverHeight / 2 + i * serverHeight * 1.1;
        server.position.z = z - 0.1;
        // server.rotation.y = rotation;
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
            port = builders.port.createInstance(serverName+ "-port-" + j, { width: portWidth, height: serverHeight * 0.8, depth: 0.01 }, scene);
            port.position.y = server.position.y;
            port.position.z = server.position.z - 1;
            port.position.x = server.position.x + serverWidth / 2 -portWidth/2 - portWidth*2*j - serverWidth * 0.1;
            port.parent = CoT;
            // port.doNotSyncBoundingInfo = true;
            port.freezeWorldMatrix()
        }
    }

    var renderIdx = 0;
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
    })

    CoT.rotation.y = rotation;
}