////////////////////////////////////////////
function loadScript(src) {
    return new Promise(function(resolve, reject) {
        let script = document.createElement("script");
        script.src = src;

        document.head.append(script);
        // console.log("-----> script " + src + " chargé");

        script.onload = () => resolve("script " + src + " chargé");
        script.onerror = () => reject(new Error("Echec du chargement du script " + src))
    });
}

loadScript("js/tools/interfaces.js")
.then(stockVar => loadScript("js/tools/stockVar.js", stockVar))
.then(domFunctions => loadScript("js/tools/domFunctions.js", domFunctions))

.then(anime => loadScript("js/tools/anime.min.js", anime))
.then(components => loadScript("js/synthParts/components.js", components))
.then(ModulePanel => loadScript("js/synthParts/ModulePanel.js", ModulePanel))
.then(Module => loadScript("js/synthParts/Modules.js", Module))
.then(Synth => loadScript("js/synthParts/Synth.js", Synth))
.then(oscilloscope => loadScript("js/TESTS/oscilloscope.js", oscilloscope))
.then(main => loadScript("js/scripts/main.js", main))
.catch(alert);