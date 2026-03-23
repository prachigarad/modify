'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './Relax.module.css';

const SOUNDS = [
  { id: 'rain',   label: 'Rain',   emoji: '🌧' },
  { id: 'ocean',  label: 'Ocean',  emoji: '🌊' },
  { id: 'forest', label: 'Forest', emoji: '🌲' },
  { id: 'cafe',   label: 'Cafe',   emoji: '☕' },
  { id: 'fire',   label: 'Fire',   emoji: '🔥' },
  { id: 'space',  label: 'Space',  emoji: '🌌' },
];

type BreathPhase = 'idle' | 'inhale' | 'hold' | 'exhale';

export default function Relax() {
  const [breathRunning, setBreathRunning] = useState(false);
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('idle');
  const [breathCount, setBreathCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const phaseLabels: Record<BreathPhase, string> = {
    idle: 'Ready',
    inhale: 'Inhale...',
    hold: 'Hold...',
    exhale: 'Exhale...',
  };

  const phaseDurations: Record<Exclude<BreathPhase, 'idle'>, number> = {
    inhale: 4,
    hold: 2,
    exhale: 4,
  };

  const runCycle = () => {
    const phases: Exclude<BreathPhase, 'idle'>[] = ['inhale', 'hold', 'exhale'];
    let phaseIdx = 0;
    let seconds = phaseDurations[phases[0]];

    setBreathPhase(phases[0]);
    setTimer(seconds);

    intervalRef.current = setInterval(() => {
      seconds--;
      setTimer(seconds);

      if (seconds <= 0) {
        phaseIdx = (phaseIdx + 1) % phases.length;
        if (phaseIdx === 0) setBreathCount(c => c + 1);
        seconds = phaseDurations[phases[phaseIdx]];
        setBreathPhase(phases[phaseIdx]);
        setTimer(seconds);
      }
    }, 1000);
  };

  const toggleBreath = () => {
    if (breathRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setBreathRunning(false);
      setBreathPhase('idle');
      setTimer(0);
    } else {
      setBreathRunning(true);
      setBreathCount(0);
      runCycle();
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const toggleSound = (id: string) => {
    setActiveSound(prev => prev === id ? null : id);
  };

  const ringScale = breathPhase === 'inhale' ? styles.ringInhale
    : breathPhase === 'hold' ? styles.ringHold
    : breathPhase === 'exhale' ? styles.ringExhale
    : '';

  return (
    <div className={styles.container}>
      {/* Breathing */}
      <div className={styles.breathCard}>
        <h2 className={styles.cardTitle}>Breathing exercise</h2>
        <p className={styles.cardDesc}>Follow the ring to calm your nervous system</p>

        <div className={styles.ringWrap}>
          <div className={`${styles.outerRing} ${ringScale}`}>
            <div className={styles.innerRing}>
              <span className={styles.ringLabel}>{phaseLabels[breathPhase]}</span>
              {breathRunning && timer > 0 && (
                <span className={styles.ringTimer}>{timer}s</span>
              )}
            </div>
          </div>
        </div>

        {breathCount > 0 && (
          <p className={styles.cycleCount}>
            {breathCount} {breathCount === 1 ? 'cycle' : 'cycles'} completed
          </p>
        )}

        <button
          className={breathRunning ? styles.stopBtn : 'btn-primary'}
          onClick={toggleBreath}
        >
          {breathRunning ? 'Stop' : 'Start breathing'}
        </button>
      </div>

      {/* Sounds */}
      <div className={styles.soundCard}>
        <h2 className={styles.cardTitle}>Ambient sounds</h2>
        <p className={styles.cardDesc}>
          {activeSound
            ? `Playing ${SOUNDS.find(s => s.id === activeSound)?.label} sounds`
            : 'Pick a sound to set the mood'}
        </p>
        <div className={styles.soundGrid}>
          {SOUNDS.map(s => (
            <button
              key={s.id}
              className={`${styles.soundBtn} ${activeSound === s.id ? styles.soundActive : ''}`}
              onClick={() => toggleSound(s.id)}
            >
              <span className={styles.soundEmoji}>{s.emoji}</span>
              <span className={styles.soundLabel}>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className={styles.tipsCard}>
        <h2 className={styles.cardTitle}>Quick calm tips</h2>
        <ul className={styles.tipsList}>
          <li className={styles.tip}>
            <span className={styles.tipIcon}>💧</span>
            <span>Drink a glass of water slowly</span>
          </li>
          <li className={styles.tip}>
            <span className={styles.tipIcon}>🚶</span>
            <span>Take a 5-minute walk outside</span>
          </li>
          <li className={styles.tip}>
            <span className={styles.tipIcon}>📵</span>
            <span>Put your phone face-down for 10 minutes</span>
          </li>
          <li className={styles.tip}>
            <span className={styles.tipIcon}>✍️</span>
            <span>Write 3 things you're grateful for</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
