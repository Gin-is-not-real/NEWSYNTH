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
.then(test2 => loadScript("js/TESTS/test2.js", test2))
.then(anime => loadScript("js/tools/anime.min.js", anime))
.then(synth => loadScript("js/synthParts/Synth.js", synth))
.then(modules => loadScript("js/synthParts/Modules.js", modules))
.then(modulePanel => loadScript("js/synthParts/ModulePanel.js", modulePanel))
.then(domFunctions => loadScript("js/tools/domFunctions.js", domFunctions))
.then(components => loadScript("js/synthParts/components.js", components))
.then(scripts => loadScript("js/scripts/main.js", scripts))
.then(tests => loadScript("js/TESTS/tests.js", tests))
.catch(alert);