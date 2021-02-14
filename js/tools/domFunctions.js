function defineAttributes(elt, name, objName) {
    elt.className = name;
    elt.id = name + "_" + objName;
}
function makeAsController(elt, target, param) {
    elt.addTarget = function(t, p) {
        assignTarget(elt, t, p);
    }
    if(target != undefined && param != undefined) {
        // elt.addTarget(target, param);
        elt.targetsList.push({target: target, targetedParam: param})
        assignTarget(elt, target, param);
    }
}
function assignTarget(elt, target, targetedParam, updateValue) {
    if(elt.targetsList === undefined) {
        elt.targetsList = [];
    }
    elt.targetsList.push({target: target, targetedParam: targetedParam});

    if(updateValue != false) {
        elt.value = target[targetedParam];
    }
    targetAssignControl(elt, target, targetedParam);
}

function targetAssignControl(elt, target, targetedParam) {
    if(target.controlsList === undefined) {
        target.controlsList = [];
    }
    if(target.controlsList[targetedParam] === undefined) {
        target.controlsList[targetedParam] = [];
    }
    target.controlsList[targetedParam].push(elt);  
    // console.log(target.controlsList);
}

function updateControls(value, target, targetedParam) {
    // console.log("to update: ", target.controlsList[targetedParam]);
    if(target.controlsList[targetedParam].length > 0) {
        target.controlsList[targetedParam].forEach(cntrl => {
            //up si control up != false ni undefined
            // if(cntrl.isUpdatable != false || cntrl.isUpdatable != undefined) {
            //     cntrl.value = value;
            // }
            
            //up si control up != false
            if(cntrl.isUpdatable != false) {
                // console.log("update", cntrl);
                cntrl.value = value;
            }
        });
        // cntrl.value = value;
    };
}

function defaultControlOnInput(control) {
    control.targetsList.forEach(target => {
        target.target[target.targetedParam] = parseInt(control.value);

        // if((update != undefined || update != false) && target.target.controlsList[target.targetedParam].length > 1) {
        if(target.target.controlsList[target.targetedParam].length > 1) {
            updateControls(control.value, target.target, target.targetedParam);
        }
    });
}

function defaultControlOnClick(control) {
    control.targetsList.forEach(target => {
        target.target[target.targetedParam] = control.value;

        // if((update != undefined || update != false) && target.target.controlsList[target.targetedParam].length > 1) {
        if(target.target.controlsList[target.targetedParam].length > 1) {
            updateControls(control.value, target.target, target.targetedParam);
        }
    })

}

///////////////////////////////////////////////////////////
//SEARCH / LISTS
function searchControlInControlsList(list, target) {
    list.forEach(element => {
        if(element.target === target) {
            // console.log("FIND: ", element);
            return element;
        }
    });
}

function listControls(list) {
    list.forEach(elt => {
        console.log(elt.className);
        console.log(elt, "target: ", elt.target, "param :" + elt.targetedParam);
    })
}

function listTargets(list) {

    list.forEach(elt => {
        console.log("--------------------------------------");
        // let designation = elt.target.name != undefined ?
            // elt.target.name : elt.target;
        console.log("la cible: ", elt.target, "possede un controlleur sur son parametre [", elt.targetedParam, "]:", elt);
        console.log("--------------------------------------");
    })
}
/////////////////////////////////////////////////////////
//CREATION DIV
function createDiv(name, objName) {
    let div = document.createElement("div");
    defineAttributes(div, name, objName);

    return div;
}
function createSubDiv(name) {
    let subDiv = createDiv("subDiv", name);
    return subDiv;
}
/////////////////////////////////////////////////////////
//CREATION elements
function createNumericController(module, name, target, targetedParam, min, max, step) {
    // let subDiv = createSubDiv(module.name + name);

    let control = createControlInput("number", "inNbr_" + name, module.name, target, targetedParam);
    control.min = min != undefined ? min : 0;
    control.max = max != undefined ? max : 1000;
    control.step = step != undefined ? step : 1;

    // subDiv.appendChild(control);

    return control;
}
/////////////////////////////////////////////////////////////
//INPUT
function createInput(type, name, objName) {
    let input = document.createElement("input");
    input.type = type;
    defineAttributes(input, name, objName);

    // console.log("input CREATED: ", input);
    return input;
}
/////////////////////////////////////////////////////////////
//CONTROL INPUT
function createControlInput(type, name, objName, target, targetedParam) {
    let control = document.createElement("input");
    control.type = type;
    defineAttributes(control, name, objName);
    assignTarget(control, target, targetedParam);
    
    
    control.oninput = function() {
        defaultControlOnInput(this);
        // this.target[this.targetedParam] = parseInt(this.value);

        // if(this.target[this.targetedParam].length > 1) {
            // updateControls(this.value, this.target, this.targetedParam)
        // }

        if(this.personalFunction != undefined) {
            this.personalFunction();
        }
    }
    control.value = target[targetedParam];

    return control;
}
/////////////////////////////////////////////////////////////
//COMMUTATOR O 1
function createCommutator(name, objName, startValue) {
    let btnOn = createInput("button", name, objName);
    btnOn.value = startValue || "0";

    btnOn.updateStyle = function() {
        this.style.backgroundColor = this.value === "0" ? "red" : "green";     
    }
    btnOn.personalFunctionOn = function() {
    };
    btnOn.personalFunctionOff = function() {
    };
    btnOn.commutate = function() {
        if(this.value === "0") {
            this.value = "1";
            this.personalFunctionOn();
        }
        else if(this.value === "1") {
            this.value = "0";
            this.personalFunctionOff();
        }
        this.updateStyle();
    }

    btnOn.updateStyle();

    return btnOn;
}

