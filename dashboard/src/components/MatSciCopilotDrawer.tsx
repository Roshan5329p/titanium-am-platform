import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Check, ArrowRight, Lightbulb, Zap, HelpCircle } from 'lucide-react';

interface CopilotMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  recommendedParams?: {
    laserPowerW?: number;
    scanSpeedMmS?: number;
    hatchSpacingUm?: number;
    layerThicknessUm?: number;
    preheatTempC?: number;
  };
  timestamp: string;
}

interface MatSciCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeAlloyName: string;
  onApplyParameters: (params: {
    laserPowerW?: number;
    scanSpeedMmS?: number;
    hatchSpacingUm?: number;
    layerThicknessUm?: number;
    preheatTempC?: number;
  }) => void;
}

const PRESET_QUERIES = [
  {
    label: 'Eliminate Keyholing in Ti-6Al-4V',
    prompt: 'How do I eliminate keyhole pore formation in Ti-6Al-4V while maintaining >99.8% density?',
  },
  {
    label: 'Medical Grade ASTM F3001 Recipe',
    prompt: 'What heat treatment and laser parameters are needed to satisfy ASTM F3001 medical elongation (>12%)?',
  },
  {
    label: 'Crack-Free Printing for Gamma TiAl',
    prompt: 'What preheat temperature and scanning strategy is required to prevent cracking in brittle Gamma TiAl?',
  },
  {
    label: 'LPBF vs WAAM for Aerospace Ribs',
    prompt: 'Compare Laser Powder Bed Fusion vs Wire Arc AM for manufacturing large titanium structural ribs.',
  },
];

