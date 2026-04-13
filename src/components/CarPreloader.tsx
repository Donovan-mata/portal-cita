import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CarPreloader: React.FC = () => {
  const [loadingText, setLoadingText] = useState('Iniciando sistema...');
  const [rpm, setRpm] = useState(800);
  const [kmh, setKmh] = useState(0);
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const statusMessages = [
    { code: 'SYS-001', msg: 'Autenticando vehículo...' },
    { code: 'ENV-042', msg: 'Verificando emisiones...' },
    { code: 'SEN-019', msg: 'Calibrando sensores OBD...' },
    { code: 'NET-007', msg: 'Conectando con CDMX...' },
    { code: 'OK-200',  msg: 'Sistema listo.' },
  ];

  useEffect(() => {
    // Cycle status messages
    const si = setInterval(() => {
      setStatusIndex(i => (i + 1) % statusMessages.length);
    }, 1500);

    // RPM fluctuation animation
    let rpmBase = 800;
    const ri = setInterval(() => {
      rpmBase = Math.min(rpmBase + Math.random() * 60 - 10, 4500);
      setRpm(Math.round(rpmBase / 10) * 10);
    }, 80);

    // Speed counter
    let spd = 0;
    const ki = setInterval(() => {
      spd = Math.min(spd + 2, 120);
      setKmh(spd);
    }, 60);

    // Progress bar
    let prog = 0;
    const pi = setInterval(() => {
      prog = Math.min(prog + 1, 100);
      setProgress(prog);
    }, 80);

    return () => { clearInterval(si); clearInterval(ri); clearInterval(ki); clearInterval(pi); };
  }, []);

  const current = statusMessages[statusIndex];
  const rpmPercent = Math.min((rpm / 6000) * 100, 100);

  return (
    <div className="loader-root">
      {/* ── Background grid ─────────────────────────── */}
      <div className="grid-bg" />

      {/* ── Ambient bloom ───────────────────────────── */}
      <div className="bloom bloom-red" />
      <div className="bloom bloom-orange" />

      {/* ── HUD Corner brackets ─────────────────────── */}
      <div className="bracket bracket-tl" />
      <div className="bracket bracket-tr" />
      <div className="bracket bracket-bl" />
      <div className="bracket bracket-br" />

      {/* ── Top HUD bar ─────────────────────────────── */}
      <div className="hud-top">
        <span className="hud-label">VERIFICDMX</span>
        <span className="hud-sep">◆</span>
        <span className="hud-value">SISTEMA VEHICULAR v2.4</span>
        <span className="hud-spacer" />
        <span className="hud-label">ID SESIÓN</span>
        <span className="hud-value hud-blink">◉ {current.code}</span>
      </div>

      {/* ══════════════════════════════════════════════
              MAIN SCENE
         ══════════════════════════════════════════════ */}
      <div className="scene">

        {/* ── Left HUD panel ──────────────────────── */}
        <div className="side-panel side-panel--left">
          <div className="gauge-label">VEL.</div>
          <div className="gauge-value">{kmh}<span className="gauge-unit">km/h</span></div>
          <div className="gauge-bar-track">
            <div className="gauge-bar-fill" style={{ height: `${(kmh / 120) * 100}%` }} />
          </div>
          <div className="gauge-label mt-auto">RPM</div>
          <div className="gauge-value gauge-value--sm">{rpm.toLocaleString()}</div>
        </div>

        {/* ── Car + Road SVG ──────────────────────── */}
        <div className="car-wrapper">
          <svg
            viewBox="0 0 520 195"
            className="car-svg"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Car body gradient */}
              <linearGradient id="bodyFill" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7f1d1d" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#dc2626" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#7c2d12" stopOpacity="0.6" />
              </linearGradient>

              {/* Outline stroke gradient */}
              <linearGradient id="outlineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="60%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>

              {/* Headlight beam */}
              <linearGradient id="beamGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </linearGradient>

              {/* Wheel gradient */}
              <radialGradient id="wheelHub" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.6" />
              </radialGradient>

              {/* Window glass */}
              <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.04" />
              </linearGradient>

              {/* Ground road gradient */}
              <linearGradient id="roadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#27272a" />
                <stop offset="100%" stopColor="#18181b" />
              </linearGradient>

              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="glowStrong" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* ═══════════ ROAD ═══════════ */}
            <rect x="0" y="165" width="520" height="30" fill="url(#roadGrad)" />
            {/* Road top edge glow */}
            <line x1="0" y1="165" x2="520" y2="165" stroke="#ef4444" strokeWidth="0.5" strokeOpacity="0.3" />

            {/* Animated lane dashes */}
            <g className="road-dashes">
              {[0,1,2,3,4,5,6].map(i => (
                <rect key={i} x={i * 80 + 30} y="177" width="45" height="3" rx="1.5" fill="rgba(255,255,255,0.12)" />
              ))}
            </g>

            {/* ═══════════ HEADLIGHT BEAM ═══════════ */}
            <polygon
              points="430,130  520,90  520,175  430,155"
              fill="url(#beamGrad)"
              className="headlight-beam"
            />

            {/* ═══════════ CAR SILHOUETTE ═══════════ */}
            {/* Main body fill */}
            <path
              d="
                M 62 162
                Q 54 162 52 154
                L 52 142
                L 65 118
                L 82 104
                L 108 98
                L 134 66
                L 220 57
                L 330 57
                L 358 68
                L 395 104
                L 430 106
                L 452 116
                L 460 142
                Q 460 155 452 162
                L 52 162 Z
              "
              fill="url(#bodyFill)"
            />

            {/* === Body outline (top/visible edges) === */}
            {/* Roof */}
            <path
              d="M 134 66 L 220 57 L 330 57 L 358 68"
              stroke="url(#outlineGrad)" strokeWidth="2.5" strokeLinecap="round"
            />
            {/* Rear pillar (C-pillar) */}
            <path
              d="M 108 98 L 134 66"
              stroke="url(#outlineGrad)" strokeWidth="2.5" strokeLinecap="round"
            />
            {/* Rear trunk / boot top */}
            <path
              d="M 65 118 L 82 104 L 108 98"
              stroke="url(#outlineGrad)" strokeWidth="2.5" strokeLinecap="round"
            />
            {/* A-pillar + windshield */}
            <path
              d="M 358 68 L 395 104"
              stroke="url(#outlineGrad)" strokeWidth="2.5" strokeLinecap="round"
            />
            {/* Hood */}
            <path
              d="M 395 104 L 430 106 L 452 116 L 460 142"
              stroke="url(#outlineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            />
            {/* Rocker / bottom chassis */}
            <path
              d="M 52 142 L 52 162"
              stroke="url(#outlineGrad)" strokeWidth="2.5" strokeLinecap="round"
            />
            <path
              d="M 460 142 Q 460 155 452 162"
              stroke="url(#outlineGrad)" strokeWidth="2.5" strokeLinecap="round"
            />
            {/* Rear bumper top */}
            <path
              d="M 52 154 L 65 118"
              stroke="url(#outlineGrad)" strokeWidth="2" strokeLinecap="round"
            />

            {/* === Windows === */}
            {/* Rear quarter window (small) */}
            <path
              d="M 112 100 L 128 68 L 142 65 L 140 98 Z"
              fill="url(#glassGrad)"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
            {/* Main side window */}
            <path
              d="M 145 98 L 148 63 L 300 60 L 312 98 Z"
              fill="url(#glassGrad)"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
            {/* Front quarter window */}
            <path
              d="M 316 98 L 326 60 L 348 68 L 355 98 Z"
              fill="url(#glassGrad)"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
            {/* Window reflections */}
            <line x1="160" y1="63" x2="150" y2="97" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />

            {/* === Door line === */}
            <line x1="230" y1="98" x2="228" y2="62" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,3" />

            {/* === Door handles === */}
            <rect x="180" y="124" width="20" height="5" rx="2.5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <rect x="280" y="124" width="20" height="5" rx="2.5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

            {/* === Side mirror === */}
            <path
              d="M 365 96 L 385 90 L 390 98 L 368 102 Z"
              fill="rgba(220,38,38,0.5)"
              stroke="url(#outlineGrad)"
              strokeWidth="1"
            />

            {/* === Headlights === */}
            {/* Main headlight unit */}
            <rect x="448" y="122" width="14" height="10" rx="2"
              fill="#fbbf24" filter="url(#glowStrong)" className="hl-pulse" />
            {/* DRL strip */}
            <rect x="442" y="120" width="18" height="2" rx="1"
              fill="white" opacity="0.6" filter="url(#glow)" />

            {/* === Tail lights === */}
            <rect x="51" y="126" width="8" height="14" rx="2"
              fill="#dc2626" filter="url(#glow)" className="tl-pulse" />
            {/* Tail light strip */}
            <rect x="51" y="124" width="2" height="22" rx="1"
              fill="#ef4444" opacity="0.8" />

            {/* === Wheel arches (drawn over body) === */}
            {/* Rear arch */}
            <path d="M 78 162 A 38 38 0 0 1 156 162"
              stroke="url(#outlineGrad)" strokeWidth="1.5" fill="rgba(0,0,0,0.6)" />
            {/* Front arch */}
            <path d="M 351 162 A 38 38 0 0 1 429 162"
              stroke="url(#outlineGrad)" strokeWidth="1.5" fill="rgba(0,0,0,0.6)" />

            {/* === EXHAUST PIPE === */}
            <rect x="52" y="157" width="14" height="5" rx="2.5"
              fill="#52525b" stroke="#3f3f46" strokeWidth="1" />

            {/* === Exhaust smoke (animated) === */}
            <g className="exhaust-group">
              <circle cx="42" cy="157" r="4"  fill="rgba(200,200,200,0.18)" className="smoke s1" />
              <circle cx="32" cy="152" r="6"  fill="rgba(200,200,200,0.12)" className="smoke s2" />
              <circle cx="20" cy="146" r="8"  fill="rgba(200,200,200,0.08)" className="smoke s3" />
              <circle cx="8"  cy="140" r="10" fill="rgba(200,200,200,0.05)" className="smoke s4" />
            </g>

            {/* ═══════════ REAR WHEEL ═══════════ */}
            <g style={{ transformOrigin: '117px 162px' }} className="wheel-spin">
              {/* Tire shadow */}
              <circle cx="117" cy="162" r="33" fill="rgba(0,0,0,0.5)" />
              {/* Tire */}
              <circle cx="117" cy="162" r="32" fill="#1c1c1e" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
              {/* Rim outer ring */}
              <circle cx="117" cy="162" r="26" stroke="url(#outlineGrad)" strokeWidth="2" fill="none" strokeDasharray="8 5" />
              {/* Rim inner */}
              <circle cx="117" cy="162" r="18" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
              {/* Spokes */}
              {[0,45,90,135].map(angle => {
                const rad = (angle * Math.PI) / 180;
                return (
                  <line key={angle}
                    x1={117 + Math.cos(rad)*18} y1={162 + Math.sin(rad)*18}
                    x2={117 + Math.cos(rad)*26} y2={162 + Math.sin(rad)*26}
                    stroke="url(#outlineGrad)" strokeWidth="2.5" strokeLinecap="round"
                  />
                );
              })}
              {/* Hub */}
              <circle cx="117" cy="162" r="6" fill="url(#wheelHub)" filter="url(#glow)" />
              <circle cx="117" cy="162" r="2.5" fill="white" opacity="0.9" />
            </g>

            {/* ═══════════ FRONT WHEEL ═══════════ */}
            <g style={{ transformOrigin: '390px 162px' }} className="wheel-spin">
              {/* Tire shadow */}
              <circle cx="390" cy="162" r="33" fill="rgba(0,0,0,0.5)" />
              {/* Tire */}
              <circle cx="390" cy="162" r="32" fill="#1c1c1e" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
              {/* Rim outer ring */}
              <circle cx="390" cy="162" r="26" stroke="url(#outlineGrad)" strokeWidth="2" fill="none" strokeDasharray="8 5" />
              {/* Rim inner */}
              <circle cx="390" cy="162" r="18" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
              {/* Spokes */}
              {[0,45,90,135].map(angle => {
                const rad = (angle * Math.PI) / 180;
                return (
                  <line key={angle}
                    x1={390 + Math.cos(rad)*18} y1={162 + Math.sin(rad)*18}
                    x2={390 + Math.cos(rad)*26} y2={162 + Math.sin(rad)*26}
                    stroke="url(#outlineGrad)" strokeWidth="2.5" strokeLinecap="round"
                  />
                );
              })}
              {/* Hub */}
              <circle cx="390" cy="162" r="6" fill="url(#wheelHub)" filter="url(#glow)" />
              <circle cx="390" cy="162" r="2.5" fill="white" opacity="0.9" />
            </g>

            {/* ═══════════ HUD SCAN SWEEP ═══════════ */}
            <rect x="52" y="57" width="4" height="110"
              fill="url(#beamGrad)"
              className="scan-sweep"
              opacity="0.4"
            />

          </svg>

          {/* Embedded CSS animations */}
          <style>{`
            /* ── Wheel spin ── */
            .wheel-spin { animation: wheelSpin 0.85s linear infinite; }
            @keyframes wheelSpin {
              from { transform: rotate(0deg); }
              to   { transform: rotate(360deg); }
            }

            /* ── Car body bob ── */
            .car-body-group { animation: carBob 0.7s ease-in-out infinite; }
            @keyframes carBob {
              0%,100% { transform: translateY(0); }
              50%      { transform: translateY(-3px); }
            }

            /* ── Road dashes slide ── */
            .road-dashes { animation: dashSlide 0.5s linear infinite; }
            @keyframes dashSlide {
              from { transform: translateX(0); }
              to   { transform: translateX(-80px); }
            }

            /* ── Exhaust smoke puffs ── */
            .smoke { animation: smokeRise 1.4s ease-out infinite; }
            .s1 { animation-delay: 0s; }
            .s2 { animation-delay: 0.25s; }
            .s3 { animation-delay: 0.5s; }
            .s4 { animation-delay: 0.75s; }
            @keyframes smokeRise {
              0%   { transform: translate(0, 0) scale(0.5);   opacity: 0.8; }
              100% { transform: translate(-18px, -20px) scale(2); opacity: 0; }
            }

            /* ── Headlight beam breathe ── */
            .headlight-beam { animation: beamBreathe 2s ease-in-out infinite; }
            @keyframes beamBreathe {
              0%,100% { opacity: 0.9; }
              50%      { opacity: 0.5; }
            }

            /* ── Headlight bulb pulse ── */
            .hl-pulse { animation: hlPulse 1.5s ease-in-out infinite; }
            @keyframes hlPulse { 0%,100% { opacity:1; } 50% { opacity:0.55; } }

            /* ── Tail light pulse ── */
            .tl-pulse { animation: tlPulse 1.8s ease-in-out infinite; }
            @keyframes tlPulse { 0%,100% { opacity:0.9; } 50% { opacity:0.4; } }

            /* ── HUD scan sweep ── */
            .scan-sweep {
              animation: scanSweep 2.5s ease-in-out infinite;
            }
            @keyframes scanSweep {
              0%   { transform: translateX(0);    opacity:0; }
              10%  { opacity: 0.6; }
              90%  { opacity: 0.3; }
              100% { transform: translateX(408px); opacity:0; }
            }

            /* ── HUD blink ── */
            .hud-blink { animation: blink 1.2s step-end infinite; }
            @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
          `}</style>
        </div>

        {/* ── Right HUD panel ──────────────────────── */}
        <div className="side-panel side-panel--right">
          <div className="rpm-ring">
            <svg viewBox="0 0 80 80" width="80" height="80">
              <circle cx="40" cy="40" r="35" stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="none" />
              <circle
                cx="40" cy="40" r="35"
                stroke="url(#rpmArcGrad)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(rpmPercent / 100) * 220} 220`}
                strokeDashoffset="0"
                transform="rotate(-110 40 40)"
                style={{ transition: 'stroke-dasharray 0.1s linear' }}
              />
              <defs>
                <linearGradient id="rpmArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
              <text x="40" y="36" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="monospace">RPM</text>
              <text x="40" y="52" textAnchor="middle" fill="#ef4444" fontSize="10" fontFamily="monospace">{(rpm/1000).toFixed(1)}k</text>
            </svg>
          </div>
          <div className="gauge-label mt-2">ESTADO</div>
          <div className="status-dot-row">
            <div className="status-dot status-dot--on" />
            <div className="status-dot status-dot--on" />
            <div className="status-dot" />
            <div className="status-dot" />
          </div>
          <div className="gauge-label mt-3">TEMP</div>
          <div className="gauge-value gauge-value--sm gauge-value--green">88°C</div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
              BOTTOM HUD
         ══════════════════════════════════════════════ */}
      <div className="hud-bottom">

        {/* Status message */}
        <div className="status-area">
          <span className="status-code">{current.code}</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={current.msg}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.25 }}
              className="status-msg"
            >
              {current.msg}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
          />
          <span className="progress-pct">{progress}%</span>
        </div>

        {/* Node indicators */}
        <div className="nodes">
          {['AUTH','ENV','SEN','NET','BOOT'].map((n, i) => (
            <div key={n} className={`node ${progress > i * 20 ? 'node--active' : ''}`}>
              <div className="node-dot" />
              <span>{n}</span>
            </div>
          ))}
        </div>

      </div>

      {/* ── Styles ───────────────────────────────── */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .loader-root {
          position: fixed; inset: 0; z-index: 100;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          background: #09090b; overflow: hidden;
          font-family: 'Courier New', monospace;
        }

        /* Grid */
        .grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(239,68,68,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239,68,68,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        /* Blooms */
        .bloom {
          position: absolute; border-radius: 50%;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .bloom-red    { width: 700px; height: 700px; background: radial-gradient(circle, rgba(220,38,38,0.08), transparent 70%); }
        .bloom-orange { width: 450px; height: 450px; background: radial-gradient(circle, rgba(249,115,22,0.06), transparent 70%); }

        /* Corner brackets */
        .bracket {
          position: absolute; width: 28px; height: 28px;
          border-color: rgba(239,68,68,0.5); border-style: solid;
        }
        .bracket-tl { top: 20px; left: 20px;    border-width: 2px 0 0 2px; }
        .bracket-tr { top: 20px; right: 20px;   border-width: 2px 2px 0 0; }
        .bracket-bl { bottom: 20px; left: 20px;  border-width: 0 0 2px 2px; }
        .bracket-br { bottom: 20px; right: 20px; border-width: 0 2px 2px 0; }

        /* Top HUD bar */
        .hud-top {
          display: flex; align-items: center; gap: 12px;
          width: 100%; max-width: 900px;
          padding: 6px 16px;
          border-bottom: 1px solid rgba(239,68,68,0.15);
          margin-bottom: 12px;
        }
        .hud-label { font-size: 9px; color: #52525b; text-transform: uppercase; letter-spacing: .15em; }
        .hud-sep   { color: rgba(239,68,68,0.4); font-size: 8px; }
        .hud-value { font-size: 9px; color: #ef4444; text-transform: uppercase; letter-spacing: .1em; }
        .hud-spacer { flex: 1; }

        /* Scene */
        .scene {
          display: flex; align-items: center; gap: 16px;
          width: 100%; max-width: 960px;
          padding: 0 16px;
        }

        /* Side panels */
        .side-panel {
          display: flex; flex-direction: column; align-items: center;
          gap: 6px; min-width: 72px;
          padding: 12px 8px;
          border: 1px solid rgba(239,68,68,0.1);
          border-radius: 8px;
          background: rgba(239,68,68,0.03);
        }
        .gauge-label { font-size: 8px; color: #52525b; text-transform: uppercase; letter-spacing: .2em; }
        .gauge-value { font-size: 20px; color: #f97316; font-weight: 900; line-height: 1; }
        .gauge-value--sm { font-size: 13px; }
        .gauge-value--green { color: #22c55e; }
        .gauge-unit { font-size: 9px; color: #71717a; margin-left: 2px; }
        .gauge-bar-track {
          width: 8px; height: 80px;
          background: rgba(255,255,255,0.05);
          border-radius: 4px; overflow: hidden;
          display: flex; flex-direction: column-reverse;
        }
        .gauge-bar-fill {
          width: 100%;
          background: linear-gradient(to top, #ef4444, #f97316);
          border-radius: 4px;
          transition: height 0.1s linear;
          box-shadow: 0 0 8px rgba(239,68,68,0.5);
        }
        .mt-auto { margin-top: auto; }
        .mt-2 { margin-top: 8px; }
        .mt-3 { margin-top: 12px; }

        /* RPM ring */
        .rpm-ring { filter: drop-shadow(0 0 6px rgba(239,68,68,0.4)); }

        /* Status dots */
        .status-dot-row { display: flex; gap: 4px; }
        .status-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .status-dot--on {
          background: #ef4444;
          border-color: #ef4444;
          box-shadow: 0 0 6px rgba(239,68,68,0.7);
          animation: dotPulse 1s ease-in-out infinite;
        }
        @keyframes dotPulse { 0%,100%{opacity:1;} 50%{opacity:0.5;} }

        /* Car */
        .car-wrapper { flex: 1; }
        .car-svg {
          width: 100%; max-width: 600px;
          filter: drop-shadow(0 8px 32px rgba(220,38,38,0.35));
          animation: carBobMain 0.7s ease-in-out infinite;
        }
        @keyframes carBobMain {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }

        /* Bottom HUD */
        .hud-bottom {
          width: 100%; max-width: 900px;
          padding: 10px 16px 4px;
          border-top: 1px solid rgba(239,68,68,0.15);
          margin-top: 10px;
          display: flex; flex-direction: column; gap: 8px;
        }

        /* Status area */
        .status-area { display: flex; align-items: center; gap: 10px; }
        .status-code {
          font-size: 9px; color: #f97316;
          background: rgba(249,115,22,0.1);
          border: 1px solid rgba(249,115,22,0.2);
          padding: 2px 6px; border-radius: 3px;
          letter-spacing: .1em;
        }
        .status-msg { font-size: 11px; color: #a1a1aa; letter-spacing: .08em; }

        /* Progress */
        .progress-track {
          height: 3px; background: rgba(255,255,255,0.06); border-radius: 2px;
          overflow: visible; position: relative;
        }
        .progress-fill {
          height: 100%; border-radius: 2px;
          background: linear-gradient(90deg, #dc2626, #f97316);
          box-shadow: 0 0 10px rgba(239,68,68,0.6);
        }
        .progress-pct {
          position: absolute; right: 0; top: -16px;
          font-size: 9px; color: #f97316; letter-spacing: .1em;
        }

        /* Nodes */
        .nodes { display: flex; gap: 0; }
        .node {
          flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px;
          font-size: 8px; color: #3f3f46; letter-spacing: .12em;
          padding: 4px 0;
          transition: color 0.3s;
        }
        .node--active { color: #ef4444; }
        .node-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #27272a;
          transition: all 0.3s;
        }
        .node--active .node-dot {
          background: #ef4444;
          box-shadow: 0 0 6px rgba(239,68,68,0.8);
        }
      `}</style>
    </div>
  );
};

export default CarPreloader;