function createButton(name, objName, value, text) {
    let btn = document.createElement("button");
    defineAttributes(btn, name, objName);
    btn.value = value;
    btn.textContent = text;

    return btn;
}

function createControlButton(name, objName, value, text, target, targetedParam) {
    let control = document.createElement("button");
    defineAttributes(control, name, objName);
    assignTarget(control, target, targetedParam);

    control.onclick = function() {
        // this.target[targetedParam] = this.value;
        // this.targetsList.forEach(target => {
        //     target.target[target.targetedParam] = this.value;
        // })
        defaultControlOnClick(this);
      
        if(this.personalFunction != undefined) {
            this.personalFunction();
        }

        if(this.updateStyle != undefined) {
            this.updateStyle();
        }
    }

    control.value = value;
    control.textContent = text;
    control.defaultBgColor = "#221d1d";
    control.style.backgroundColor = control.value === target[targetedParam] ? "green" : control.defaultBgColor;

    return control;
}

function createToggleButton(name, objName, target, targetedParam, tabValues) {
    let toggle = [];
    // let toggleDiv = createDiv(name, objName);
    // assignTarget(toggleDiv, target, targetedParam);
    // toggle.name = name + "_" + objName;

    tabValues.forEach(element => {
        let controlBtn = createControlButton(name, element.value, element.value, element.text, target, targetedParam);
        controlBtn.isUpdatable = false;


        controlBtn.updateStyle = function() {
            toggle.forEach(btn => {
                btn.style.backgroundColor = btn.value === target[targetedParam] ? "green" : btn.defaultBgColor;
            })
        }

        // toggleDiv.appendChild(controlBtn);
        toggle.push(controlBtn);
    })
    // toggleDiv.toggle = toggle;

    return toggle;
}

function createControlSelect(name, objName, target, targetedParam, tabOptions) {
    let select = document.createElement("select");
    defineAttributes(select, name, objName);
    assignTarget(select, target, targetedParam);

    tabOptions.forEach(e => {
        let option = document.createElement("option");
        option.className = "option_" + objName;
        option.id = e.value;
        option.value = e.value;
        option.textContent = e.text;
        select.appendChild(option);
    });

    select.oninput = function() {
        defaultControlOnInput(this);

        if(this.personalFunction != undefined) {
            this.personalFunction();
        }

        console.log(this.value, this.targetsList);
    }

    return select;
}

function createSelectElement(name, parentName, tab) {
    let select = document.createElement("select");
    select.className = name;
    select.id = name + "_" + parentName;

    tab.forEach(entry => {
        let option = document.createElement("option");
        option.value = entry.value;
        option.textContent = entry.text;
        select.appendChild(option);
    });

    return select;
}

function createControlRange(module, name, target, targetedParam, min, max, step) {
    let range = document.createElement("input");
    range.type = "range";
    range.className = name;
    range.id = name + "_" + module.name;
    assignTarget(range, target, targetedParam);
    // range.list = "tickmarks";
    range.oninput = function() {
        defaultControlOnInput(range);
        if(range.personalFunction != undefined) {
            range.personalFunction();
        }
        console.log(range.value, range.targetsList);
    }
    range.value = target[targetedParam];
    range.min = min;
    range.max = max;
    range.step = step;

    return range;
}

function createLabelSpanForRange(name, parentName) {
    let labelSpan = document.createElement("span");
    labelSpan.className = name;
    labelSpan.id = name + "_" + parentName;

    return labelSpan;
}

function createCanvas(name, objName, width, height) {
    let canvas = document.createElement("canvas");
    canvas.name = name;
    canvas.id = name + "_" + objName;
    canvas.width = width;
    canvas.height = height;

    return canvas;
}

// export * from 'domFunctions.js';
