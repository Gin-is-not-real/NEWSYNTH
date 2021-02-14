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
// nodeModule.describe("function");
// console.log("MAIN", nodeModule.core[0]);

let filterModule = new FilterModule("filterTest", synth1, nodeModule, ["highpass", "notch"]);
filterModule.setPanel(new FilterPanel(filterModule));
synth1.addModule(filterModule);

let visu = new MonitorModule("monitoTest", synth1);
visu.setPanel(new VisualiserPanel(visu));
visu.screen.drawScreen();
synth1.domPanel2.appendChild(visu.domPanel);

let lfo = new Lfo("lfo", synth1, nodeModule.frequency, "value");
lfo.setPanel(new LfoPanel(lfo));
lfo.monitor = visu.screen;
visu.screen.enteringY = nodeModule.frequency.controlsList["value"][0];
lfo.describe("function");
synth1.domPanel2.prepend(lfo.domPanel);

// let scope = new AnalyserModule2("scope", synth1, nodeModule);
// scope.setPanel(new VisualiserPanel2(scope));
// synth1.domPanel2.prepend(scope.domPanel);

