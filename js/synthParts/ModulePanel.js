class ModulePanel {
    module;
    sections;
    subSections;
    elements;

    constructor(module) {
        this.module = module;
        this.sections = [];        
        this.subSections = [];
        this.elements = [];
        this.domPanel = this.createModuleDomPanel();
    }
    createModuleDomPanel() {
        let domPanel = document.createElement("div");
        domPanel.className = "modulePanel";
        domPanel.textContent = this.name;
        // domPanel.appendChild(this.addHeaderDiv());
        // this.loadModulePanel(domPanel);
        this.initModulePanel(domPanel);

        return domPanel;
    }
    initModulePanel(domPanel) {

    }
    loadModulePanel(tab, domPanel) {
        tab.forEach(e => {
            // this.sections.push(e);
            domPanel.appendChild(e);
        });
        return tab;
    }
    addNewDiv(id) {
        let div = document.createElement("div");
        div.className = "section";
        div.id = id;
        // div.textContent = name;
        //TEST
        // makeAsMouseReactif(div, ["bgColor", "popup"]);
        // makeAsPopupable(div);
        this.sections[div.id] = div;
        return div;
    }
    addNewSubDiv(id) {
        let subDiv = document.createElement("div");
        subDiv.className = "subDiv";
        subDiv.id = id;
        this.subSections[id] = subDiv;
        return subDiv;
    }
    addNewComponent(comp) {
        // console.log(comp);
        
        let sd = this.addNewSubDiv("subDiv_"+ comp.className);
        if(comp.label != undefined) {
            sd.appendChild(document.createTextNode(comp.label));
        }
        if(Array.isArray(comp)) {
            // console.log("is array")
            comp.forEach(e => {
                sd.appendChild(e);
                this.elements.push(e);
            });
        }
        else {
            sd.appendChild(comp);
            this.elements.push(comp);
        }
        return sd;
    }
    addControl(control, domParent) {
        // this.controls.push(control);
        this.controls[control.name] = control;

        domParent.append(control.dom);
    }
}
/////////////////////////////////////////////////////////
class AusterePanel extends ModulePanel {
    designation = "AusterePanel";
    constructor(module, sections, domPanel) {
        super(module, sections, domPanel);

        // console.log(module);
    }
    
