///////////////////////////////////////////////////////
//VARIABLES
let FILTER_DEFAULT_FREQUENCY_VALUE = {
    "lowpass": 500,
    "highpass": 1000,
    "notch": 500,
    "bandpass": 500
};
/////////////////////////////////////////////////////
//MODULES
function roundTitleDiv(module) {
    let div = module.modulePanel.addNewDiv("div_title");
    div.className = "divTitle";
    div.textContent = module.name;
    return div;
}

function testComp() {
    let inTest = createInput("number", "compTest");
    inTest.designation = "inTest";
    inTest.label = "label";

    return inTest;
}
/////////////////////////////////////////////////////
//OSC
function newToggle4Waves(module, osc) {
    let toggleWaveValues = [
        {value: "sine", text: "sine"},
        {value: "square", text: "sqr"},
        {value: "sawtooth", text: "saw"},
        {value: "triangle", text:"tri"}
    ];
    let togglesWave = createToggleButton("oscToggleWave", module.name, osc, "type", toggleWaveValues);
    togglesWave.designation = "toggleWave";
    return togglesWave;
} 
function newInFreq(module, osc) {
    let inFreq = createNumericController(module, "freq", osc.frequency, "value", 60, 2000);
    inFreq.label = "FREQ ";
    return inFreq;
} 
function newRFreq(module, osc) {
    let rFreq = createControlRange(module, "rangeFreq", osc.frequency, "value", 20, 2000, 10);
    rFreq.value = osc.frequency.value;
    return rFreq;
}
/////////////////////////////////////////////////////
//Filter
function newFilterBtnBypass(module, index) {
    let btnOn = createCommutator("btnOn2", index);
    btnOn.addEventListener("click", (event) => {
        let btn = event.target;
        btn.commutate();
        let index = parseInt(btn.id.split("_")[1]);

        if(btn.value === "1") {
            console.log(module, index);
            module.plug(index);
        }
        else if(btn.value === "0") {
            module.unplug(index);
        }
    })
    return btnOn;
}
function newFilterSelectType(module, filter) {
    let tabOptions =[
        {value: "lowpass", text: "LP"},
        {value: "highpass", text: "HP"},
        {value: "notch", text: "NOTCH"},
        {value: "bandpass", text: "BP"}
    ];

    let selectType = createControlSelect("selectType", "filterSelectType", filter, "type", tabOptions);
    selectType.value = filter.type;
    selectType.label = "TYPE ";
    return selectType;
}
function newFilterInCutoff(module, filter) {
    let inNbrCutoff = createNumericController(module, "cutoff", filter.frequency, "value", 0, 5000);
    inNbrCutoff.label = "FREQ ";

    return inNbrCutoff;
}
function newFilterRCutoff(module, filter) {
    let rFreq = createControlRange(module, "rangeCutoff", filter.frequency, "value", 0, 5000, 10);
    rFreq.value = filter.frequency.value;
    return rFreq;
}
function newFilterInQ(module, filter) {
    let inNbrQ = createNumericController(module, "Q", filter.Q, "value", 0, 1000, 1);
    inNbrQ.label = "Q ";
    return inNbrQ;
}
function newFilterRQ(module, filter) {
    let rQ = createControlRange(module, "rangeQ", filter.Q, "value", 0, 1000, 1);
    rQ.value = filter.Q.value;
    return rQ;
}
/////////////////////////////////////////////////////
//LFO
function lfoNewInDepth(module) {
    let inDepth = createNumericController(module, "depth", module, "depth", 0, 2000);
    inDepth.label = "DEPTH ";

    return inDepth;
}
function lfoNewRDepth(module) {
    let rDepth = createControlRange(module, "rangeDepth", module, "depth", 0, 1000, 1);
    rDepth.value = module.depth;

    return rDepth;
}
function lfoNewInDuration(module) {
    let inDuration = createNumericController(module, "duration", module, "duration", 0, 2000);
    inDuration.label = "DURATION ";

    return inDuration;
}
function lfoNewRDuration(module) {
    let rDuration = createControlRange(module, "rangeDuration", module, "duration", 0, 1000, 1);
    rDuration.value = module.duration;

    return rDuration;
}
function lfoNewBtnPlay(module) {
    let btnOn = createCommutator("btnOn2", module);
    btnOn.addEventListener("click", (event) => {
        let btn = event.target;
        btn.commutate();
        // let index = parseInt(btn.id.split("_")[1]);
        if(btn.value === "1") {
            module.anim.play();
        }
        else if(btn.value === "0") {
            module.anim.pause();
        }
    })
    return btnOn;
}
function lfoNewSelectEasing(module) {
    let tabOptions = [];
    module.easings.forEach(e => {
        tabOptions.push({value: module.easings.indexOf(e), text: e});
    })
    // tabOptions = [
    //     {value: "linear", text:"linear"},
    //     {value: "easeInOutCirc", text:"easeInOutCirc"},
    //     {value: "easeInOutSine", text:"easeInOutSine"},
    //     {value: "easeInQuad", text:"easeInQuad"},
    //     {value: "easeInBack", text:"easeInBack"},
    //     {value: "easeInCirc", text:"easeInCirc"},
    //     {value: "easeInBounce", text:"easeInBounce"},
    //     {value: "easeOutQuart", text:"easeOutQuart"},
    // ];

    let selectType = createControlSelect("selectType", "lfoSelectType", module, "eIndex", tabOptions);
    selectType.value = module["eIndex"];

    selectType.addEventListener("input", e=> {
        console.log("SELECT EASING, try", module.anim.easing, "to", module.easings[e.target.value], "but i don't find access to easing :(");
        module.eIndex = e.target.value;
        
        // module.testUpdateAnim();
    })

    // console.log(module["eIndex"]);
    return selectType;
}
function lfoNewBtnReverseDirection(module) {
    let btnReverse = createButton("btnReverse", module.name, "reverse", "REVERSE");
    btnReverse.addEventListener("click", e => {
        let btn = e.target;
        module.anim.reverse();
    })

    return btnReverse;   
}
function lfoNewBtnAlternateDirection(module) {
    let btnReverse = createButton("btnAlternate", module.name, "alternate", "ALTERNATE");
    btnReverse.addEventListener("click", e => {
        let btn = e.target;
        if(btn.value === "alternate") {
            btn.value = "normal";
        }
        else {
            btn.value = "alternate";
        }
        module.anim.direction = btn.value;
    })

    return btnReverse;   
}
/////////////////////////////////////////////////////
//VISUALISER
function createScreen(panel, w, h) {
    let name2 = panel != undefined ? panel.name : name2;
let screen = createCanvas("screen", panel.name, w, h);
    screen.defaultBgColor = '#131010';
    screen.style.backgroungColor = screen.defaultBgColor;
    screen.ctx = screen.getContext("2d");
    screen.timeCount = 0;

    screen.drawScreen = function() {
        let ctx = screen.ctx;
        ctx.fillStyle = '#131010';
        ctx.fillRect(0, 0, screen.width, screen.height);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#afa735";
        ctx.strokeRect(0, 0, screen.width, screen.height);
    }
    return screen;
}
function moduleNewScreen(module) {
    let screen = createScreen(module.modulePanel, 200, 100);
    module.modulePanel.screen = screen;
    module.screen = screen;
    // screen.dataEnteringX = module.dataOutX;
    // screen.dataEnteringY = module.dataOutY;
    return screen;
}
function visualiserNewToggleMode(module) {
    let toggleValues =  [
        {value: "oscilloscope", text: "oscilloscope"},
        {value: "autre", text: "autre"}
    ];
        let togglesMode = createToggleButton("visuToggleMode", module.name, module.screen, "mode", toggleValues);
    togglesMode.designation = "toggleWave";
    togglesMode.forEach(btn => {
        btn.personalFunction = function() {
            if(btn.value === "oscilloscope") {
                module.screen.drawData = () => drawOscilloscope(module.screen, analyser);
            }
            module.screen.drawData();
        }
    })

    return togglesMode;
}
function visualiserNewBtnPlay(module) {
    let btnOn = createButton("btnPlay", module.name, "play", "play");
    btnOn.addEventListener("click", (event) => {
        let btn = event.target;
        if(this.textContent === "play") {
            this.textContent = "stop";
            module.screen.drawData();
        } 
        else {
            this.textContent = "play";
            // analyser.stop();
            clearInterval(this.intervalId);
            analyser.intervalId = undefined;
        }
    })
    return btnOn;
}
function monitorNewScreen(module) {
    let screen = createScreen(module.modulePanel, 200, 100);

    screen.drawData = () => drawTimeAndY(screen, v);
    module.modulePanel.screen = screen;
    module.screen = screen;
    // screen.dataEnteringX = module.dataOutX;
    // screen.dataEnteringY = module.dataOutY;
    return screen;
}

