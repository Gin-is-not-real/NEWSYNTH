///////////////////////////////////////
class Module {
    name;
    synth;
    designation;
    modulePanel;
    domPanel;

    constructor(name, synth) {
        this.name = name;
        this.synth = synth;
        this.designation = "module";
        // this.modulePanel = new ModulePanel(this);
        this.modulePanel = new ModulePanel(this);
        this.domPanel = this.modulePanel.createModuleDomPanel();
    }
    setPanel(panel) {
        this.modulePanel = panel;
        this.domPanel = [];
        this.domPanel = this.modulePanel.createModuleDomPanel();
    }
    describe(filter) {
        let str = "";
        console.log("----------------------------");
        console.log("DESCRIBE:");
        for(var i in this) {
            if(this.hasOwnProperty(i)) {
                if(typeof this[i] != filter) {
                    str +="\n"+ i + ": "+ this[i];
                    console.log(i + ": ", this[i]);
                }
                // if(typeof this[i] != )
                // console.log(i + ": ", this[i]);
            }
        }
        console.log("----------------------------");
        return str;
    }
}
///////////////////////////////////////
//CONTROLLER MODULE
class ControllerModule extends Module {
    constructor(name, synth) {
        super(name, synth);
        this.designation = "Controller";
    }
}
///////////////////////////////////////
//VISUALISER MODULE
class MonitorModule extends Module {
    // enterings;
    // enteringX;
    // enteringY;
    constructor(name, synth) {
        super(name, synth);
        this.designation = "MonitorModule";
    }
}
///////////////////////////////////////
//NODE MODULE
class NodeModule extends Module {
    core;
    constructor(name, synth) {
        super(name, synth);
        this.designation = "NodeModule";

        this.core = this.createCore();
        makeAsControllable(this);
        this.initModuleParams();
        // this.initConnections();
    }
    createCore() {}
    initModuleParams() {}
    initConnections() {}
}
///////////////////////////////////////
//OSC
class OscillatorModule extends NodeModule {
    constructor(name, synth) {
        super(name, synth);
        this.designation = "OscillatorModule";
        this.initConnections();
    }
    createCore() {
        let core = [];
        this.oscNode = audioCtx.createOscillator();
        this.gainNode = audioCtx.createGain();

        core.push(this.oscNode, this.gainNode);
        this.audioOutput = this.gainNode;

        return core;
    }

    initModuleParams() {
        this.frequency = this.oscNode.frequency;
        this.type = this.oscNode.type;
        this.detune = this.oscNode.detune
        this.gain = this.gainNode.gain;
        this.gain.value = 1;

        this.controllablesParams = [
            {text: "type", target: this, targetedParam: "type"},
            {text: "frequency", target: this.frequency, targetedParam: "value"},
            {text: "detune", target: this.detune, targetedParam: "value"},
            {text: "gain", target: this.gain, targetedParam: "value"}
        ];

        console.log("CONTROLLABLES", this.controllablesParams);
    }
    initConnections() {
        console.log("CONNECTION");
        let osc = this.core[0];
        let gainNode = this.core[1];

        osc.defaultDestination = gainNode;
        osc.destination = osc.defaultDestination;
        osc.connect(osc.destination);

        this.defaultDestination = this.synth.generalDestination;
        this.destination = this.defaultDestination;
        this.audioOutput = gainNode;
        this.audioOutput.connect(this.destination);

        gainNode.defaultDestination = this.synth.generalDestination;
        gainNode.destination = gainNode.defaultDestination;
        gainNode.connect(gainNode.defaultDestination);
        osc.start();
    }
}
//////////////////////////////////////////////////////
//FILTERS
class FilterModule extends NodeModule {
    constructor(name, synth, moduleInInput, tab) {
        super(name, synth);
        this.designation = "FilterModule";
        this.moduleInInput = moduleInInput;
        this.core = this.createCore(tab);
        this.initConnections();
    }
    createCore(tab) {
        let n = tab != undefined ? tab.length : 1;

        let core = [];
        for(let i = 0; i < n; i++) {
            let filter = audioCtx.createBiquadFilter();
            // makeAsAudioTransReceptor(filter);
            filter.type = tab != undefined ? tab[i] : "lowpass";
            core.push(filter);
        }
        // this.audioInput = core[0];
        // this.audioOutput = core[core.length - 1];

        console.log("CORE", core, "in", this.audioInput, "out", this.audioOutput);
        return core;
    }
    initModuleParams() {
        this.controllablesParams = [];
        this.core.forEach(f => {
            this.core.forEach(f => {
                let i = this.core.indexOf(f);
                f.frequency.value = FILTER_DEFAULT_FREQUENCY_VALUE[f.type];

                this.controllablesParams.push(
                    {text: "type_"+ i, target: f, targetedParam: "type"},
                    {text: "cutoff_"+ i, target: f.frequency, targetedParam: "value"},
                    {text: "Q_"+ i, target: f.Q, targetedParam: "value"},
                )
            });
        });
        console.log("CONTROLLABLES", this.controllablesParams);
    }
    // initModuleParams() {
    //     let filter1 = this.core[0];
    //     filter1.type = "lowpass";
    //     filter1.frequency.value = FILTER_DEFAULT_FREQUENCY_VALUE["lowpass"];