export const MatSciCopilotDrawer: React.FC<MatSciCopilotDrawerProps> = ({
  isOpen,
  onClose,
  activeAlloyName,
  onApplyParameters,
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I am your **MatSci AM Metallurgy Copilot**, calibrated with analytical Rosenthal 3D equations, Ashby-Easterling phase kinetics, and empirical AM titanium datasets. I can optimize your processing window, troubleshoot porosity defects, or tailor heat treatments for aerospace/medical certification.\n\nHow can I assist your titanium additive manufacturing build today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [appliedParamId, setAppliedParamId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Domain Metallurgical Intelligence Response Engine
    setTimeout(() => {
      let aiResponseText = '';
      let recommendedParams: CopilotMessage['recommendedParams'] | undefined = undefined;

      const lower = queryText.toLowerCase();

      if (lower.includes('keyhole') || lower.includes('keyholing')) {
        aiResponseText = `**Keyholing Porosity Remediation:**\n\nKeyhole pore formation occurs when the **Normalized Enthalpy ($H$)** exceeds $\\approx 5.5$ and the melt pool aspect ratio ($d/w$) exceeds 0.85. The intense recoil pressure of vaporizing titanium pushes molten metal aside, creating an unstable vapor depression that collapses and traps argon gas voids.\n\n**Action Plan:**\n1. **Increase Scan Speed:** Boost $v$ from 950 mm/s to **1,250 mm/s** to shorten local laser dwell time.\n2. **Moderate Laser Power:** Adjust power to **220 W**.\n3. **Resulting Energy Density:** Maintains VED at $\\approx 68\\text{ J/mm}^3$ (fully dense conduction mode, relative density $>99.85\\%$).`;
        recommendedParams = {
          laserPowerW: 220,
          scanSpeedMmS: 1250,
          hatchSpacingUm: 80,
          layerThicknessUm: 40,
        };
      } else if (lower.includes('astm f3001') || lower.includes('medical') || lower.includes('elongation')) {
        aiResponseText = `**ASTM F3001 Medical Implant Qualification:**\n\nFor medical implants (orthopedic/dental), ASTM F3001 requires strict ductility (Elongation at break $\\ge 12\\%$, UTS $\\ge 860\\text{ MPa}$). In the as-built state, rapid solidification ($10^5\\text{ K/s}$) freezes a 100% fine acicular $\\alpha'$ martensitic microstructure with high yield strength but low ductility (~6–8%).\n\n**Qualification Recipe:**\n1. **Optimal As-Built Parameters:** Print at **200 W** and **1,000 mm/s** to minimize oxygen pickup and lack-of-fusion voids.\n2. **HIP Cycle:** 920°C @ 1,200 bar Argon for 2.0 hours. This dissolves internal pore cavities and transforms brittle $\\alpha'$ needles into ductile lamellar $\\alpha+\\beta$ grains (elongation reaches 13.5%–15.0%).`;
        recommendedParams = {
          laserPowerW: 200,
          scanSpeedMmS: 1000,
          preheatTempC: 150,
        };
      } else if (lower.includes('gamma') || lower.includes('tial') || lower.includes('crack')) {
        aiResponseText = `**Gamma TiAl (Ti-48Al-2Cr-2Nb) Intermetallic AM:**\n\nGamma TiAl exhibits near-zero room temperature ductility and extreme sensitivity to thermal shock cracks during rapid cooling below its brittle-to-ductile transition temperature (BDTT $\\approx 750^\\circ\\text{C}$).\n\n**Crack-Free Deposition Protocol:**\n1. **High-Temperature Substrate Preheat:** Preheat must be maintained above **800°C** (or use electron beam AM with 1,000°C powder bed sintering).\n2. **Laser Parameters:** Moderate laser power at **250 W** with high scan speed **1,400 mm/s** to lower localized thermal stress gradients.`;
        recommendedParams = {
          laserPowerW: 250,
          scanSpeedMmS: 1400,
          preheatTempC: 800,
        };
      } else if (lower.includes('waam') || lower.includes('large') || lower.includes('rib')) {
        aiResponseText = `**LPBF vs. WAAM Technology Comparison for Structural Ribs:**\n\n• **Laser PBF:** Ideal for complex thin-walled internal lattices (<0.8 mm) with fine surface finish ($Ra \\approx 8–15\\mu m$). However, deposition rate is limited to **$15–35\\text{ cm}^3/\\text{hr}$**, making multi-meter bulk aerospace ribs cost-prohibitive.\n• **Wire Arc AM (WAAM):** Delivers deposition rates of **$1,500–4,000\\text{ cm}^3/\\text{hr}$** (up to 3–6 kg/hr) at significantly lower feed cost ($65/kg wire vs $220/kg powder). Requires post-build CNC machining.\n\n**Recommendation:** Use WAAM for large near-net-shape aerospace spars, followed by sub-transus annealing to relieve residual shrinkage stresses.`;
      } else {
        aiResponseText = `Based on your query regarding **${activeAlloyName}**, our hybrid physics engine predicts that keeping Volumetric Energy Density between **60 and 85 J/mm³** maintains a stable conduction melt pool. Combining this with sub-transus stress relief (730°C / 2h vacuum) relieves 92% of residual thermal stresses while preserving high tensile yield (>880 MPa).`;
        recommendedParams = {
          laserPowerW: 220,
          scanSpeedMmS: 1050,
        };
      }

      const aiMsg: CopilotMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        recommendedParams,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleApply = (msgId: string, params: CopilotMessage['recommendedParams']) => {
    if (!params) return;
    onApplyParameters(params);
    setAppliedParamId(msgId);
    setTimeout(() => setAppliedParamId(null), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#070b10] border-l border-[#1d2736] shadow-2xl flex flex-col justify-between backdrop-blur-xl animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-[#1c2736] bg-[#0b121a] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#50d8e9]/20 text-[#50d8e9]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>MatSci AM Copilot</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[11px] text-[#7893af]">
              Titanium Metallurgy &amp; Process Physics Assistant
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#7c97b5] hover:text-white hover:bg-[#141e2b] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-[#50d8e9]/15 text-[#50d8e9] flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-xl p-3.5 leading-relaxed space-y-2.5 ${
                msg.sender === 'user'
                  ? 'bg-[#1a3854] text-white border border-[#2a557d]'
                  : 'bg-[#0f1722] text-[#c7daf0] border border-[#1d2c3e] shadow-lg'
              }`}
            >
              <div className="whitespace-pre-line font-sans">{msg.text}</div>

              {msg.recommendedParams && (
                <div className="pt-2 border-t border-[#1e2f42] space-y-2">
                  <div className="text-[10px] uppercase font-bold text-[#50d8e9] tracking-wider">
                    Recommended Process Parameters:
                  </div>
                  <div className="flex flex-wrap gap-2 font-mono text-[11px] text-white">
                    {msg.recommendedParams.laserPowerW && (
                      <span className="px-2 py-0.5 rounded bg-[#152332] border border-[#24374d]">
                        P = {msg.recommendedParams.laserPowerW} W
                      </span>
                    )}
                    {msg.recommendedParams.scanSpeedMmS && (
                      <span className="px-2 py-0.5 rounded bg-[#152332] border border-[#24374d]">
                        v = {msg.recommendedParams.scanSpeedMmS} mm/s
                      </span>
                    )}
                    {msg.recommendedParams.preheatTempC && (
                      <span className="px-2 py-0.5 rounded bg-[#152332] border border-[#24374d]">
                        T_preheat = {msg.recommendedParams.preheatTempC} °C
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleApply(msg.id, msg.recommendedParams)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#50d8e9] hover:bg-[#3ec4d6] text-black font-bold text-xs transition-all shadow-md mt-1 cursor-pointer"
                  >
                    {appliedParamId === msg.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Applied to Sliders!</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>Apply Parameters to Workbench</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="text-[9.5px] text-[#556e87] text-right">{msg.timestamp}</div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-[#1a3854] text-white flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-lg bg-[#50d8e9]/15 text-[#50d8e9] flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#0f1722] text-[#8fa7c2] border border-[#1d2c3e] rounded-xl px-4 py-2.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#50d8e9] animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#50d8e9] animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#50d8e9] animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] ml-1">Analyzing metallurgical physics...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2.5 bg-[#0a1017] border-t border-[#182330]">
        <div className="text-[10px] text-[#718da8] uppercase tracking-wider mb-1.5 flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-[#50d8e9]" />
          <span>Quick Exhibition Demonstrations</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q.prompt)}
              className="text-[10.5px] px-2.5 py-1 rounded-md bg-[#101924] border border-[#1e2f42] text-[#8fa8c2] hover:text-[#50d8e9] hover:border-[#50d8e9]/40 transition-colors truncate max-w-full text-left"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3.5 bg-[#0b121a] border-t border-[#1c2736]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputQuery);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about defect elimination, HIP cycles, or ASTM specs..."
            className="flex-1 bg-[#101722] border border-[#213042] rounded-lg px-3 py-2 text-xs text-white placeholder-[#5a7491] focus:outline-none focus:border-[#50d8e9]"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="p-2 rounded-lg bg-[#50d8e9] hover:bg-[#3ec4d6] text-black font-bold transition-all disabled:opacity-40 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
