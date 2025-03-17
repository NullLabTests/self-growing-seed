
// Define audio context
let audioContext: AudioContext | null = null;

// Initialize audio context on first user interaction
export const initAudio = () => {
  if (audioContext === null) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Create oscillator sound
const createOscillator = (
  freq: number,
  type: OscillatorType,
  duration: number,
  volumeStart = 0.2,
  volumeEnd = 0.0,
  delay = 0
): void => {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + delay);
  
  gainNode.gain.setValueAtTime(volumeStart, audioContext.currentTime + delay);
  gainNode.gain.exponentialRampToValueAtTime(volumeEnd, audioContext.currentTime + delay + duration);
  
  oscillator.start(audioContext.currentTime + delay);
  oscillator.stop(audioContext.currentTime + delay + duration);
};

// Node activation sound
export const playNodeActivationSound = () => {
  const ctx = initAudio();
  createOscillator(440, 'sine', 0.2, 0.15, 0.001);
  createOscillator(880, 'sine', 0.1, 0.05, 0.001, 0.05);
};

// Node growth sound
export const playNodeGrowthSound = () => {
  const ctx = initAudio();
  createOscillator(220, 'sine', 0.3, 0.1, 0.001);
  createOscillator(330, 'sine', 0.2, 0.05, 0.001, 0.1);
};

// Evolution sound
export const playEvolutionSound = () => {
  const ctx = initAudio();
  
  // Chord progression
  createOscillator(330, 'sine', 0.5, 0.1, 0.001);
  createOscillator(392, 'sine', 0.5, 0.1, 0.001, 0.1);
  createOscillator(440, 'sine', 0.5, 0.1, 0.001, 0.2);
  createOscillator(523, 'sine', 0.7, 0.1, 0.001, 0.3);
};

// UI interaction sound
export const playClickSound = () => {
  const ctx = initAudio();
  createOscillator(660, 'sine', 0.1, 0.1, 0.001);
};

// Error sound
export const playErrorSound = () => {
  const ctx = initAudio();
  createOscillator(220, 'sawtooth', 0.2, 0.2, 0.001);
  createOscillator(110, 'sawtooth', 0.3, 0.2, 0.001, 0.1);
};