    //     this.controllablesParams = [
    //         {text: "type1", target: filter1, targetedParam: "type"},
    //         {text: "cutoff1", target: filter1.frequency, targetedParam: "value"},
    //         {text: "q1", target: this.Q, targetedParam: "value"},
    //     ];
    //     console.log("CONTROLLABLES", this.controllablesParams);
    // }
    initConnections() {
        this.audioInInput = this.moduleInInput.audioOutput;
        this.defaultDestination = this.moduleInInput.destination;
        this.destination = this.defaultDestination;

        // this.core.forEach(f => {
        //     f.defaultDestination = this.defaultDestination;
        //     f.destination = f.defaultDestination;
        //     f.isPlugged = false;
        // });

    }

    plug(i) {
        i = parseInt(i);
        let f = this.core[i];
        f.isPlugged = true;
        let last = this.audioInInput;

            for(let j = 0; j < i; j++) {
                console.log(i, " ", this.core[j].isPlugged);
                if(this.core[j].isPlugged) {
                    last = this.core[j];
                }
            }
        console.log("last", last);
        let outDest = last.destination;

        last.disconnect();
        f.disconnect();
        last.destination = f;
        last.destination.audioInInput = last;
        last.connect(last.destination);
        f.destination = outDest;
        f.destination.audioInInput = f;
        f.connect(f.destination);

        // this.updateCoreConnections();
    }
    unplug(i) {
        let f = this.core[i];
        f.isPlugged = false;
        let inInput = f.audioInInput;
        console.log("in", inInput, "out", f.destination);
        // this.updateCoreConnections();
        f.disconnect();
        inInput.disconnect();
        inInput.destination = f.destination;
        inInput.destination.audioInInput = inInput;
        inInput.connect(inInput.destination);
    }

}
//////////////////////////////////////////////////////
class FilterModule2 extends NodeModule {
    constructor(name, synth, moduleInput) {
        super(name, synth);
        this.designation = "FilterModule";
        this.moduleInput = moduleInput;
        // this.initConnections();
    }
    createCore() {
        let core = [];
        let filter1 = audioCtx.createBiquadFilter();
        filter1.isPlug = false;
        let filter2 = audioCtx.createBiquadFilter();
        filter2.isPlug = false;
        // this.filterNodes = [filter1, filter2];
        core.push(filter1);
        core.push(filter2);
        this.audioInput = filter1;
        this.audioOutput = filter2;

        console.log(core);
        return core;
    }
    initModuleParams() {
        let filter1 = this.core[0];
        filter1.type = "lowpass";
        filter1.frequency.value = FILTER_DEFAULT_FREQUENCY_VALUE["lowpass"];

        let filter2 = this.core[1];
        filter2.type = "highpass";
        filter2.frequency.value = FILTER_DEFAULT_FREQUENCY_VALUE["highpass"];

        this.controllablesParams = [
            {text: "type1", target: filter1, targetedParam: "type"},
            {text: "cutoff1", target: filter1.frequency, targetedParam: "value"},
            // {text: "q1", target: this.Q, targetedParam: "value"},
            {text: "type2", target: filter2, targetedParam: "value"},
            {text: "cutoff2", target: filter2.frequency, targetedParam: "value"},
        ];
        console.log("CONTROLLABLES", this.controllablesParams);
    }
    initConnectionsBASE() {
        let f1 = this.core[0];
        let f2 = this.core[1];

        f1.defaultDestination = f2;
        f1.destination = f2;
        f1.connect(f2);

        f2.defaultDestination = this.audioInput.destination;
        f2.destination = f2.defaultDestination;
        
        this.audioInput = f1;
        this.audioOutput = f2;
    }
    initConnections() {
    }
    // plug() {
    //     let f1 = this.core[0];
    //     let f2 = this.core[1];
    //     let audioIn = this.moduleInput.audioOutput;