    initModulePanel(domPanel) {
        let divHeader = this.addHeaderDiv();
        // let displayable = this.addDisplayableDiv();
        // displayable.appendChild(this.createButtonDisplay("test"));
        let tab = [divHeader];
        this.loadModulePanel(tab, domPanel);
        return tab;
    }
    addHeaderDiv() {
        let div = this.addNewDiv("divHeader");
        div.appendChild(this.addTitle());
        div.appendChild(this.addReduceExpand());
        // div.appendChild(this.addInOutDiv());
        return div;
    }
    addTitle() {
        let div = this.addNewSubDiv("subDivTitle");

        let btnTitle = document.createElement("button");
        btnTitle.className = "btn";
        btnTitle.textContent = this.module.name;
        div.appendChild(btnTitle);
        //TEST
        makeAsPopable(div);
        div.popupContent = this.module.describe("object");

        return div;
    }
    addReduceExpand() {
        let div = this.addNewSubDiv("subDivReduceAndExpand");
        // let div = this.addNewDiv("divTitle");

        let btnReduce = document.createElement("button");
        btnReduce.className = "btn";
        btnReduce.textContent = "-";
        //TEST
        makeAsPopable(btnReduce);
        btnReduce.popupContent = " reduce ";
        div.appendChild(btnReduce);

        let btnExpand = document.createElement("button");
        btnExpand.className = "btn";
        btnExpand.textContent = "+";
        makeAsPopable(btnExpand);
        btnExpand.popupContent = " expand ";
        div.appendChild(btnExpand);

        return div;
    }
    //TEST
    // addTestDiv() {
    //     let div = this.addNewDiv("section");
    //     div.appendChild(this.addInTest());
    //     return div;
    // }
    // addInTest() {
    //     let subDiv = this.addNewSubDiv("subDivTest");
    //     // subDiv.appendChild(document.createTextNode("TEST"));
    //     // subDiv.appendChild(document.createElement("input"));
    //     let btnTest = this.createButtonDisplay("test");
    //     subDiv.appendChild(btnTest);
    //     return subDiv;
    // }
    //EXPE
    addInOutDiv() {
        let div = this.addNewDiv("invisibleDiv");
        let btnInOut = document.createElement("button");
        btnInOut.className = "inOut";
        btnInOut.textContent = " ";
        div.appendChild(btnInOut);

        return div;
    }
}
/////////////////////////////////////////////////////////
//DISPLAYER - des boutons font appraitre des divs
/////////////////////////////////////////////////////////
class AustereDisplayerPanelBASE extends AusterePanel {
    constructor(module, sections, subSections, domPanel) {
        super(module, sections, subSections, domPanel);
    }
    initModulePanel(domPanel) {
        let divHeader = this.addHeaderDiv();
        let displayable = this.addDisplayableDiv();

        let divTest = this.addTestDiv();
        displayable.appendChild(this.createButtonDisplay("test"));

        let tab = [divHeader, divTest];
        this.loadModulePanel(tab, domPanel);
        return tab;
    }
    addDisplayableDiv() {
        let subDiv = document.createElement("div");
        subDiv.className = "displayable";
        subDiv.id = "subDivDisplayable";
        this.subSections[subDiv.id] = subDiv;

        return subDiv;
    }
    addDisplayDiv(id) {
        let I = id.charAt(0).toUpperCase();
        // let d = id.substring(1);
        let Id = I + id.substring(1);
        let div = this.addNewDiv("div" + Id);

        let subDiv = this.addNewSubDiv("subDiv" + Id);
        // div.appendChild(document.createTextNode(id));
        // let btn = this.createButtonDisplay(id, id);
        // makeAsController(btn);
        // btn.addControlOutput(this.subSections["subDivDisplay"].style, "display");

        // subDiv.appendChild(btn);
        // makeAsPopable(btn);
        // btn.popupContent = describe(btn, "object");

        div.appendChild(subDiv);
        return div;
    }
    createButtonDisplay(text, id) {
        if(this.elements["displayBtns"] === undefined) {
            this.elements["displayBtns"] = [];
        }
        let list = this.elements["displayBtns"].slice();

        let btn = document.createElement("button");
        btn.className = "btnDisplay";
        btn.id = id;
        btn.textContent = text;
        btn.value = "none";
        
        btn.addEventListener("click", e => {
            let btn = e.target;
            // console.log(btn, btn.controlOutputs);
            if(btn.value === "none") {
                btn.value = "block";
            }
            else {
                btn.value = "none";
            }
            this.display(btn);
        })
        // makeAsController(btn);
        // let t = this.subSections["subDivDisplay"].style;
        // btn.addControlOutput(t, "display");

        list.push(btn);
        this.elements["displayBtns"] = list;
        return btn;
    }
    display(btn) {
        this.elements["displayBtns"].forEach(b => {
            b.value = b != btn ? "none" : btn.value;
            // console.log(b);
        });
        console.log("DISPLAY", btn);
        let displayDiv = this.subSections["subDivDisplayable"];
        displayDiv.style.display = btn.value;
        displayDiv.textContent = btn.id;

        let target = this.module.searchParam(btn.id, "text");

        if(this.elements["displayBtns"].includes(btn)) {
            // console.log(btn);
        }
        btn.parentNode.parentNode.appendChild(displayDiv);
    }
    //TEST
    addTestDiv() {
        let div = this.addNewDiv("section");
        div.appendChild(this.addInTest());
        return div;
    }
    addInTest() {
        let subDiv = this.addNewSubDiv("subDivTest");
        let btnTest = this.createButtonDisplay("test");
        btnTest.popupContent = describe(btnTest, "object");
        makeAsPopable(btnTest);

        subDiv.appendChild(btnTest);
        return subDiv;
    }
}//a voir
class AustereDisplayerPanel extends AusterePanel {
    constructor(module, sections, subSections, domPanel) {
        super(module, sections, subSections, domPanel);
    }
    initModulePanel(domPanel) {
        let divHeader = this.addHeaderDiv();

        let tab = [divHeader];
        this.loadModulePanel(tab, domPanel);
        return tab;
    }
    addDisplayableDiv(id) {
        let subDiv = document.createElement("div");
        subDiv.className = "displayable";
        subDiv.id = "sdd_" + id;
        subDiv.style.display = "none";
        this.subSections[subDiv.id] = subDiv;

        return subDiv;
    }
    addDisplayDiv(id) {
        let I = id.charAt(0).toUpperCase();
        let Id = I + id.substring(1);
        let div = this.addNewDiv("div" + Id);

        let subDiv = this.addNewSubDiv("subDiv" + Id);
        // div.appendChild(document.createTextNode(id));
        div.appendChild(subDiv);

        let sdd = this.addDisplayableDiv(id);
        div.appendChild(sdd);

        let btn = this.createButtonDisplay(id, id);
        div.childNodes[0].appendChild(btn);
        makeAsController(btn);
        btn.addControlOutput(sdd.style, "display");

        return div;
    }
    createButtonDisplay(text, id) {
        if(this.elements["displayBtns"] === undefined) {
            this.elements["displayBtns"] = [];
        }
        let list = this.elements["displayBtns"].slice();

        let btn = document.createElement("button");
        btn.className = "btnDisplay";
        btn.id = id;
        btn.textContent = text;
        btn.value = "none";
        
        btn.addEventListener("click", e => {
            let btn = e.target;
            // console.log(btn, btn.controlOutputs);
            if(btn.value === "none") {
                btn.value = "block";
            }
            else {
                btn.value = "none";
            }
            this.display(btn);
        })
        // makeAsController(btn);
        // let t = this.subSections["subDivDisplay"].style;
        // btn.addControlOutput(t, "display");

        list.push(btn);
        this.elements["displayBtns"] = list;
        return btn;
    }
    display(btn) {
        this.elements["displayBtns"].forEach(b => {
            if(b != btn) {
                b.value = "none";
            }
            this.subSections["sdd_"+b.id].style.display = b.value;
        });
        console.log("DISPLAY", btn.id);
        let displayDiv = this.subSections["sdd_"+btn.id];
        displayDiv.textContent = btn.id;

        let param;
        this.module.controllablesParams.forEach(e => {
            if(e.text === btn.id) {
                // console.log(e.text, e.target, e.targetedParam);
                param = e.target[e.targetedParam];
                // console.log(param);
                displayDiv.textContent += " " + param;
            }
        })
        if(this.elements["displayBtns"].includes(btn)) {
            // console.log(btn);
        }
        btn.parentNode.parentNode.appendChild(displayDiv);
    }
    //TEST
    addTestDiv() {
        let div = this.addNewDiv("section");
        div.appendChild(this.addInTest());
        return div;
    }
    addInTest() {
        let subDiv = this.addNewSubDiv("subDivTest");
        let btnTest = this.createButtonDisplay("test");
        btnTest.popupContent = describe(btnTest, "object");
        makeAsPopable(btnTest);

        subDiv.appendChild(btnTest);
        return subDiv;
    }
}
/////////////////////////////////////////////////////////
class AustereDisplayerPanel2 extends AustereDisplayerPanel {
    constructor(module, sections, subSections, domPanel) {
        super(module, sections, subSections, domPanel);
    }
    initModulePanel(domPanel) {
        let divHeader = this.addHeaderDiv();
        // let displayable = this.addDisplayableDiv();
        let tab = [divHeader];
        console.log(this.module);

        this.module.controllablesParams.forEach(p => {
            // console.log("INIT", p.text, ": ", p.target[p.targetedParam]);
            let div = this.addDisplayDiv(p.text);
            // let btn = this.createButtonDisplay(p.text, p.text);
            // div.childNodes[0].appendChild(btn);
            // makeAsController(btn);
            // btn.addControlOutput(displayable.style, "display");
            tab.push(div);
        });
        this.loadModulePanel(tab, domPanel);
        return tab;
    }
}
////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////
class OscilloPanel extends ModulePanel {
    designation = "OscilloPanel";
    constructor(module, sections, domPanel) {
        super(module, sections, domPanel);
    }
    initModulePanel(domPanel) {
        let divTitle = this.addTitleDiv();

        let divWaves = this.addNewDiv("div_waves");
        divWaves.appendChild(this.addToggleWaveSubDiv());

        let divFreq = this.addNewDiv("div_freq");
        divFreq.appendChild(this.addInFreqSubDiv());
        divFreq.appendChild(this.addRFreqSubDiv());

        let tab = [
            divTitle, 
            divWaves,
            divFreq
        ];
        this.loadModulePanel(tab, domPanel);
    }
    addTitleDiv() {
        let div = this.addNewDiv(this.module.name);
        div.className = "divTitle";
        div.textContent = this.module.name;

        return div;
    }
    addToggleWaveSubDiv() {
        let subDiv = this.addNewSubDiv("subDiv_toggleWave");
        subDiv.appendChild(document.createTextNode("WAVE "));
        let toggle = createCompToggleWave(this.module, this.module);
        toggle.forEach(btn => {
            subDiv.appendChild(btn);
        })

        return subDiv;
    }
    addInFreqSubDiv() {
        let subDiv = this.addNewSubDiv("subDiv_inFreq");
        subDiv.appendChild(document.createTextNode("FREQ "));
        let inFreq = createNumericController(this.module, "freq", this.module.frequency, "value", 60, 5000);
        subDiv.appendChild(inFreq);
        return subDiv;
    } 
    addRFreqSubDiv() {
        let subDiv = this.addNewSubDiv("subDiv_rFreq");
        let rFreq = createControlRange(this.module, "rangeFreq", this.module.frequency, "value", 20, 2000, 10);
        subDiv.appendChild(rFreq);
        return subDiv;
    }
}
class OscilloPanel2 extends ModulePanel {
    designation = "OscilloPanel2";
    constructor(module, sections, subSections, elements, domPanel) {
        super(module, sections, subSections, elements,domPanel);
    }
    initModulePanel(domPanel) {
        let divTitle = roundTitleDiv(this.module);
        divTitle.appendChild(newRoundTitleBtnBypass(this.module, this.module.oscNode));

        let divWaves = this.addNewDiv("div_waves");
        let selectWave = this.addNewComponent(newToggle4Waves(this.module, this.module.oscNode));
        divWaves.appendChild(selectWave);
        
        let divFreq = this.addNewDiv("div_freq");
        let inFreq = this.addNewComponent(newInFreq(this.module, this.module.oscNode));
        let rFreq = this.addNewComponent(newRFreq(this.module, this.module.oscNode));
        divFreq.appendChild(inFreq);
        divFreq.appendChild(rFreq);

        let tab = [
            divTitle, 
            divWaves,
            divFreq
        ];
        this.loadModulePanel(tab, domPanel);
    }

}
////////////////////////////////////////////////////////

