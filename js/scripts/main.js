let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
///////////////////////////////////////////////////////////
let root = document.querySelector(".root");
let popup = document.querySelector(".popup");


///////////////////////////////////////////////////////////
//SYNTH
let synth1 = new Synth("synth1");
root.appendChild(synth1.domPanel);
root.appendChild(synth1.domPanel2);
/////////////////////////////////////////////
//modules and panel
let nodeModule = new OscillatorModule("nodeTest", synth1);
nodeModule.setPanel(new OscilloPanel2(nodeModule));
synth1.addModule(nodeModule);

let filterModule = new FilterModule("filterTest", synth1, nodeModule, ["lowpass", "notch"]);
filterModule.setPanel(new FilterPanel(filterModule));
synth1.addModule(filterModule);

let visu = new OscilloscopeModule("Oscilloscope", synth1, nodeModule.core[1]);
visu.setPanel(new OscilloscopePanel(visu));
visu.screen.drawScreen();
synth1.addModule(visu, synth1.domPanel2);

let lfo = new Lfo("lfo", synth1, nodeModule.frequency, "value");
lfo.setPanel(new LfoPanel(lfo));
lfo.monitor = visu.screen;
visu.screen.enteringY = nodeModule.frequency.controlsList["value"][0];
lfo.describe("function");
synth1.domPanel2.prepend(lfo.domPanel);


