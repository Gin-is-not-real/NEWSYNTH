// let devDiv = document.querySelector(".dev");
// // let btnTest = document.createElement("button");
// // btnTest.textContent = "TEST";
// // // devDiv.prepend(btnTest);

// // let btnTest2 = document.createElement("button");
// // btnTest2.textContent = "TEST2";
// // devDiv.prepend(btnTest2);

// let btnTest3 = document.createElement("button");
// btnTest3.textContent = "TEST3";
// devDiv.appendChild(btnTest3);

let divTarget = document.createElement("divTarget");
divTarget.className = "animTest";
divTarget.id = "divTarget";
divTarget.textContent = "0";
// devDiv.appendChild(divTarget);
// // makeAsController(btnTest);
// // btnTest.addControlOutput(nodeModule.frequency, "value");
// // btnTest.describe();

let inTest = document.createElement("input");
inTest.type = "number";
inTest.value = 300;
makeAsController(inTest);
// inTest.addControlOutput(nodeModule.frequency, "value");
inTest.addTarget(nodeModule.frequency, "value");
inTest.addEventListener("input", e => {
    e.target.defaultControlFunction();
    // console.log(nodeModule.frequency.controlInputs);
})
// devDiv.prepend(inTest);


///////////////////////////////////////////////////////
//GOOD
// visu.screen.drawFreq = function(freq) {
//     let ctx = this.ctx;
//     ctx.beginPath();
//     ctx.clearRect(0,0,screen.width, screen.height);
//     ctx.fill();

//     let uH = this.height / 2;//GAIN
//     let bH;
//     let bW = this.width / 1000;
//     // console.log("uH:", uH, "bW:", bW, "bW * freq:", bW * freq);
//     ctx.beginPath();
//     ctx.arc((bW * freq), uH, 20, 0, 2 * Math.PI );
//     ctx.stroke();
// }
// visu.screen.enteringXMax;
// visu.screen.enteringYMax;
// visu.screen.enteringXMax = 500;
// visu.screen.enteringYMax = 2000;

// visu.screen.drawXY = function(t, v) {
//     drawXY(this, t, v);
// }
//ANIME
let countTime = 0;
let control = nodeModule.core[0].frequency.controlsList["value"][0];
let control2 = inTest;
let monteFreq = anime({
    targets: nodeModule.core[0].frequency,
        value: [control.value, control.value + control2.value],
        // delay: 1000,
        duration: 1000,
        // direction: 'alternate',
        // easing: "linear",
        // easing: 'easeInOutSine',
        // easing: 'easeInQuad',
        // easing: 'easeInCubic',
        // easing: 'easeInBack',
        // easing: 'easeInCirc',
        // easing: 'easeInBounce',
        // easing: 'easeOutQuart',
        easing: 'easeInOutCirc',

    loop: true,
    autoplay: false,
    update: function() {
        visu.screen.drawXY(countTime, nodeModule.frequency.value);

        monteFreq.animations[0].tweens[0].from.numbers[0] = parseInt(control.value);

        monteFreq.animations[0].tweens[0].to.numbers[0] = parseInt(control.value) + parseInt(control2.value);

        divTarget.textContent = monteFreq.animations[0].tweens[0].from.numbers[0] +" "+ monteFreq.animations[0].tweens[0].to.numbers[0];

        countTime ++;
        if(countTime === 500) {
            countTime = 0;
            visu.screen.drawScreen();
        }
    }
})
// console.log("monteFreq", monteFreq);
// btnTest.onclick = monteFreq.play;
// btnTest2.onclick = monteFreq.pause;
// btnTest3.textContent = "log";
// btnTest3.onclick = function() {
//     console.log(monteFreq)
//     monteFreq.duration = 200;
// }
///////////////////////////////////////////////////////
//LFO
let analyser = audioCtx.createAnalyser();
analyser.connect(audioCtx.destination);
analyser.monitor = visu.screen;

nodeModule.audioOutput.disconnect();
nodeModule.audioOutput.connect(analyser);
nodeModule.audioOutput.destination = analyser;

analyser.fftSize = 256;
analyser.buffer = analyser.frequencyBinCount;
analyser.tabData = new Uint8Array(analyser.buffer);
// analyser.getByteFrequencyData(analyser.tabData);
// console.log(analyser.tabData);
analyser.log = function() {
    analyser.getByteTimeDomainData(analyser.tabData);
    let str = "";
    for(let i = 0; i < this.buffer; i++) {
        let v = analyser.tabData[i] /this.buffer;
        str += v;
    }
    divTarget.textContent = str;
    console.log(analyser.tabData);
}
analyser.draw = function() {
    analyser.getByteTimeDomainData(analyser.tabData);
    let c = analyser.monitor;
    let ctx = c.ctx;
    ctx.fillStyle = c.defaultBgColor;
    c.drawScreen();
    ctx.strokeStyle = "green";
    ctx.lineWidth = 2;

    ctx.beginPath();
    let sliceW = c.width * 1.0 / analyser.buffer;

    let x = 0;
    let str = "";
    for(let i = 0; i < analyser.buffer; i ++){
        let v = analyser.tabData[i] /128.0;
        let y = v * c.height/2;

        if(i === 0) {
            ctx.moveTo(x, y);
        }
        else {
            ctx.lineTo(x, y);
        }
        x += sliceW;
        str += Math.round(v);
    }
    ctx.lineTo(c.width, c.height/2);
    ctx.stroke();
    divTarget.textContent = str;
}
analyser.stop = function() {
    clearInterval(this.intervalId);
    analyser.intervalId = undefined;
}

analyser.intervalId = undefined;
btnTest3.textContent = "run";

btnTest3.onclick = function() {
    if(this.textContent === "run") {
        this.textContent = "stop";
        // analyser.log();
        // this.intervalId = setInterval(analyser.log, 500);
        this.intervalId = setInterval(analyser.draw, 100);
    } 
    else {
        this.textContent = "run";
        // analyser.stop();
        clearInterval(this.intervalId);
        analyser.intervalId = undefined;
    }
}

