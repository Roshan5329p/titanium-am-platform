import React, { useState } from 'react';
import { Check, ArrowRight, ArrowUpRight } from 'lucide-react';

interface MatSciCommandSectionsProps {
  onSelectMaterialInWorkbench: (id: string) => void;
  onOpenCompareModal: () => void;
}

export function MatSciCommandSections({
  onSelectMaterialInWorkbench,
  onOpenCompareModal,
}: MatSciCommandSectionsProps) {
  const [feedMode, setFeedMode] = useState<'live' | 'historical'>('live');
  const [activePhaseMonth, setActivePhaseMonth] = useState<string>('STAGE_02');
  const [scanPos, setScanPos] = useState<number>(42);
  const [activeTimelineNode, setActiveTimelineNode] = useState<number>(1);
  const [executedRoutes, setExecutedRoutes] = useState<Record<string, boolean>>({});

  const queueRoutes = [
    {
      id: 'ti-6al-4v',
      code: 'TI64_LPBF_HIP_CYCLE',
      meta: 'Priority: High · 29 Process Routes',
      actionLabel: 'Execute',
    },
    {
      id: 'ti-6al-4v-eli',
      code: 'TI64_ELI_EBM_FRACTURE_SYNC',
      meta: 'Priority: High · 22 Process Routes',
      actionLabel: 'Inspect',
    },
    {
      id: 'ti-6242',
      code: 'TI6242_DED_CREEP_STABILIZE',
      meta: 'Priority: Med · 14 Process Routes',
      actionLabel: 'Inspect',
    },
  ];

  const insightNodes = [
    {
      id: 1,
      title: 'Thermal kinetics',
      desc: 'Calibrate heating ramps and isothermal hold windows.',
      stat: '±0.5 °C Precision',
      detail: 'Eliminates incipient melting and thermal micro-porosity during Hot Isostatic Pressing (HIP) and vacuum annealing across titanium additive manufacturing routes.',
    },
    {
      id: 2,
      title: 'Phase stability',
      desc: 'Predict precipitate nucleation and crystal polytypes.',
      stat: '275 Route Profiles',
      detail: 'Maps cooling rate vectors directly to α, β, and martensitic transformation thresholds across 20 titanium alloys.',
    },
    {
      id: 3,
      title: 'Defect suppression',
      desc: 'Track porosity and residual stress continuously.',
      stat: '99.94% Theoretical ρ',
      detail: 'Correlates Hot Isostatic Pressing (HIP) pressure-temperature trajectories with fatigue crack initiation resistance.',
    },
    {
      id: 4,
      title: 'Property calibration',
      desc: 'Establish deterministic mechanical and thermal outputs.',
      stat: '20 Verified Specs',
      detail: 'Links every synthesis step to resulting tensile strength, elastic modulus, thermal conductivity, and electrical resistivity.',
    },
  ];

  const currentNode = insightNodes.find((n) => n.id === activeTimelineNode) || insightNodes[0];

  return (
    <div className="w-full">
      {/* 1. Signal Intelligence / Synthesis Parameter Stream */}
      <section
        id="telemetry-section"
        className="px-4 sm:px-8 border-t border-[#232426] flex items-center relative py-20 max-w-[1728px] mx-auto scroll-mt-20"
      >
        <div className="max-w-[1516px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div>
            <h2 className="font-h2 text-3xl sm:text-5xl text-[#e5e2e3] mb-6 tracking-tight leading-tight">
              Turn synthesis parameters into focus
            </h2>
            <p className="font-body-lg text-base sm:text-[19px] text-[#9A9DA3] leading-relaxed max-w-xl">
              Aggregate furnace kinetics, atmospheric pressure curves, and quench vectors into a single structured stream. MatSci Navigator links every processing parameter to final material performance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => onSelectMaterialInWorkbench('ti-6al-4v')}
                className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded hover:bg-[#e5e5e5] transition-colors"
              >
                Inspect Ti-6Al-4V Telemetry
              </button>
              <button
                onClick={onOpenCompareModal}
                className="px-5 py-2.5 bg-[#101112] border border-[#232426] text-sm text-[#e5e2e3] rounded hover:border-[#50d8e9]/50 transition-colors"
              >
                Open Comparison Matrix
              </button>
            </div>
          </div>

          {/* Right Technical Grid Container (Matches Image 1 & 2) */}
          <div className="relative h-[460px] sm:h-[540px] w-full flex items-center justify-center">
            <div className="w-full h-full border border-[#454655]/30 relative overflow-hidden bg-[#070708] rounded-xl inner-glow shadow-2xl">
              <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
              {/* Corner Markers */}
              <div className="absolute top-4 left-4 w-2.5 h-2.5 border-t border-l border-[#8f8fa1]" />
              <div className="absolute top-4 right-4 w-2.5 h-2.5 border-t border-r border-[#8f8fa1]" />
              <div className="absolute bottom-4 left-4 w-2.5 h-2.5 border-b border-l border-[#8f8fa1]" />
              <div className="absolute bottom-4 right-4 w-2.5 h-2.5 border-b border-r border-[#8f8fa1]" />

              {/* Header Telemetry */}
              <div className="absolute top-6 left-6 sm:left-8 flex gap-8 z-10">
                <div className="flex flex-col">
                  <span className="font-mono-data text-[9px] text-[#9A9DA3] uppercase tracking-[0.2em]">
                    Engine Kernel
                  </span>
                  <span className="font-mono-data text-[11px] text-[#e5e2e3]">
                    LOCAL_JAVA_V4 // 20_ALLOYS_8_PROCESSES
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono-data text-[9px] text-[#9A9DA3] uppercase tracking-[0.2em]">
                    Phase Coherence
                  </span>
                  <span className="font-mono-data text-[11px] text-[#50d8e9]">
                    0.994 RMS
                  </span>
                </div>
              </div>

              {/* Analytical Visualization SVG */}
              <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-12">
                <svg className="w-full h-[60%]" preserveAspectRatio="none" viewBox="0 0 1000 400">
                  <defs>
                    <linearGradient id="matsci-line-grad" x1="0%" x2="100%" y1="0%" y2="0%">
                      <stop offset="0%" stopColor="#50d8e9" stopOpacity="0.1" />
                      <stop offset="50%" stopColor="#50d8e9" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#50d8e9" stopOpacity="0.15" />
                    </linearGradient>
                  </defs>
                  <line opacity="0.2" stroke="#454655" strokeDasharray="4 4" strokeWidth="0.5" x1="0" x2="1000" y1="100" y2="100" />
                  <line opacity="0.15" stroke="#454655" strokeWidth="0.5" x1="0" x2="1000" y1="200" y2="200" />
                  <line opacity="0.2" stroke="#454655" strokeDasharray="4 4" strokeWidth="0.5" x1="0" x2="1000" y1="300" y2="300" />

                  {feedMode === 'live' ? (
                    <path
                      d="M0,200 L100,195 L200,210 L300,180 L400,220 L500,145 L600,230 L700,200 L800,210 L900,190 L1000,200"
                      fill="none"
                      stroke="url(#matsci-line-grad)"
                      strokeWidth="1.5"
                    />
                  ) : (
                    <path
                      d="M0,215 L120,185 L240,195 L360,165 L480,205 L600,160 L720,215 L860,185 L1000,195"
                      fill="none"
                      stroke="#bec2ff"
                      strokeWidth="1.4"
                      opacity="0.75"
                    />
                  )}

                  <circle cx="300" cy="180" fill="#50d8e9" r="2.5" />
                  <circle cx="500" cy="145" fill="#50d8e9" r="3.5" />
                  <circle cx="600" cy="230" fill="#ffb689" r="3.5" />

                  <text fill="#50d8e9" fontFamily="Inter" fontSize="10" fontWeight="600" x="512" y="138">
                    T_RECRYST_OPTIMAL
                  </text>
                  <text fill="#ffb689" fontFamily="Inter" fontSize="10" fontWeight="600" x="612" y="245">
                    Δ_GRAIN_COARSENING
                  </text>
                </svg>
              </div>

              {/* Floating Status Box */}
              <div className="absolute top-1/2 right-6 sm:right-10 -translate-y-1/2 border border-[#454655]/30 bg-[#1c1b1d]/60 backdrop-blur-md p-4 flex flex-col gap-3 rounded">
                <div className="flex flex-col">
                  <span className="text-[8px] text-[#9A9DA3] uppercase">
                    Variant Coverage
                  </span>
                  <div className="w-24 h-1 bg-[#454655] mt-1 relative rounded-full overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-[#bec2ff] w-[88%]" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-[#9A9DA3] uppercase">
                    Verified Routes
                  </span>
                  <span className="text-xs text-[#e5e2e3] font-mono-data font-medium">
                    275 / 275
                  </span>
                </div>
              </div>

              {/* Bottom Metadata */}
              <div className="absolute bottom-6 left-6 sm:left-8 right-6 sm:right-8 flex justify-between items-end font-mono-data">
                <div className="text-[9px] text-[#9A9DA3]/70 leading-relaxed">
                  ASTM_ISO_52900 · 8_AUTHORIZED_AM_PROCESSES<br />
                  QUERY_LATENCY: 0.4ms · ZERO_HALLUCINATION_DB
                </div>
                <div className="flex gap-4 text-[10px] uppercase tracking-widest">
                  <button
                    onClick={() => setFeedMode('live')}
                    className={feedMode === 'live' ? 'text-[#bec2ff] font-bold' : 'text-[#9A9DA3]/50 hover:text-white'}
                  >
                    Live Stream
                  </button>
                  <button
                    onClick={() => setFeedMode('historical')}
                    className={feedMode === 'historical' ? 'text-[#bec2ff] font-bold' : 'text-[#9A9DA3]/50 hover:text-white'}
                  >
                    Reference
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Decision Command Center / Synthesis Route Control */}
      <section
        id="architecture-section"
        className="px-4 sm:px-8 border-t border-[#232426] flex items-center relative py-20 max-w-[1728px] mx-auto"
      >
        <div className="max-w-[1516px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Schematic & Control Queue */}
          <div className="relative h-[580px] w-full order-2 lg:order-1">
            <div className="absolute inset-0 bg-[#0a0a0b] border border-white/[0.05] rounded-xl overflow-hidden flex flex-col inner-glow shadow-2xl">
              {/* Top Timeline */}
              <div className="p-6 border-b border-white/[0.03] relative h-[45%] bg-[#080809]">
                <div className="flex justify-between font-mono-data text-[9px] text-[#9A9DA3]/50 mb-8 border-b border-white/[0.03] pb-2 uppercase tracking-[0.2em]">
                  {[
                    { label: 'STAGE_01', pos: 15 },
                    { label: 'STAGE_02', pos: 42 },
                    { label: 'STAGE_03', pos: 68 },
                    { label: 'STAGE_04', pos: 88 },
                  ].map((st) => (
                    <button
                      key={st.label}
                      onClick={() => {
                        setActivePhaseMonth(st.label);
                        setScanPos(st.pos);
                      }}
                      className={`hover:text-white transition-colors ${
                        activePhaseMonth === st.label ? 'text-[#e5e2e3] font-bold' : ''
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                <div className="relative h-full">
                  <div className="absolute top-0 left-[5%] w-[35%] h-[1px] bg-white/[0.15] flex items-center">
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full -ml-0.5" />
                    <span className="ml-3 text-[9px] font-mono-data text-[#9A9DA3]/70">
                      PHASE_01 · PRECURSOR_MELT
                    </span>
                  </div>
                  <div className="absolute top-11 left-[28%] w-[55%] h-[1px] bg-[#5E6BFF]/40 flex items-center">
                    <div className="w-1.5 h-1.5 bg-[#5E6BFF] rounded-full -ml-0.5" />
                    <span className="ml-3 text-[9px] font-mono-data text-[#bec2ff]">
                      PHASE_02 · THERMOMECHANICAL_FORMING
                    </span>
                  </div>
                  <div className="absolute top-22 left-[65%] w-[28%] h-[1px] border-t border-dashed border-white/20 flex items-center">
                    <span className="ml-3 text-[9px] font-mono-data text-[#9A9DA3]/50">
                      PHASE_03 · PRECIPITATION_AGE
                    </span>
                  </div>

                  {/* Vertical Scanning Line */}
                  <div
                    className="absolute inset-y-0 w-px bg-[#5E6BFF]/60 shadow-[0_0_12px_rgba(94,107,255,0.5)] z-10 transition-all duration-300"
                    style={{ left: `${scanPos}%` }}
                  >
                    <div className="absolute top-0 -translate-x-1/2 w-2.5 h-2.5 border border-[#5E6BFF] bg-[#0a0a0b]" />
                  </div>
                </div>
              </div>

              {/* Bottom Split Hub */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.03]">
                <div className="bg-[#0a0a0b] p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-mono-data text-[9px] text-[#9A9DA3]/70 uppercase font-bold tracking-wider">
                        Synthesis Telemetry
                      </span>
                      <span className="text-[8px] font-mono-data text-[#50d8e9]">
                        SYNC: 200MS
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-[8px] text-[#9A9DA3]/50 uppercase block">Materials</span>
                        <span className="text-sm font-mono-data text-white tabular-nums">20</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-[#9A9DA3]/50 uppercase block">Routes</span>
                        <span className="text-sm font-mono-data text-[#50d8e9] tabular-nums">275</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-[#9A9DA3]/50 uppercase block">Processes</span>
                        <span className="text-sm font-mono-data text-white tabular-nums">08</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 h-16 border border-white/[0.03] rounded bg-[#080809] relative overflow-hidden">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                      <path
                        d="M0,35 L12,30 L24,34 L36,22 L48,26 L60,12 L72,22 L86,18 L100,24"
                        fill="none"
                        stroke="#50d8e9"
                        strokeWidth="0.8"
                      />
                    </svg>
                  </div>
                </div>

                <div className="bg-[#0a0a0b] p-6 flex flex-col">
                  <div className="font-mono-data text-[9px] text-[#9A9DA3]/70 uppercase font-bold tracking-wider mb-3">
                    Phase Logic Schematic
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 200 120">
                      <circle cx="100" cy="60" fill="#5E6BFF" r="3" />
                      <circle cx="100" cy="60" fill="none" r="9" stroke="#5E6BFF" strokeWidth="0.5" />
                      <path d="M100,60 L60,38" opacity="0.35" stroke="white" strokeWidth="0.6" />
                      <path d="M100,60 L140,38" opacity="0.35" stroke="white" strokeWidth="0.6" />
                      <path d="M100,60 L100,98" opacity="0.35" stroke="white" strokeDasharray="2 1" strokeWidth="0.6" />
                      <rect fill="none" height="10" opacity="0.4" stroke="white" strokeWidth="0.5" width="10" x="55" y="33" />
                      <rect fill="none" height="10" opacity="0.4" stroke="white" strokeWidth="0.5" width="10" x="135" y="33" />
                      <circle cx="100" cy="98" fill="#ffb689" r="2.5" />
                      <text fill="#9A9DA3" fontFamily="monospace" fontSize="5" x="50" y="28">ALLOY_IN</text>
                      <text fill="#9A9DA3" fontFamily="monospace" fontSize="5" x="130" y="28">THERM_TX</text>
                      <text fill="#ffb689" fontFamily="monospace" fontSize="5" x="106" y="100">TEMPER_T6</text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Control Queue Card */}
            <div className="absolute -right-2 sm:-right-6 lg:-right-10 bottom-[6%] w-[300px] sm:w-[340px] bg-[#0d0e0f]/95 backdrop-blur-xl border border-white/[0.08] rounded-lg p-5 shadow-2xl z-20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono-data font-bold text-white tracking-[0.18em] uppercase">
                  Synthesis Queue
                </span>
                <span className="text-[9px] font-mono-data text-[#50d8e9]">
                  ID: 0x275_V
                </span>
              </div>

              <div className="space-y-3">
                {queueRoutes.map((item) => {
                  const isDone = !!executedRoutes[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectMaterialInWorkbench(item.id)}
                      className="flex justify-between items-center p-2 rounded hover:bg-white/[0.03] cursor-pointer transition-colors"
                    >
                      <div>
                        <div className="text-[11px] font-mono-data text-white font-medium">
                          {item.code}
                        </div>
                        <div className="text-[9px] font-mono-data text-[#9A9DA3]/60">
                          {item.meta}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExecutedRoutes((prev) => ({ ...prev, [item.id]: true }));
                          onSelectMaterialInWorkbench(item.id);
                        }}
                        className={`px-2.5 py-1 text-[9px] font-mono-data uppercase tracking-wider rounded border transition-colors ${
                          isDone
                            ? 'border-[#50d8e9]/40 text-[#50d8e9] bg-[#50d8e9]/10'
                            : 'border-[#5E6BFF]/40 text-[#bec2ff] hover:bg-[#5E6BFF]/15'
                        }`}
                      >
                        {isDone ? 'Loaded' : item.actionLabel}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Copy */}
          <div className="order-1 lg:order-2">
            <h2 className="font-h2 text-3xl sm:text-5xl text-[#e5e2e3] mb-6 tracking-tight leading-tight">
              Guide every synthesis route forward
            </h2>
            <p className="font-body-lg text-base sm:text-[19px] text-[#9A9DA3] leading-relaxed max-w-xl">
              Map multi-stage thermal treatments against crystallographic phase boundaries. Compare Powder Bed Fusion, Directed Energy Deposition, Wire Arc, Binder Jetting, and the 8 authorized ISO/ASTM AM processes with complete parameter provenance.
            </p>
          </div>
        </div>
      </section>

      {/* 3. 4-Node Insights Timeline */}
      <section id="insights-section" className="px-4 sm:px-8 border-t border-[#232426] flex flex-col justify-center relative overflow-hidden py-20 max-w-[1728px] mx-auto scroll-mt-20">
        <div className="max-w-[1516px] w-full mx-auto relative pt-10">
          <div className="hidden md:block absolute top-[62px] left-0 w-full h-px bg-[#232426] z-0" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            {insightNodes.map((node) => {
              const isActive = activeTimelineNode === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setActiveTimelineNode(node.id)}
                  className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-[#101112]/50 transition-colors"
                >
                  {isActive ? (
                    <div className="w-4 h-4 rounded-full bg-[#5E6BFF] mb-5 shadow-[0_0_15px_#5E6BFF]" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-[#232426] border border-[#9A9DA3] mb-5 mt-0.5" />
                  )}
                  <h3 className="font-h4 text-lg text-[#e5e2e3] mb-1.5 font-semibold">
                    {node.title}
                  </h3>
                  <p className="font-body-md text-xs sm:text-sm text-[#9A9DA3] max-w-xs">
                    {node.desc}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-10 p-6 bg-[#101112] border border-[#232426] rounded-xl max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-left">
              <div className="text-xs font-mono-data text-[#50d8e9] mb-1">
                0{currentNode.id}. {currentNode.title.toUpperCase()}
              </div>
              <p className="text-xs sm:text-sm text-[#c6c5d8] leading-relaxed">
                {currentNode.detail}
              </p>
            </div>
            <div className="font-h3 text-xl font-bold text-white shrink-0 font-mono-data">
              {currentNode.stat}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Signature Dual Quote Cards (#D1EBEB Cyan & #C4FF44 Lime from Image 1) */}
      <section className="px-4 sm:px-8 border-t border-[#232426] flex items-center bg-[#050505] py-20 max-w-[1728px] mx-auto">
        <div className="max-w-[1516px] w-full mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div
            onClick={() => onSelectMaterialInWorkbench('ti-6al-4v')}
            className="lg:col-span-3 bg-[#D1EBEB] rounded-2xl p-8 sm:p-10 flex flex-col justify-between min-h-[340px] cursor-pointer hover:opacity-95 transition-opacity"
          >
            <p className="font-h2 text-2xl sm:text-3xl text-black leading-tight max-w-2xl">
              &ldquo;MatSci Navigator finally gave our metallurgy and propulsion teams a unified lens across 20 titanium alloys and 275 additive manufacturing process variants.&rdquo;
            </p>
            <div className="mt-8">
              <div className="font-bold text-black text-base">Dr. Mara Chen</div>
              <div className="text-black/70 text-xs sm:text-sm">
                VP Materials Engineering, Northline Aerospace (450+ Engineers)
              </div>
            </div>
          </div>

          <div
            onClick={() => onSelectMaterialInWorkbench('ti-6al-4v-eli')}
            className="lg:col-span-2 bg-[#C4FF44] rounded-2xl p-8 sm:p-10 flex flex-col justify-between min-h-[340px] cursor-pointer hover:opacity-95 transition-opacity"
          >
            <p className="font-h3 text-xl sm:text-2xl text-black leading-tight">
              &ldquo;It replaced disparate ASTM AM standards, fragmented vendor data sheets, and manual heat-treatment lookup tables.&rdquo;
            </p>
            <div className="mt-8">
              <div className="font-bold text-black text-base">Ivo Patel</div>
              <div className="text-black/70 text-xs sm:text-sm">
                Director of AM &amp; Vacuum Sintering Operations, Meridian Advanced Alloys
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
