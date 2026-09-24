/*
TO DO:
- add sprites and circle/elipse
- add the ability to hover and click objects
- add rotation of camera
*/


// basic varibles to define canvas
const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");
const skipPlayButton = true;

let rot = 0; // thing for testing

let rotpos = true; // obvious
let drawBG = true;

// sleep function
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// main frame function for every frame 
let lastTime = 0;
async function frame(currentTime) {
    // delta & fps
    const delta = currentTime - lastTime;
    lastTime = currentTime;
    const fps = Math.floor(1000/delta);
    updateFPS(fps);

    // move camera
    if (keys.has(68)) {
        camera.x += (keys.has(16)) ? 0.025*delta : 0.1*delta;
    }
    if (keys.has(65)) {
        camera.x -= (keys.has(16)) ? 0.025*delta : 0.1*delta;
    }
    if (keys.has(87)) {
        camera.y -= (keys.has(16)) ? 0.025*delta : 0.1*delta;
    }
    if (keys.has(83)) {
        camera.y += (keys.has(16)) ? 0.025*delta : 0.1*delta;
    }

    // keep the drawing coordinate system aligned with the displayed canvas
    resizeCanvas();

    if (rotpos) { rot += 0.05*delta; }

    // draw background
    if (drawBG) {
        drawObject({ rotation: rot, type: "polygon", rotation: 0, color: "#7f7f7f", x: 0, y: 0, effectedByCamera: false, polygonData: [[0, 0], [(canvas.width/sSize)*100, 0], [(canvas.width/sSize)*100, (canvas.height/sSize)*100], [0, (canvas.height/sSize)*100]], strokeColor: "transparent"});
    }
    
    drawObject({ rotation: -rot, type: "polygon", color: "white", x: `section:1/2:${(Math.cos(rot*0.1)*15)-25}`, y: "section:1/2:0", strokeColor: "black", polygonData: [[-10, -10], [10, -10], [10, 10], [-10, 10]], effectedByCamera: true });
    drawObject({ rotation: rot, type: "polygon", color: "white", x: "section:1/2:25", y: `section:1/2:${Math.sin(rot*0.1)*15}`, strokeColor: "black", polygonData: [[-10, -10], [10, -10], [10, 10], [-10, 10]], effectedByCamera: true });
    drawObject({ type: "line", strokeColor: "black", lineWidth: 1, effectedByCamera: true, x: "section:1/2:0", y: "section:1/2:0", polygonData: [[0, -20], [0, 20]] });
    drawObject({ type: "line", strokeColor: "black", lineWidth: 1, effectedByCamera: true, x: "section:1/2:0", y: "section:1/2:0", polygonData: [[-20, 0], [20, 0]] });
    drawObject({ type: "text", text: "0, 0", color: "white", strokeColor: "black", effectedByCamera: true, x: "section:1/2:0", y: "section:1/2:0", fontSize: 5, lineWidth: 0.75, fontFamily: "Varela Round", })
    
    // message
    drawObject({ strokeColor: "black", type: "text", color: "white", text: "Currently still working on the engine,", x: "section:1/2:0", y: "section:1/2:30", fontSize: 6, fontFamily: "Varela Round", effectedByCamera: true });
    drawObject({ strokeColor: "black", type: "text", color: "white", text: "so heres a quick test.", x: "section:1/2:0", y: "section:1/2:37", fontSize: 6, fontFamily: "Varela Round", effectedByCamera: true });
    drawObject({ strokeColor: "black", type: "text", color: "white", text: "Controls:", x: "section:1/2:0", y: "section:1/2:45", fontSize: 6, fontFamily: "Varela Round", effectedByCamera: true });
    drawObject({ strokeColor: "black", type: "text", color: "white", text: "WASD & Shift - move camera", x: "section:1/2:0", y: "section:1/2:52", fontSize: 6, fontFamily: "Varela Round", effectedByCamera: true });
    drawObject({ strokeColor: "black", type: "text", color: "white", text: "Scroll Wheel - zoom in n' out", x: "section:1/2:0", y: "section:1/2:59", fontSize: 6, fontFamily: "Varela Round", effectedByCamera: true });
    drawObject({ strokeColor: "black", type: "text", color: "white", text: "1 to toggle square movement & 2 to toggle background", x: "section:1/2:0", y: "section:1/2:66", fontSize: 6, fontFamily: "Varela Round", effectedByCamera: true });
    drawObject({ strokeColor: "black", type: "text", color: "white", text: "fully made with raw JS with no API's", x: "section:1/2:0", y: "section:1/2:72", fontSize: 3, lineWidth: 0.6, fontFamily: "Varela Round", effectedByCamera: true });

    // debug values, fps zoom and postion
    drawObject({ strokeColor: "black", type: "text", color: "white", text: `${fpsAve} fps`, x: "align:0:1", y: "align:0:1", fontSize: 6, fontFamily: "Varela Round", fontWeight: 400, effectedByCamera: false });
    drawObject({ strokeColor: "black", type: "text", color: "white", text: `${Math.floor(camera.zoom*10000)/10000}x zoom`, x: "align:0:1", y: "align:0:7", fontSize: 6, fontFamily: "Varela Round", fontWeight: 400, effectedByCamera: false });
    drawObject({ strokeColor: "black", type: "text", color: "white", text: `x: ${Math.floor(camera.x*10)/10} y: ${Math.floor(camera.y*10)/10}`, x: "align:0:1", y: "align:0:14", fontSize: 6, fontFamily: "Varela Round", fontWeight: 400, effectedByCamera: false });
    drawObject({ rotation: rot, type: "line", strokeColor: "#0000007f", lineWidth: 0.75, effectedByCamera: false, polygonData: [[0, 5], [0, -5]], x: "section:1/2:0", y: "section:1/2:0" });
    drawObject({ rotation: rot, type: "line", strokeColor: "#0000007f", lineWidth: 0.75, effectedByCamera: false, polygonData: [[-5, 0], [5, 0]], x: "section:1/2:0", y: "section:1/2:0" });
    
    // restart loop
    requestAnimationFrame(frame);
}

