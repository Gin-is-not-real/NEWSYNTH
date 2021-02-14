///////////////////////////////////////////////////////////
//SYNTH
class Synth {
    name;
    generalDestination;
    modules;
    domPanel;
    domPanel2;

    constructor(name) {
        this.name = name;
        this.generalDestination = audioCtx.destination;
        this.modules = [];

        this.domPanel = document.createElement("div");
        this.domPanel2 = document.createElement("div");
    }

    addModule = function(module, panel) {
        this.modules.push(module);

        panel = panel != undefined ? panel : this.domPanel;
        panel.appendChild(module.domPanel);
    }
}