function spectrumScreenSubDiv(module) {
    let subDiv = module.modulePanel.addNewSubDiv("subDiv_screen");
    
    let screen = createScreen(module.modulePanel, 200, 100);
    screen.drawData = () => drawData(screen, module);
    module.modulePanel.screen = screen;
    module.screen = screen;
    screen.dataEnteringX = module.dataOutX;
    screen.dataEnteringY = module.dataOutY;

    subDiv.appendChild(screen);
    return subDiv;
}
//?
function drawData(screen, node) {
    let analyser = node.core[0];
    let ctx = screen.ctx;
    // console.log(screen, node);
    let r, g, b;

    let unityH = screen.height / screen.dataEnteringX;
    let barH;
    let barW = screen.width / screen.dataEnteringY;
    screen.drawScreen();

    let x = 0;
    for(let i = 0; i < analyser.buffer; i++) {
        barH = (analyser.tabData[i] * unityH) - 5;
        r = (barH + 100),
        g = (x + i -100) + (barH),
        b = barW - i;

        ctx.fillStyle = 'rgb(' + r + ", " + g+ ", " + b + ")";            

        ctx.fillRect(x, screen.height - barH, barW, barH);

        x += barW + 1;
    }
}
function drawXY(screen, t, v) {
    // console.log(screen.enteringX.max, screen.enteringY.max)
    console.log(t, v);
                    // module.monitor.drawScreen();


    let ctx = screen.ctx;

    ctx.fill();
    let bW = screen.width / screen.enteringX.max;
    let bH =  (screen.height / screen.enteringY.max);
    // console.log(bW*t, bH*v);

    ctx.beginPath();
    ctx.arc(bW * t, screen.height -(bH * v), 5, 0, 2*Math.PI);
    ctx.stroke();
}
function drawTimeAndY2BASE(screen, v) {
    // console.log(screen.timeCount, v);
    let ctx = screen.ctx;

    ctx.fill();
    let bW = screen.width / screen.width;
    let bH =  (screen.height / screen.enteringY.max);

    ctx.beginPath();
    ctx.arc(bW * screen.timeCount, screen.height -(bH * v), 5, 0, 2*Math.PI);
    ctx.stroke();

    screen.timeCount++;
    if(screen.timeCount > screen.width) {
        screen.timeCount = 0;
        screen.drawScreen();
    }
}
function drawTimeAndY(screen, v) {
    let ctx = screen.ctx;
    ctx.fill();

    // console.log(screen.timeCount, v);

    let bW = screen.width / screen.width;
    let bH =  (screen.height / screen.enteringY.max);


    ctx.beginPath();
    ctx.arc(bW * screen.timeCount, screen.height -(bH * v), 5, 0, 2*Math.PI);
    ctx.stroke();

    screen.timeCount++;
    if(screen.timeCount > screen.width) {
        screen.timeCount = 0;
        screen.drawScreen();
    }
}
function drawOscilloscope(screen, analyser) {
    let ctx = screen.ctx;

    analyser.getByteTimeDomainData(analyser.tabData);

    ctx.fillStyle = screen.defaultBgColor;
    screen.drawScreen();
    ctx.strokeStyle = "green";
    ctx.lineWidth = 2;

    ctx.beginPath();
    let sliceW = screen.width * 1.0 / analyser.buffer;

    let x = 0;
    let str = "";
    for(let i = 0; i < analyser.buffer; i ++){
        let v = analyser.tabData[i] /128.0;
        let y = v * screen.height/2;

        if(i === 0) {
            ctx.moveTo(x, y);
        }
        else {
            ctx.lineTo(x, y);
        }
        x += sliceW;
        str += Math.round(v);
    }
    ctx.lineTo(screen.width, screen.height/2);
    ctx.stroke();
    //
}