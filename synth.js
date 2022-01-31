
window.addEventListener('load', () => {
  setupRoutingGraph();
})

function setupRoutingGraph() {  const context = new AudioContext();  
  
  // Create the low frequency oscillator that supplies the modulation signal  
  const lfo = context.createOscillator();  
  lfo.frequency.value = 1.0;  
  
  // Create the high frequency oscillator to be modulated  
  const hfo = context.createOscillator();
  hfo.type = 'sine';  
  hfo.frequency.value = 200.0;  
  
  // Create a gain node whose gain determines the amplitude of the modulation signal  
  const modulationGain = context.createGain();  
  modulationGain.gain.value = 100;
  
  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 300;
  filter.gain.value = 100;

  const waveshaping = context.createWaveShaper();
  waveshaping.curve = makeDistortionCurve(1000);

  
  // Configure the graph and start the oscillators  
  lfo.connect(modulationGain);
  modulationGain.connect(hfo.detune);


  hfo.connect(filter);;
  //filter.connect(context.destination);

  filter.connect(waveshaping);

  waveshaping.connect(context.destination);

  hfo.start(0);  
  lfo.start(0);



  function makeDistortionCurve( amount ) {
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
}