// update fps to be smooth
let fpsList = [];
let fpsAve = 0;
const fpsAveDec = 0;
const fpsAvLength = 30;

function updateFPS(fps) {
    fpsList.unshift(fps);
    if (fpsList.length > fpsAvLength) {
        fpsList.pop(0);
    }
    fpsAve = Math.floor(((fpsList.reduce((accumulator, current) => accumulator + current, 0))/fpsList.length)*10)/10;
}

// camera
let camera = {
    x: 0,
    y: 25,
    zoom: 1,
    rotation: 0
}

// object drawing function
function drawObject(objInfo) {
    // set variables with defaults if not provided
    const effectedByCamera = objInfo.effectedByCamera;
    const text = objInfo.text || "null";
    const color = objInfo.color || "white";
    const strokeColor = objInfo.strokeColor || "black";
    const fontSize = (effectedByCamera) ? cqmin(objInfo.fontSize)*camera.zoom || cqmin(16)*camera.zoom : cqmin(objInfo.fontSize) || cqmin(16);
    const fontFamily = objInfo.fontFamily || "Arial";
    const fontWeight = objInfo.fontWeight || 400;
    const rotation = objInfo.rotation || 0;
    const width = cqmin(objInfo.width) || 0;
    const height = cqmin(objInfo.height) || 0;
    const lineWidth = (effectedByCamera) ? cqmin(objInfo.lineWidth)*camera.zoom || cqmin(1)*camera.zoom : cqmin(objInfo.lineWidth) || cqmin(1);
    const polygonData = objInfo.polygonData || [[0, 0]];

    // done before so that alignment in xymove works
    ctx.fillStyle = color;
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

    // function for section position shit
    function xymove(variable, xy) {
        if (variable === undefined || variable === null || variable === "") { // if not provided, return 0
            return 0;
        }

        // section math
        if (String(variable).includes("section:")) {
            // ex is "section:1/2:30" as is section 1/2 with 30 cqmin offset

            const pieces = variable.split(":"); // seperates section, fraction, offset
            const num = parseFloat(pieces[1].split("/")[0]); // gets numerator
            const den = parseFloat(pieces[1].split("/")[1]); // gets denominator
            const fraction = num/den; // gets the fraction of it
            const pos = (xy === 0) ? canvas.width : canvas.height; // determins wether it is aligned on the x or y
            const split = pos * fraction; // gets postion of section

            const offset = cqmin(parseFloat(pieces[2])); // calculates offset

            if (effectedByCamera) {
                const viewportCenter = pos / 2;
                const cameraPosition = cqmin(Object.values(camera)[xy]);
                return viewportCenter + (split + offset - cameraPosition - viewportCenter) * camera.zoom;
            } else {
                return split + offset;
            }

        }
        // alignment math
        else if (String(variable).includes("align:")) {
            // ex is "align:left:30" as is aligning to left side with 30 cqmin offset

            const pieces = variable.split(":"); // seperates align, position, offset
            const align = Number(pieces[1]); // gets alignment
            const offset = cqmin(parseFloat(pieces[2]));

            if (align === 0) { // alignment can be 0 or 1, left or right, top or bottom. this is to make things simpler and have less code
                // because it can be text, lines, or other shapes there are special cases for alignment.
                if (objInfo.type === "text") {
                    const measurer = ctx.measureText(text);
                    return (xy === 0) ? offset + measurer.width/2 : offset + fontSize/2;
                }
                // add other objects here if needed
            } else {
                if (objInfo.type === "text") {
                    const measurer = ctx.measureText(text);
                    return (xy === 0) ? canvas.width + offset - measurer.width/2 : canvas.height + offset - fontSize/2;
                }
                // add other objects here if needed
            }
        }
        // if just given a position
        else {
            const position = cqmin(parseFloat(variable));

            if (effectedByCamera) {
                const pos = (xy === 0) ? canvas.width : canvas.height; // check wetehr on x or y
                const viewportCenter = pos / 2;
                const cameraPosition = cqmin(Object.values(camera)[xy]);
                return viewportCenter + (position - cameraPosition - viewportCenter) * camera.zoom;
            } else {
                return position;
            }
        }

    }

    // return if not an object
    if (!objInfo.type) {
        console.error("No type specified for object");
        return;
    }

    // positions
    const x = xymove(objInfo.x, 0);
    const y = xymove(objInfo.y, 1);
    const shapeScale = effectedByCamera ? camera.zoom : 1;
    const scaledPolygon = polygonData.map((position) => [
        cqmin(parseFloat(position[0])) * shapeScale,
        cqmin(parseFloat(position[1])) * shapeScale
    ]);

    const bounds = scaledPolygon.reduce((currentBounds, position) => ({
        minX: Math.min(currentBounds.minX, position[0]),
        maxX: Math.max(currentBounds.maxX, position[0]),
        minY: Math.min(currentBounds.minY, position[1]),
        maxY: Math.max(currentBounds.maxY, position[1])
    }), {
        minX: Infinity,
        maxX: -Infinity,
        minY: Infinity,
        maxY: -Infinity
    });
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;

    // if each type of object

    // text
    if (objInfo.type === "text") {
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = color;
        ctx.lineWidth = lineWidth;

        const textMetrics = ctx.measureText(text);
        const textCenterY = (textMetrics.actualBoundingBoxAscent - textMetrics.actualBoundingBoxDescent) / 2;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.strokeText(text, -textMetrics.width / 2, textCenterY);
        ctx.fillText(text, -textMetrics.width / 2, textCenterY);
        ctx.restore();
    }
    // line
    else if (objInfo.type === "line") { // lines
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = color;
        ctx.lineWidth = lineWidth;

        ctx.save();
        ctx.translate(x + centerX, y + centerY);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(scaledPolygon[0][0] - centerX, scaledPolygon[0][1] - centerY);
        for (const position of scaledPolygon.slice(1)) {
            ctx.lineTo(position[0] - centerX, position[1] - centerY);
        }
        ctx.stroke();
        ctx.restore();
    }
    // polygon
    else if (objInfo.type === "polygon") {
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = color;
        ctx.lineWidth = lineWidth;

        ctx.save();
        ctx.translate(x + centerX, y + centerY);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(scaledPolygon[0][0] - centerX, scaledPolygon[0][1] - centerY);
        for (const position of scaledPolygon.slice(1)) {
            ctx.lineTo(position[0] - centerX, position[1] - centerY);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}

let mouse = {
    x: 0,
    y: 0
}

document.addEventListener("pointermove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// cqmin calc
let sSize;
function calculateCqmin() {
    sSize = Math.min(canvas.width, canvas.height);
}

// scale object to use cqmin
function cqmin(number) { 
    return (number === 0) ? 0 : (number/100)*sSize;
}

function resizeCanvas() {
    const bounds = canvas.getBoundingClientRect();
    const width = Math.floor(bounds.width);
    const height = Math.floor(bounds.height);

    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        calculateCqmin();
    }
}

window.addEventListener('resize', resizeCanvas);

// camera movement
let keys = new Set();

document.addEventListener("keydown", (e) => {
    if (e.keyCode === 'Meta') {
        heldKeys.clear();
        return;
    }
    if (!keys.has(e.keyCode)) {
        keys.add(e.keyCode);
        console.log(e.keyCode);
    }
    if (e.keyCode === 49) {
        rotpos = !rotpos;
    }
    if (e.keyCode === 50) {
        drawBG = !drawBG;
    }
});

document.addEventListener("keyup", (e) => {
    if (keys.has(e.keyCode)) {
        keys.delete(e.keyCode);
    }
});

window.addEventListener("blur", () => {
    keys.clear();
});

// scroll wheel
window.addEventListener('wheel', (event) => {
    if (event.ctrlKey) {
        return;
    }

    if (event.deltaY > 0) {
        camera.zoom *= 0.8;
    } else if (event.deltaY < 0) {
        camera.zoom *= 1.25;
    }
});

resizeCanvas();

// disable right click
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.getElementById("playButton").addEventListener("click", (e) => {
    document.getElementById("playButton").classList.remove("enabled");
    document.getElementById("playButton").classList.add("starting");
    setTimeout(() => {
        requestAnimationFrame(frame);
    }, 1000);
});

if (skipPlayButton) {
    document.getElementById("playButton").remove();
    requestAnimationFrame(frame);
}
