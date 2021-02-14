/////////////////////////////////////////
//CORES
function sendParams(core, module) {
    let tab = [];
    core.forEach(node => {
        node.controllablesParams.forEach(element => {
            tab.push(
                {
                    target: element.target, 
                    targetedParam: element.targetedParam, 
                    text: element.text,
                }
            )
        });
    })
    console.log("send  ", tab);
    return tab;
}
function searchIndexParam(module, text) {
    module.controllablesParams.forEach(p => {
        if(p.text === text) {
            return module.controllablesParams.indexOf(p);
        }
    })
}

function coreCreateOsc1() {
    let osc = audioCtx.createOscillator();
    osc.controllablesParams = [        
        {text: "type", target: osc, targetedParam: "type"},
        {text: "frequency", target: osc.frequency, targetedParam: "value"},
        {text: "detune", target: osc.detune, targetedParam: "value"}
    ];
    return osc;
}
function coreCreateOsc1Gain() {
    let gain = audioCtx.createGain();
    gain.controllablesParams = [
        {text: "gain", target: gain.gain, targetedParam: "value"}
    ];
    return gain;
}