/////////////////////////////////////////////////////
//
function tabOscAndGainParams(osc, gain) {
    let tabOsc = [
        ["frequency", osc.frequency, "value"],
        ["type", osc, "type"],
        ["detune", osc.detune, "value"],
    ];
    let tabGain = [
        ["gain", gain.gain, "value"],
    ];
    let tabFilter = [
        ["type", filter, "type"],
        ["frequency", filter.frequency, "value"],
        ["Q", filter.Q, "value"]
    ];
    let tabLfo = [
        ["depth", lfo, "depth"],
        ["duration", lfo, "duration"],
    ];
    
}
//ANIMS
//module = lfo
function initAnimProps1(module) {
    let animProps = [];
    animProps["targets"] = module.target;
    animProps["value"] = [parseInt(module.in.value) , parseInt(module.in.value) + module.depth];
    animProps["duration"] = module.duration;
    animProps["loop"] = true;
    animProps["autoplay"] = false;
    animProps["easing"] = module.easings[module.eIndex];
    animProps["update"] = function() {
        drawTimeAndY(module.monitor, module.target[module.param]);

        module.anim.animations[0].tweens[0].from.numbers[0] = parseInt(module.in.value);

        module.anim.animations[0].tweens[0].to.numbers[0] = parseInt(module.in.value) + module.depth;
        module.anim.duration = module.duration;

        module.timeCounter.value ++;
        if(module.timeCounter.value === module.duration) {
            module.timeCounter.value = 0;
            module.monitor.drawScreen();
        }
    }
    return animProps;
}
function loadAnim(animProps) {
    let anim = anime({
        targets: animProps["targets"],
        value: animProps["value"],
        duration: animProps["duration"],
        loop: animProps["loop"],
        autoplay: animProps["autoplay"],
        easing = animProps["easing"],
        update: animProps["update"],
    })

    return anim;
}