
import { useCallback, useRef, useState, useEffect, useMemo } from 'react';

export const useSound = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  
  // Scheduler Refs
  const nextNoteTimeRef = useRef<number>(0);
  const timerIDRef = useRef<number | null>(null);
  const currentStepRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  
  // Use State for UI, Ref for Audio Loop
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
      isMutedRef.current = isMuted;
      if (audioCtxRef.current && masterGainRef.current) {
        const ctx = audioCtxRef.current;
        const now = ctx.currentTime;
        // Smooth fade to prevent popping
        if (isMuted) {
            masterGainRef.current.gain.setTargetAtTime(0, now, 0.5);
        } else {
            masterGainRef.current.gain.setTargetAtTime(0.4, now, 0.5);
        }
      }
  }, [isMuted]);

  // Initialize Audio Context
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
      
      // Master Volume - slightly louder for the bass to be felt
      masterGainRef.current = audioCtxRef.current.createGain();
      masterGainRef.current.gain.value = 0.4; 
      masterGainRef.current.connect(audioCtxRef.current.destination);
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  // --- SOOTHING SYNTH VOICES ---

  // 1. Soft Kick (Heartbeat)
  const playSoftKick = (time: number) => {
      if (!audioCtxRef.current || !masterGainRef.current) return;
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.frequency.setValueAtTime(100, time);
      osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
      
      gain.gain.setValueAtTime(0.8, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

      osc.connect(gain);
      gain.connect(masterGainRef.current);
      osc.start(time);
      osc.stop(time + 0.5);
  };

  // 2. Deep Bass (The "Doom Doom" - Warm and Round)
  const playDeepBass = (freq: number, time: number, dur: number) => {
      if (!audioCtxRef.current || !masterGainRef.current) return;
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth'; // Sawtooth has rich harmonics
      osc.frequency.setValueAtTime(freq, time);

      // Aggressive Lowpass Filter to remove buzziness, keeping only deep warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, time); 
      filter.Q.value = 1;

      // Soft attack, long release
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.4, time + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGainRef.current);
      osc.start(time);
      osc.stop(time + dur + 0.5);
  }

  // 3. Ethereal Pad (Background Atmosphere)
  const playPad = (freq: number, time: number, dur: number) => {
      if (!audioCtxRef.current || !masterGainRef.current) return;
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      
      // Very soft, barely there
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.05, time + 1);
      gain.gain.linearRampToValueAtTime(0, time + dur);

      osc.connect(gain);
      gain.connect(masterGainRef.current);
      osc.start(time);
      osc.stop(time + dur);
  }

  // --- SCHEDULER ---
  
  const scheduleNote = (step: number, time: number) => {
      // 1. The Heartbeat (Kick) - Every beat
      if (step % 4 === 0) playSoftKick(time);

      // 2. The Groove (Bass) - Offbeat driving rhythm
      // Root notes: C2 (65.41), Eb2 (77.78), F2 (87.31)
      const root = 65.41; 
      
      // Pattern: Doom... Doom... Doom...
      if (step % 2 === 0) {
          playDeepBass(root, time, 0.4);
      }
      
      // Occasional variation
      if (step === 14) {
          playDeepBass(77.78, time, 0.4); // Eb
      }

      // 3. The Atmosphere (Pad) - Long chords every bar
      if (step === 0) {
          playPad(130.81, time, 4); // C3
          playPad(196.00, time, 4); // G3
      }
      if (step === 8) {
          playPad(155.56, time, 4); // Eb3
      }
  };

  const nextNote = () => {
      const bpm = 90; // Slower, more relaxed BPM
      const secondsPerBeat = 60.0 / bpm;
      const stepTime = secondsPerBeat / 4; // 16th notes
      nextNoteTimeRef.current += stepTime;
      currentStepRef.current = (currentStepRef.current + 1) % 16;
  }

  const scheduler = useCallback(() => {
      const scheduleAheadTime = 0.1; 
      
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;

      while (nextNoteTimeRef.current < ctx.currentTime + scheduleAheadTime) {
          scheduleNote(currentStepRef.current, nextNoteTimeRef.current);
          nextNote();
      }
      
      timerIDRef.current = window.setTimeout(scheduler, 25);
  }, []);

  const startMusic = useCallback(() => {
    if (isPlayingRef.current) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    isPlayingRef.current = true;
    nextNoteTimeRef.current = ctx.currentTime + 0.1;
    scheduler();
  }, [initAudio, scheduler]);
  
  const stopMusic = useCallback(() => {
      isPlayingRef.current = false;
      if (timerIDRef.current) {
          window.clearTimeout(timerIDRef.current);
          timerIDRef.current = null;
      }
  }, []);

  // --- FX HELPER (UI Sounds) ---
  const playSfx = useCallback((freq: number, type: OscillatorType, dur: number, vol = 0.2) => {
      if(audioCtxRef.current) {
          const ctx = audioCtxRef.current;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(vol, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dur);
          osc.connect(gain);
          gain.connect(masterGainRef.current!);
          osc.start();
          osc.stop(ctx.currentTime + dur + 0.1);
      }
  }, []);

  const playStep = useCallback(() => playSfx(100 + Math.random()*20, 'triangle', 0.05, 0.05), [playSfx]);
  
  const playCommandSuccess = useCallback(() => {
    playSfx(440, 'sine', 0.1, 0.2);
    setTimeout(() => playSfx(660, 'sine', 0.1, 0.2), 100);
  }, [playSfx]);

  const playCommandError = useCallback(() => {
    playSfx(150, 'sawtooth', 0.15, 0.2);
    setTimeout(() => playSfx(100, 'sawtooth', 0.15, 0.2), 100);
  }, [playSfx]);

  const playObjectiveComplete = useCallback(() => {
    playSfx(523.25, 'triangle', 0.1, 0.2); 
    setTimeout(() => playSfx(783.99, 'triangle', 0.3, 0.2), 150);
  }, [playSfx]);

  const playWin = useCallback(() => {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        setTimeout(() => playSfx(freq, 'square', 0.3, 0.1), i * 150);
    });
  }, [playSfx]);

  const playBranch = useCallback(() => playSfx(300, 'sine', 0.3, 0.2), [playSfx]);
  const playCommit = useCallback(() => playSfx(200, 'square', 0.05, 0.1), [playSfx]);
  const playMerge = useCallback(() => {
      playSfx(440, 'sine', 0.2, 0.2);
      setTimeout(() => playSfx(659, 'sine', 0.4, 0.2), 150);
  }, [playSfx]);
  const playRevert = useCallback(() => playSfx(800, 'sawtooth', 0.3, 0.1), [playSfx]);

  const toggleMute = useCallback(() => setIsMuted(p => !p), []);

  return useMemo(() => ({
    playStep, playCommandSuccess, playCommandError, playObjectiveComplete,
    playWin, playBranch, playCommit, playMerge, playRevert,
    playMusic: startMusic, stopMusic,
    isMuted, toggleMute
  }), [isMuted, toggleMute]);
};