////////////////////////////////////////////////////////
class FilterPanel extends ModulePanel {
    designation = "FilterPanel";
    constructor(module, sections, domPanel) {
        super(module, sections, domPanel);
    }
    initModulePanel(domPanel) {
        let tab = [];
        this.module.core.forEach(f => {
            let index = this.module.core.indexOf(f);

            let divTitle = roundTitleDiv(this.module, this.module.name + index);
            divTitle.appendChild(newFilterRoundBtnBypass(this.module, index));

            let divFilter = this.addNewDiv("div_type");
            let selectType = this.addNewComponent(newFilterSelectType(this.module, f));
            divFilter.appendChild(selectType);

            let divCutoff = this.addNewDiv("div_cutoff");
            let inCutoff = this.addNewComponent(newFilterInCutoff(this.module, f));
            divCutoff.appendChild(inCutoff);
            let rCutoff = this.addNewComponent(newFilterRCutoff(this.module, f));
            divCutoff.appendChild(rCutoff);
    
            let divQ = this.addNewDiv("div_Q");
            let inQ = this.addNewComponent(newFilterInQ(this.module, f));
            divQ.appendChild(inQ);
            let rQ = this.addNewComponent(newFilterRQ(this.module, f));
            divQ.appendChild(rQ);

            tab.push(
                divTitle,
                divFilter,
                divCutoff,
                divQ
            )
        })
        this.loadModulePanel(tab, domPanel);
    }
}
////////////////////////////////////////////////////////
//LFO
class LfoPanel extends ModulePanel {
    designation = "LfoPanel";
    constructor(module, sections, domPanel) {
        super(module, sections, domPanel);
    }
    initModulePanel(domPanel) {
        let divTitle = roundTitleDiv(this.module);
        // let btnPlay = this.addNewComponent(lfoNewBtnPlay(this.module));
        let btnPlay = lfoNewRoundTitleBtnPlay(this.module);
        divTitle.appendChild(btnPlay);

        let divDepth = this.addNewDiv("div_depth");
        let inDepth = this.addNewComponent(lfoNewInDepth(this.module));
        divDepth.appendChild(inDepth);
        let rDepth = this.addNewComponent(lfoNewRDepth(this.module));
        divDepth.appendChild(rDepth);

        let divDuration = this.addNewDiv("div_duration");
        let inDuration = this.addNewComponent(lfoNewInDuration(this.module));
        divDuration.appendChild(inDuration);
        let rDuration = this.addNewComponent(lfoNewRDuration(this.module));
        divDuration.appendChild(rDuration);

        let divOthers = this.addNewDiv("div_others");
        let selectEasing = this.addNewComponent(lfoNewSelectEasing(this.module));
        divOthers.appendChild(selectEasing);
        let btnAlternate = this.addNewComponent(lfoNewBtnAlternateDirection(this.module));
        divOthers.appendChild(btnAlternate);
        let btnReverse = this.addNewComponent(lfoNewBtnReverseDirection(this.module));
        divOthers.appendChild(btnReverse);
        
        let tab = [
            divTitle,
            divDepth,
            divDuration,
            divOthers
        ];
        this.loadModulePanel(tab, domPanel);
    }
}
////////////////////////////////////////////////////////
//VISUALISERS
class VisualiserPanel extends ModulePanel {
    designation = "VisualiserPanel";
    screen;
    constructor(module, sections, domPanel) {
        super(module, sections, domPanel);
        this.screen = createScreen(this, 200, 100);
        this.module.screen = this.screen;
    }
    initModulePanel(domPanel) {
        let divTitle = roundTitleDiv(this.module);
        
        let divScreen = this.addNewDiv("div_screen");
        let screen = this.addNewComponent(monitorNewScreen(this.module));
        divScreen.appendChild(screen);

        let tab = [
            divTitle,
            divScreen
        ];

        this.loadModulePanel(tab, domPanel);
    }
}
class VisualiserPanel2 extends ModulePanel {
    designation = "VisualiserPanel2";
    screen;
    constructor(module, sections, domPanel) {
        super(module, sections, domPanel);
        this.screen = createScreen(this, 200, 100);
        this.module.screen = this.screen;
    }
    initModulePanel(domPanel) {
        let divTitle = roundTitleDiv(this.module);
        
        let divPlay = this.addNewDiv("div_play");
        let btnPlay = this.addNewComponent(visualiserNewBtnPlay(this.module));
        divPlay.appendChild(btnPlay);

        let divScreen = this.addNewDiv("div_screen");
        let screen = this.addNewComponent(moduleNewScreen(this.module));
        divScreen.appendChild(screen);

        let divMode = this.addNewDiv("div_mode");
        let toggleMode = this.addNewComponent(visualiserNewToggleMode(this.module));
        divMode.appendChild(toggleMode);

        let tab = [
            divTitle,
            divPlay,
            divScreen,
            divMode
        ];

        this.loadModulePanel(tab, domPanel);
    }
}
class OscilloscopePanel extends VisualiserPanel {
    designation = "OscilloscopePanel";
    screen;
    constructor(module, sections, domPanel) {
        super(module, sections, domPanel);
        this.screen = createScreen(this, 200, 100);
        this.module.screen = this.screen;
    }
    initModulePanel(domPanel) {
        let divTitle = roundTitleDiv(this.module);

        // let divPlay = this.addNewDiv("div_play");
        // let btnPlay = this.addNewComponent(oscilloscopeNewBtnPlay(this.module));
        // divPlay.appendChild(btnPlay);
        
        let divScreen = this.addNewDiv("div_screen");
        let screen = this.addNewComponent(monitorNewScreen(this.module));
        divScreen.appendChild(screen);

        let tab = [
            divTitle,
            // divPlay,
            divScreen
        ];

        this.loadModulePanel(tab, domPanel);
    }
}


