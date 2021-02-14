// function makeAsMouseReactif(elt, options) {
//     // if(options.includes("bgColor")) {
//     //     styleChange(elt, "backgroundColor");
//     // }
//     if(options.includes("popup")) {
//         displayPopup(elt);
//     }
// }
function makeAsPopable(elt, content) {
    elt.addEventListener("mouseenter", (e) => {
        popup.textContent = elt.popupContent;
        // popup.textContent = elt.popupContent != undefined ? elt.popupContent : describe(elt, "object");
        // popup.textContent = content != undefined ? content : elt.popupContent;

        popup.style.left = e.offsetX + "px";
        popup.style.top = e.offsetY + "px";
        popup.style.display = "block";
    });
    elt.addEventListener("mousemove", (e) => {
        popup.style.left = e.offsetX + "px";
        popup.style.top = e.offsetY + "px";
    })
    elt.addEventListener("mouseleave", (e) => {
        popup.style.display = "none";
    });
}
// function displayPopup(elt) {
//     elt.addEventListener("mouseenter", (e) => {
//         popup.textContent = elt.popupContent;

//         popup.style.left = e.offsetX + "px";
//         popup.style.top = e.offsetY + "px";
//         popup.style.display = "block";
//     });
//     elt.addEventListener("mousemove", (e) => {
//         popup.style.left = e.offsetX + "px";
//         popup.style.top = e.offsetY + "px";
//     })
//     elt.addEventListener("mouseleave", (e) => {
//         popup.style.display = "none";
//     });
// }
// function styleChange(elt, attribut, value) {
//     let val = value != undefined ? value : "#4d2828";
//     if(elt.compStyle === undefined) {
//         elt.compStyle = getComputedStyle(elt);
//     }
//     let s = elt.compStyle;
//     elt[attribut] = s[attribut];

//     elt.addEventListener("mouseenter", (e) => {
//         e.target.style[attribut] = val;
//     });

//     elt.addEventListener("mouseleave", (e) => {
//         e.target.style[attribut] = e.target[attribut];
//     });
// }
// function colorChange(elt) {
//     if(elt.compStyle === undefined) {
//         elt.compStyle = getComputedStyle(elt);
//     }
//     let s = elt.compStyle;

//     elt.defaultBgColor = s.backgroundColor;

//     elt.addEventListener("mouseenter", (e) => {
//         e.target.style.backgroundColor = "#4d2828";
//     });

//     elt.addEventListener("mouseleave", (e) => {
//         e.target.style.backgroundColor = e.target.defaultBgColor;
//     });
// }

///////////////////////////////////////
function makeAsController2(obj) {
    obj.isController = true;
    obj.controlOutputs = [];

    obj.addControlOutput = function(target, param) {
        let list = this.controlOutputs.slice();
        // console.log("target is controllable ?", target.isControllable);
        if(!target.isControllable) {
            makeAsControllable(target);
            // console.log("set", target.isControllable);
        }
        target.addControlInput(obj, param);
        list.push({target: target, targetedParam: param});
        this.controlOutputs = list;
    }
    obj.defaultControlFunction = function(value) {
        let v = value != undefined ? value : this.value;
        // console.log("default control function, set value", v, "to", this.target);

        this.controlOutputs.forEach(output => {
            output.target[output.targetedParam] = v;
            // output.target.updateControlInputs(output.targetedParam);
            console.log("default control function, set value", v, "to", output);
        });
        if(this.personalFunction != undefined) {
            console.log("PERSONAL FUNC");
            this.personalFunction();
        }
    }
    obj.searchOutput = function(search, key) {
        console.log("SEARCH", search, key, "in", this.controlOutputs);
        this.controlOutputs.forEach(e => {
            // console.log("E", e, e[key]);
            if(e[key] == search) {
                console.log("FIND", e);
                return e;
            }
        })
    }

    obj.describe = function(filter) {
        describe(this, filter)
    }
}

////////////////////////////////////////////////////////
function makeAsControllable(obj) {
    obj.isControllable = true;
    obj.controllablesParams = [];
    obj.controlInputs = [];

    obj.addControllableParam = function(param) {
        let list = this.controllablesParams.slice();
        if(!list.includes(param)) {
            list.push(param);
        }
        // list[param] = [];
        this.controllablesParams = list;
    }
    
    obj.addControlInput = function(control, param) {
        obj.addControllableParam(param);
        let list = this.controlInputs.slice();
        list.push({control: control, targetedParam: param});
        this.controlInputs = list;
    };

    obj.searchParam = function(search, key) {
        console.log("SEARCH", search, key, "in", this.controllablesParams);
        this.controllablesParams.forEach(e => {
            // console.log("E", e, e[key]);
            if(e[key] == search) {
                console.log("FIND", e, this.controllablesParams.indexOf(e));
                // return e;
                return this.controllablesParams.indexOf(e);
            }
        })
    }
    // obj.updateControlInputs = function(param) {
    //     let list = this.controlInputs.slice();
    //     console.log(list);
    //     list.forEach(e => {
    //         if(e.control.isUpdatableViaTarget) {
    //             // console.log("update inputs not implemented");
    //             if(e.targetedParam === param)
    //             console.log("will update", e.control, e.targetedParam, "to", this[param]);
    //             //e.control.value = obj.value;
    //         }
    //     })
    // };

    obj.describe = function(filter) {
        describe(this, filter)
    }
}
////////////////////////////////////////////////////////

////////////////////////////////////////////////////////
function describe(obj, filter) {
    let str = "";
    console.log("----------------------------");
    console.log("DESCRIBE:");
    for(var i in obj) {
        if(obj.hasOwnProperty(i)) {
            if(typeof obj[i] != filter) {
                str +="\n"+ i + ": "+ obj[i];
                console.log(i + ": ", obj[i]);
            }
            // if(typeof obj[i] != )
            // console.log(i + ": ", obj[i]);
        }
    }
    console.log("----------------------------");
    return str;
}
///////////////////////////////////////
// function makeInputAsController(input) {
//     input.controlOutputs = [];

//     input.addTarget = function(target, param) {
//         let list = this.controlOutputs.slice();
//         list.push({target: target, targeted: param});
//         this.controlOutputs = list;
//     }

//     input.defaultControlFunction = function() {
//         this.controlOutputs.forEach(element => {
//             element.target[element.targetedParams] = this.value;
//         });
//     }
// }