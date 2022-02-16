const rangeInput = document.querySelectorAll(".range");
const button = document.getElementById("btn");


const audioCtx = new (window.AudioContext || window.webkitAudioContext);

// Create oscillator1
const oscillator = audioCtx.createOscillator();
oscillator.type = 'sine';
// Create oscillator2
const oscillator2 = audioCtx.createOscillator();
oscillator2.type = 'triangle';
// Create lfo
const lfo = audioCtx.createOscillator();
// Creatte gain modulation
const modulationGain = audioCtx.createGain();
// Create Filter
const filter = audioCtx.createBiquadFilter();
filter.type = "lowpass";
// Create distortion
const waveshaping = audioCtx.createWaveShaper();
// Create Amp gain
var ampGain = audioCtx.createGain();
ampGain.gain.value = 0.20;


lfo.connect(modulationGain);

modulationGain.connect(oscillator.detune);
modulationGain.connect(oscillator2.detune);

oscillator.connect(filter);
oscillator2.connect(filter);

filter.connect(waveshaping);
waveshaping.connect(ampGain);
ampGain.connect(audioCtx.destination);


rangeInput.forEach(function(element) {
    element.addEventListener('input', () => {
        element.setAttribute('value', element.value);        
        console.log(element)
        if (element.id === 'osc') {
            oscillator.frequency.value = element.value * 5;
        }
        if (element.id === 'osc2') {
            oscillator2.frequency.value = element.value * 5;
        }
        if (element.id === 'lfo') {
            lfo.frequency.value = element.value / 2;
        }
        if (element.id === 'mod') {
            modulationGain.gain.value = element.value * 5;
        }
        if (element.id === 'filter') {
            filter.frequency.value = element.value * 5;
        }
        if (element.id === 'gfilter') {
            filter.Q.value = element.value / 60;
        }
        if (element.id === 'disto') {
            waveshaping.curve = makeDistortionCurve(element.value / 5);
        }
    })}
)

button.addEventListener('click', () => {
    if(button.value === "off") {
        oscillator.start(0);
        oscillator2.start(0);
        lfo.start(0);
        button.setAttribute('value', 'on');
    }
})

function makeDistortionCurve( amount ) {
    console.log(amount);
    var k = typeof amount === 'number' ? amount : 50,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        i = 0,
        x;

    for ( ; i < n_samples; ++i ) {
        x = i * 2 / n_samples - 1;
        curve[i] = ( Math.PI + k ) * x * (1/6) / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
}