    //     f2.destination = audioIn.destination();
    //     audioIn.disconnect();
    //     audioIn.destination = f1;
    //     audioIn.connect(audioIn.destination);
    //     f2.connect(f2.destination);
    // }
    // unplug() {
    //     let f1 = this.core[0];
    //     let f2 = this.core[1];
    //     let audioIn = this.moduleInput.audioOutput;

    //     audioIn.destination = f2.destination;
    //     f2.disconnect();
    //     audioIn.connect(audioIn.destination);

    // }

}
//////////////////////////////////////////////////////
class Lfo extends Module {
    targetsList = [];
    target;
    targetedParam;
    duration = 500;
    depth = 200;
    anim;
    // easing = "linear";
    // {value: "easeInOutCirc", text:"easeInOutCirc"},
    // {value: "easeInOutSine", text:"easeInOutSine"},
    // {value: "easeInQuad", text:"easeInQuad"},
    // {value: "easeInBack", text:"easeInBack"},
    // {value: "easeInCirc", text:"easeInCirc"},
    // {value: "easeInBounce", text:"easeInBounce"},
    // {value: "easeOutQuart", text:"easeOutQuart"},
    easings = ["linear", "easeInOutCirc", "easeInOutSine"];
    eIndex = 0;
    constructor(name, synth, target, param) {
        super(name, synth);
        this.designation = "LfoModule";

        this.in = target.controlsList[param][0];

        this.timeCounter = {value: 0, max: this.duration};
        this.target = target;
        this.targetedParam = param;
        makeAsController(this, target, param);
        makeAsControllable(this);
        //#
        this.addTarget(filterModule.core[0].frequency, "value");

        // this.animProps = this.initAnim();
        this.assignAnim(this.initAnim());
    }
    initModuleParams() {
        this.controllablesParams = [
            {text: "depth", target: this, targetedParam: "depth"},
            {text: "duration", target: this, targetedParam: "duration"},
        ];

    }
    initAnim() {
        let module = this;
        let anim = {
            targets: module.target,
            value: [parseInt(module.in.value) , parseInt(module.in.value) + module.depth],
            // value: parseInt(module.in.value + module.depth),
            duration: module.duration,
            loop: true,
            autoplay: false,
            easing: module.easings[module.eIndex],
            update: function() {
                drawTimeAndY(module.monitor, module.target[module.targetedParam]);
                module.anim.animations[0].tweens[0].from.numbers[0] = parseInt(module.in.value);
                module.anim.animations[0].tweens[0].to.numbers[0] = parseInt(module.in.value) + module.depth;
                module.anim.duration = module.duration;
                module.timeCounter.value ++;
                if(module.timeCounter.value === module.duration) {
                    module.timeCounter.value = 0;
                    module.monitor.drawScreen();
                }
            }
        }
        return anim;
    } 
    initAnim2() {
        let module = this;
        // let t1 = module.targetsList[0].target.value;
        // let t2 = module.targetsList[1].target.value;

        let targ = {
            t1: module.targetsList[1].target.controlsList["value"][0].value,
            t2: module.targetsList[2].target.controlsList["value"][0].value,
        }
        console.log(targ);

        let anim = {
            targets: targ,
            t1:  parseInt(module.targetsList[1].target.controlsList["value"][0].value) + parseInt(module.dept),
            t2: parseInt(module.targetsList[2].target.controlsList["value"][0].value) + parseInt(module.depth),
            duration: module.duration,
            loop: true,
            autoplay: false,
            easing: module.easings[module.eIndex],
            update: function() {
                drawTimeAndY(module.monitor, module.anim.t1);
                drawTimeAndY(module.monitor, module.anim.t2);


                module.anim.t1 = parseInt(module.targetsList[1].target.controlsList["value"][0].value) + parseInt(module.depth);

                module.anim.t2 = parseInt(module.targetsList[2].target.controlsList["value"][0].value) + parseInt(module.depth);

                console.log(module.anim.t1, module.anim.t2);
                module.anim.duration = module.duration;
                module.timeCounter.value ++;
                if(module.timeCounter.value === module.duration) {
                    module.timeCounter.value = 0;
                    module.monitor.drawScreen();
                }
            }
        }
        return anim;
    } 
    initAnimMulti() {//ne fonctione ^pas comme il faudrait
        let module = this;
        let targs = [];
        module.targetsList.forEach(t => {
            targs.push(t.target);
        })
        let anim = {
            // targets: module.target,
            targets: targs,
            value: [parseInt(module.in.value) , parseInt(module.in.value) + module.depth],
            // value: parseInt(module.in.value + module.depth),
            duration: module.duration,
            loop: true,
            autoplay: false,
            easing: module.easings[module.eIndex],
            update: function() {
                // drawTimeAndY(module.monitor, module.target[module.targetedParam]);
                module.targetsList.forEach(e => {
                    drawTimeAndY(module.monitor, e.target[e.targetedParam]);
                })
                // module.anim.animations[0].tweens[0].from.numbers[0] = parseInt(module.in.value);
                // module.anim.animations[0].tweens[0].to.numbers[0] = parseInt(module.in.value) + module.depth;
                // module.anim.duration = module.duration;
                // module.timeCounter.value ++;
                if(module.timeCounter.value === module.duration) {
                    module.timeCounter.value = 0;
                    module.monitor.drawScreen();
                }
            }
        }
        // this.anim = anime(anim);
        return anim;
    }
    assignAnim(a) {
        this.anim = anime(a);
        console.log(this.anim );
    }
}
//////////////////////////////////////////////////////
//VISUALISER
class AnalyserModule extends NodeModule {
    enteringModule;
    constructor(name, synth, enteringModule) {
        super(name, synth);
        this.designation = "AnalyserModule";
        this.enteringModule = enteringModule != undefined ? enteringModule : undefined;
    }
    createCore() {
        let core = [];
        let visu = audioCtx.createAnalyser();
        core.push(visu);

        this.audioInput = visu;
        this.audioOutput = visu;
        return core;
    }
    initConnections() {
        let dest = enteringModule.destination;
        this.enteringModule.disconnect();
        this.enteringModule.destination = this.audioInput;
        this.enteringModule.connect(this.audioInput);
        this.audioOutput.destination = dest;
        this.audioOutput.connect(dest);
        dest.enteringModule = this.audioOutput;
    }
}
class AnalyserModule2 extends NodeModule {
    enteringModule;
    constructor(name, synth, enteringNode) {
        super(name, synth);
        this.designation = "AnalyserModule";
        this.enteringNode = enteringNode != undefined ? enteringNode : undefined;
    }
    createCore() {
        let core = [];
        let analyser = createAnalyserNode1();

        core.push(analyser);
        this.audioInput = analyser;
        this.audioOutput = analyser;
        return core;
    }
    // createCore() {
    //     let core = [];
    //     let analyser = audioCtx.createAnalyser();
    //     analyser.fftSize = 256;
    //     analyser.buffer = analyser.frequencyBinCount;
    //     analyser.tabData = new Uint8Array(analyser.buffer);

    //     core.push(analyser);
    //     this.audioInput = analyser;
    //     this.audioOutput = analyser;
    //     return core;
    // }
    initConnections() {
        let dest = enteringNode.destination;
        this.enteringNode.disconnect();
        this.enteringNode.destination = this.audioInput;
        this.enteringNode.connect(this.audioInput);
        this.audioOutput.destination = dest;
        this.audioOutput.connect(dest);
        dest.enteringModule = this.audioOutput;
    }
    initAnalyser() {

    }
}//TEST
//////////////////////////////////////////////////////
function generate(obj) {
    let elt = document.createElement(obj.elt);

    for(var i in obj.properties) {
        if(obj.properties.hasOwnProperty(i)) {
            elt[i] = obj.properties[i];
        }
    }

    console.log(elt, "generated");
    return elt;
}
