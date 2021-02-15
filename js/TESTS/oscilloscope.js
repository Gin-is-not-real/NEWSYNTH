///////////////////////////////////////////////////////
//OSCILLOSCOPE
function createOscilloscope(module, node) {
    let oscilloscope = audioCtx.createAnalyser();
    oscilloscope.connect(audioCtx.destination);
    oscilloscope.monitor = module.screen;
    oscilloscope.intervalId = undefined;
    
    node.disconnect();
    node.connect(oscilloscope);
    node.destination = oscilloscope;
    
    oscilloscope.fftSize = 256;
    oscilloscope.buffer = oscilloscope.frequencyBinCount;
    oscilloscope.tabData = new Uint8Array(oscilloscope.buffer);
    // oscilloscope.getByteFrequencyData(oscilloscope.tabData);
    // console.log(oscilloscope.tabData);
    oscilloscope.log = function() {
        oscilloscope.getByteTimeDomainData(oscilloscope.tabData);
        let str = "";
        for(let i = 0; i < oscilloscope.buffer; i++) {
            let v = oscilloscope.tabData[i] /oscilloscope.buffer;
            str += v;
        }
        divTarget.textContent = str;
        console.log(oscilloscope.tabData);
    }
    oscilloscope.run = function() {
        oscilloscope.intervalId = setInterval(oscilloscope.draw, 100);
    }

    oscilloscope.draw = function() {
        oscilloscope.getByteTimeDomainData(oscilloscope.tabData);
        // let c = oscilloscope.monitor;
        let c = module.screen;
        let ctx = c.ctx;
        ctx.fillStyle = c.defaultBgColor;
        c.drawScreen();
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2;
    
        ctx.beginPath();
        let sliceW = c.width * 1.0 / oscilloscope.buffer;
    
        let x = 0;
        let str = "";
        for(let i = 0; i < oscilloscope.buffer; i ++){
            let v = oscilloscope.tabData[i] /128.0;
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
    }

    oscilloscope.stop = function() {
        clearInterval(oscilloscope.intervalId);
        oscilloscope.intervalId = undefined;
    }

    oscilloscope.run();
}

function oscilloscopeNewBtnPlay(module) {
    console.log("CORE", module.core)
    let oscilloscope = module.core[0];
    let btnPlay = document.createElement("button");
    btnPlay.textContent = "run";

    btnPlay.onclick = function() {
        if(this.textContent === "run") {
            this.textContent = "stop";
            // oscilloscope.log();
            // this.intervalId = setInterval(oscilloscope.log, 500);
            oscilloscope.intervalId = setInterval(oscilloscope.draw, 100);
        } 
        else {
            this.textContent = "run";
            // oscilloscope.stop();
            clearInterval(oscilloscope.intervalId);
            oscilloscope.intervalId = undefined;
        }
    }
    return btnPlay;

}


