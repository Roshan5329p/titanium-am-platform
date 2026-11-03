/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Literature Evidence & Research Gap Intelligence View
 * Displays:
 * 1. Number of relevant indexed publications
 * 2. Available experimental data
 * 3. Process parameter ranges covered
 * 4. Mechanical properties frequently reported
 * 5. Properties with insufficient published evidence
 * 6. Research opportunities
 */

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Database,
  Sliders,
  Award,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  Search,
  Filter,
  CheckCircle,
  TrendingUp,
  Layers,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import {
  INDEXED_LITERATURE,
  CURATED_EXPERIMENTAL_RECORDS,
  PROCESS_PARAMETER_RANGES,
  FREQUENTLY_REPORTED_PROPERTIES,
  INSUFFICIENT_EVIDENCE_PROPERTIES,
  RESEARCH_OPPORTUNITIES,
  CuratedExperimentalRecord
} from '../utils/literatureIntelligence';

interface LiteratureIntelligenceViewProps {
  onApplyParameters?: (
    powerW: number,
    speedMmS: number,
    hatchUm: number,
    layerUm: number,
    alloyId: string,
    processId?: string
  ) => void;
}

export const LiteratureIntelligenceView: React.FC<LiteratureIntelligenceViewProps> = ({
  onApplyParameters,
}) => {
  const [activeSection, setActiveSection] = useState<'all' | '1-pubs' | '2-data' | '3-params' | '4-reported' | '5-gaps' | '6-opportunities'>('all');
  const [alloyFilter, setAlloyFilter] = useState<string>('all');
  const [processFilter, setProcessFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<CuratedExperimentalRecord | null>(null);

  // Filter experimental records
  const filteredRecords = useMemo(() => {
    return CURATED_EXPERIMENTAL_RECORDS.filter((rec) => {
      const matchesAlloy = alloyFilter === 'all' || rec.alloyGroup === alloyFilter || rec.alloy.toLowerCase().includes(alloyFilter.toLowerCase());
      const matchesProcess = processFilter === 'all' || rec.process === processFilter;
      const matchesQuery =
        searchQuery === '' ||
        rec.citation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.alloy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.keyFinding.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.journal.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesAlloy && matchesProcess && matchesQuery;
    });
  }, [alloyFilter, processFilter, searchQuery]);

  return (
    <div className="space-y-8 text-[#e0e6ed]">
      {/* Top Header Card */}
      <div className="bg-[#10141b] border border-[#1e2633] rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#50d8e9]/10 via-[#38bdf8]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#50d8e9]/15 text-[#50d8e9] border border-[#50d8e9]/30 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Literature Evidence Hub
              </span>
              <span className="text-xs text-[#8ca4be] font-mono">
                {INDEXED_LITERATURE.totalPublications.toLocaleString()} Indexed Publications • 6 Analytical Insights
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Additive Manufacturing Scientific Evidence &amp; Research Gap Matrix
            </h2>
            <p className="text-xs sm:text-sm text-[#93a8c0] max-w-3xl leading-relaxed">
              Synthesizes peer-reviewed literature across titanium AM: publications distribution, benchmark datasets, parameter envelopes, reported properties, under-characterized qualification gaps, and high-impact research frontiers.
            </p>
          </div>

          {/* Quick Stat Counter Cards */}
          <div className="grid grid-cols-3 gap-3 font-mono shrink-0">
            <div className="bg-[#0b0f17] border border-[#1c2838] p-3 rounded-lg text-center">
              <div className="text-[10px] text-[#718da9] uppercase tracking-wider">Publications</div>
              <div className="text-xl font-bold text-white mt-0.5">{INDEXED_LITERATURE.totalPublications}+</div>
              <div className="text-[9.5px] text-[#50d8e9]">Scopus/WoS</div>
            </div>
            <div className="bg-[#0b0f17] border border-[#1c2838] p-3 rounded-lg text-center">
              <div className="text-[10px] text-[#718da9] uppercase tracking-wider">Exp. Records</div>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">{CURATED_EXPERIMENTAL_RECORDS.length}+</div>
              <div className="text-[9.5px] text-[#8ea8c4]">Deeply Curated</div>
            </div>
            <div className="bg-[#0b0f17] border border-[#1c2838] p-3 rounded-lg text-center">
              <div className="text-[10px] text-[#718da9] uppercase tracking-wider">Research Gaps</div>
              <div className="text-xl font-bold text-amber-400 mt-0.5">{INSUFFICIENT_EVIDENCE_PROPERTIES.length}</div>
              <div className="text-[9.5px] text-rose-400">Critical Voids</div>
            </div>
          </div>
        </div>

        {/* Section Navigation Pills */}
        <div className="mt-6 pt-4 border-t border-[#1c2533] flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setActiveSection('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeSection === 'all'
                ? 'bg-[#50d8e9] text-[#080d14] font-bold shadow-md'
                : 'bg-[#141a24] text-[#8fa6be] hover:text-white hover:bg-[#1a2332] border border-[#202b3b]'
            }`}
          >
            <span>All 6 Insights</span>
          </button>
          <button
            onClick={() => setActiveSection('1-pubs')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeSection === '1-pubs'
                ? 'bg-[#50d8e9] text-[#080d14] font-bold shadow-md'
                : 'bg-[#141a24] text-[#8fa6be] hover:text-white hover:bg-[#1a2332] border border-[#202b3b]'
            }`}
          >
            <span>1. Indexed Publications</span>
          </button>
          <button
            onClick={() => setActiveSection('2-data')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeSection === '2-data'
                ? 'bg-[#50d8e9] text-[#080d14] font-bold shadow-md'
                : 'bg-[#141a24] text-[#8fa6be] hover:text-white hover:bg-[#1a2332] border border-[#202b3b]'
            }`}
          >
            <span>2. Available Experimental Data</span>
          </button>
          <button
            onClick={() => setActiveSection('3-params')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeSection === '3-params'
                ? 'bg-[#50d8e9] text-[#080d14] font-bold shadow-md'
                : 'bg-[#141a24] text-[#8fa6be] hover:text-white hover:bg-[#1a2332] border border-[#202b3b]'
            }`}
          >
            <span>3. Process Parameter Ranges</span>
          </button>
          <button
            onClick={() => setActiveSection('4-reported')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeSection === '4-reported'
                ? 'bg-[#50d8e9] text-[#080d14] font-bold shadow-md'
                : 'bg-[#141a24] text-[#8fa6be] hover:text-white hover:bg-[#1a2332] border border-[#202b3b]'
            }`}
          >
            <span>4. Frequently Reported Properties</span>
          </button>
          <button
            onClick={() => setActiveSection('5-gaps')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeSection === '5-gaps'
                ? 'bg-[#50d8e9] text-[#080d14] font-bold shadow-md'
                : 'bg-[#141a24] text-[#8fa6be] hover:text-white hover:bg-[#1a2332] border border-[#202b3b]'
            }`}
          >
            <span>5. Insufficient Evidence Gaps</span>
          </button>
          <button
            onClick={() => setActiveSection('6-opportunities')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeSection === '6-opportunities'
                ? 'bg-[#50d8e9] text-[#080d14] font-bold shadow-md'
                : 'bg-[#141a24] text-[#8fa6be] hover:text-white hover:bg-[#1a2332] border border-[#202b3b]'
            }`}
          >
            <span>6. Research Opportunities</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* FEATURE 1: NUMBER OF RELEVANT INDEXED PUBLICATIONS */}
      {/* ==================================================================== */}
      {(activeSection === 'all' || activeSection === '1-pubs') && (
        <section className="bg-[#10141b] border border-[#1e2633] rounded-xl p-5 sm:p-6 shadow-lg space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1c2430] pb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#50d8e9]/20 text-[#50d8e9] font-mono text-xs font-bold flex items-center justify-center border border-[#50d8e9]/30">
                  1
                </span>
                <h3 className="text-base font-bold text-white tracking-wide">
                  Number of Relevant Indexed Publications
                </h3>
              </div>
              <p className="text-xs text-[#7d93ac]">
                Global distribution of 1,420+ peer-reviewed papers cataloged across Web of Science, Scopus, and open literature (2010–2024).
              </p>
            </div>
            <div className="text-xs font-mono text-[#50d8e9] bg-[#142334] px-3 py-1 rounded-md border border-[#50d8e9]/30">
              Total Indexed: {INDEXED_LITERATURE.totalPublications.toLocaleString()} papers
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (7 cols): Alloy Family Breakdown & Annual Growth Trend */}
            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs font-semibold text-white flex items-center justify-between">
                <span>Distribution by Titanium Alloy Family</span>
                <span className="text-[10px] text-[#7189a3] font-mono">Literature Saturation (%)</span>
              </div>

              <div className="space-y-3">
                {INDEXED_LITERATURE.alloyBreakdown.map((item) => (
                  <div key={item.category} className="bg-[#0b0f17] border border-[#192434] p-3 rounded-lg space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-white">{item.category}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-[#50d8e9] font-bold">{item.count} papers</span>
                        <span className="text-[11px] text-[#8ca4be]">({item.pct}%)</span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">{item.growthRate}</span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-[#151c27] overflow-hidden border border-[#1e2a39]">
                      <div
                        className="h-full bg-gradient-to-r from-[#0284c7] to-[#50d8e9] rounded-full transition-all duration-500"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                    <div className="text-[10.5px] text-[#6d849e]">{item.highlightedAlloysOrProcesses}</div>
                  </div>
                ))}
              </div>

              {/* Annual Growth Trend Chart */}
              <div className="bg-[#0b0f17] border border-[#192434] p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white">Annual Publication Trajectory (2012–2024)</span>
                  <span className="text-[10.5px] text-[#50d8e9] font-mono">Exponential +28% CAGR</span>
                </div>

                {/* Visual Bars Container with Fixed Height */}
                <div className="h-32 flex items-end justify-between gap-2.5 pt-2 px-1 border-b border-[#1b2738]">
                  {INDEXED_LITERATURE.annualTrend.map((pt) => {
                    const heightPct = Math.round((pt.count / 476) * 100);
                    return (
                      <div key={pt.year} className="flex-1 h-full flex flex-col items-center justify-end group relative">
                        {/* Hover Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 bg-[#142234] border border-[#50d8e9]/40 text-[#50d8e9] text-[9.5px] font-mono px-1.5 py-0.5 rounded shadow-lg pointer-events-none whitespace-nowrap z-10">
                          {pt.count} pubs ({pt.cumulative} cum.)
                        </div>

                        {/* Top count number */}
                        <div className="text-[10px] font-mono text-[#8ca4be] group-hover:text-white transition-colors mb-1 font-semibold">
                          {pt.count}
                        </div>

                        {/* Explicit-Height Bar Slot */}
                        <div className="w-full h-20 flex items-end justify-center">
                          <div
                            className="w-full max-w-[26px] rounded-t-sm bg-gradient-to-t from-[#0369a1] via-[#0284c7] to-[#50d8e9] group-hover:brightness-125 transition-all shadow-[0_0_8px_rgba(80,216,233,0.3)]"
                            style={{ height: `${Math.max(10, heightPct)}%` }}
                          />
                        </div>

                        {/* Year label */}
                        <div className="text-[10px] font-mono text-[#637d97] group-hover:text-[#50d8e9] mt-1.5 font-bold transition-colors">
                          {pt.year}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#5e7792] font-mono px-1 pt-1">
                  <span>Source: Scopus &amp; Web of Science Indexed (Ti AM)</span>
                  <span className="text-[#50d8e9]">2,382 Cumulative Total</span>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): AM Process Breakdown */}
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-semibold text-white flex items-center justify-between">
                <span>Distribution by Additive Process</span>
                <span className="text-[10px] text-[#7189a3] font-mono">ISO/ASTM 52900</span>
              </div>

              <div className="space-y-3">
                {INDEXED_LITERATURE.processBreakdown.map((item) => (
                  <div key={item.category} className="bg-[#0b0f17] border border-[#192434] p-3 rounded-lg space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-white">{item.category}</span>
                      <span className="font-mono font-bold text-[#50d8e9]">{item.count} ({item.pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#151c27] overflow-hidden border border-[#1e2a39]">
                      <div
                        className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#c084fc] rounded-full transition-all duration-500"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                    <div className="text-[10.5px] text-[#6d849e] flex justify-between">
                      <span>{item.highlightedAlloysOrProcesses}</span>
                      <span className="text-purple-400 font-mono text-[10px]">{item.growthRate}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#0e141f] border border-[#1b2636] p-3.5 rounded-lg text-xs text-[#8ca4be] leading-relaxed space-y-2">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#50d8e9]" />
                  <span>Key Publication Takeaways</span>
                </div>
                <p>
                  Over <strong className="text-white">76.4%</strong> of global literature centers strictly on Ti-6Al-4V in LPBF systems, leaving Near-α (Ti-6242) and metastable β alloys severely under-explored despite critical aerospace and surgical value.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* FEATURE 2: AVAILABLE EXPERIMENTAL DATA */}
      {/* ==================================================================== */}
      {(activeSection === 'all' || activeSection === '2-data') && (
        <section className="bg-[#10141b] border border-[#1e2633] rounded-xl p-5 sm:p-6 shadow-lg space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1c2430] pb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#50d8e9]/20 text-[#50d8e9] font-mono text-xs font-bold flex items-center justify-center border border-[#50d8e9]/30">
                  2
                </span>
                <h3 className="text-base font-bold text-white tracking-wide">
                  Available Experimental Data
                </h3>
              </div>
              <p className="text-xs text-[#7d93ac]">
                Curated experimental database linking published process parameters with measured microhardness, density, tensile strength, and melt pool sizes.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#8ca4be] font-mono">Filterable Database ({filteredRecords.length} records shown)</span>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#5e7792] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search author, alloy, journal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0a0e16] border border-[#1f2b3c] rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#50d8e9]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#5e7792] shrink-0" />
              <select
                value={alloyFilter}
                onChange={(e) => setAlloyFilter(e.target.value)}
                className="w-full bg-[#0a0e16] border border-[#1f2b3c] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#50d8e9] cursor-pointer"
              >
                <option value="all">All Alloy Groups</option>
                <option value="Alpha+Beta">α+β Alloys (Ti-6Al-4V)</option>
                <option value="Near-Alpha">Near-α Alloys (Ti-6242)</option>
                <option value="Beta">Metastable β (Ti-5553)</option>
                <option value="CP Unalloyed">CP Unalloyed Grades 1–4</option>
                <option value="Titanium Aluminide">Intermetallic TiAl</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#5e7792] shrink-0" />
              <select
                value={processFilter}
                onChange={(e) => setProcessFilter(e.target.value)}
                className="w-full bg-[#0a0e16] border border-[#1f2b3c] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#50d8e9] cursor-pointer"
              >
                <option value="all">All Processes</option>
                <option value="PBF-LB">PBF-LB (Laser Powder Bed)</option>
                <option value="PBF-EB">PBF-EB (Electron Beam)</option>
                <option value="DED-LB">DED-LB (Laser Blown Powder)</option>
                <option value="WAAM">WAAM (Wire Arc AM)</option>
              </select>
            </div>
          </div>

          {/* Curated Records Table */}
          <div className="overflow-x-auto rounded-lg border border-[#1e2838]">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#0b1018] text-[#718da9] font-mono border-b border-[#1f2b3c]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Publication</th>
                  <th className="py-2.5 px-3 font-semibold">Alloy &amp; Process</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Power / Speed</th>
                  <th className="py-2.5 px-3 font-semibold text-right">VED</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Exp. HV</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Density</th>
                  <th className="py-2.5 px-3 font-semibold text-right">UTS</th>
                  <th className="py-2.5 px-3 font-semibold">Microstructure / Treatment</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151d2a] bg-[#080c13]">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#101724] transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-white flex items-center gap-1.5">
                        <span>{rec.citation}</span>
                        <a
                          href={`https://doi.org/${rec.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#50d8e9] hover:underline"
                          title={`Open DOI: ${rec.doi}`}
                        >
                          <ExternalLink className="w-3 h-3 inline" />
                        </a>
                      </div>
                      <div className="text-[10px] text-[#637d97] truncate max-w-[180px]">{rec.journal}</div>
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-white">{rec.alloy}</div>
                      <div className="text-[10px] text-[#50d8e9] font-mono">{rec.process}</div>
                    </td>

                    <td className="py-2.5 px-3 font-mono text-right text-white">
                      <div>{rec.laserPowerW} W / {rec.scanSpeedMmS} mm/s</div>
                      {rec.process === 'WAAM' && (
                        <div className="text-[10px] text-[#50d8e9]">{(rec.scanSpeedMmS * 60).toFixed(0)} mm/min</div>
                      )}
                    </td>

                    <td className="py-2.5 px-3 font-mono text-right text-amber-400 font-bold">
                      {rec.vedJmm3} J/mm³
                    </td>

                    <td className="py-2.5 px-3 font-mono text-right text-white font-bold">
                      {rec.measuredHV} HV
                    </td>

                    <td className="py-2.5 px-3 font-mono text-right text-emerald-400">
                      {rec.relativeDensityPct}%
                    </td>

                    <td className="py-2.5 px-3 font-mono text-right text-[#a0b5cd]">
                      {rec.utsMPa ? `${rec.utsMPa} MPa` : '—'}
                    </td>

                    <td className="py-2.5 px-3 text-[11px] text-[#8ca4be] max-w-[220px]">
                      <div className="truncate" title={rec.microstructure}>{rec.microstructure}</div>
                      <div className="text-[10px] text-[#50d8e9] truncate">{rec.heatTreatment}</div>
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      {onApplyParameters && (
                        <button
                          type="button"
                          onClick={() => {
                            const alloyMap: Record<string, string> = {
                              'Ti-6Al-4V': 'ti-6al-4v',
                              'Ti-6Al-4V ELI': 'ti-6al-4v-eli',
                              'Ti Grade 2': 'ti-grade-2',
                              'Ti Grade 4': 'ti-grade-4',
                              'Ti-5553': 'ti-5553',
                              'Ti-6242': 'ti-6242',
                              'Ti-48Al-2Cr-2Nb': 'ti-48al-2cr-2nb',
                            };
                            const mappedId = alloyMap[rec.alloy] || 'ti-6al-4v';
                            const processIdMap: Record<string, string> = {
                              'PBF-LB': 'pbf-laser',
                              'PBF-EB': 'pbf-ebeam',
                              'DED-LB': 'ded-laser',
                              'WAAM': 'waam',
                            };
                            const mappedProcessId = processIdMap[rec.process] || 'pbf-laser';
                            onApplyParameters(
                              rec.laserPowerW,
                              rec.scanSpeedMmS,
                              rec.hatchUm,
                              rec.layerThicknessUm,
                              mappedId,
                              mappedProcessId
                            );
                          }}
                          className="px-2 py-1 rounded bg-[#172739] hover:bg-[#50d8e9] hover:text-[#090d14] text-[#50d8e9] text-[10.5px] font-mono font-bold transition-all border border-[#50d8e9]/40"
                          title="Load this publication's parameters into the active predictor sliders"
                        >
                          Load
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* FEATURE 3: PROCESS PARAMETER RANGES COVERED */}
      {/* ==================================================================== */}
      {(activeSection === 'all' || activeSection === '3-params') && (
        <section className="bg-[#10141b] border border-[#1e2633] rounded-xl p-5 sm:p-6 shadow-lg space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1c2430] pb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#50d8e9]/20 text-[#50d8e9] font-mono text-xs font-bold flex items-center justify-center border border-[#50d8e9]/30">
                  3
                </span>
                <h3 className="text-base font-bold text-white tracking-wide">
                  Process Parameter Ranges Covered
                </h3>
              </div>
              <p className="text-xs text-[#7d93ac]">
                Operating parameter envelopes comprehensively mapped in literature versus boundaries subject to defect formation.
              </p>
            </div>
            <div className="text-xs font-mono text-[#50d8e9] bg-[#142334] px-3 py-1 rounded-md border border-[#50d8e9]/30">
              Corridor: 55–85 J/mm³ (Conduction Window)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROCESS_PARAMETER_RANGES.map((item) => (
              <div key={item.parameter} className="bg-[#0b0f17] border border-[#1a2536] p-4 rounded-xl space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{item.parameter}</span>
                      <span className="text-[11px] text-[#50d8e9] font-mono font-normal">({item.symbol})</span>
                    </div>
                    <div className="text-[10px] text-[#657d97] font-mono">{item.process}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    item.saturationLevel === 'High'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : item.saturationLevel === 'Moderate'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}>
                    {item.saturationLevel} ({item.saturationPct}%)
                  </span>
                </div>

                {/* Range Bar Indicator */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-[#8ca4be]">
                    <span>Min: {item.literatureMin} {item.unit}</span>
                    <span className="text-emerald-400 font-bold">Sweet: {item.sweetSpotMin}–{item.sweetSpotMax}</span>
                    <span>Max: {item.literatureMax} {item.unit}</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#141b26] border border-[#1e2a3a] relative overflow-hidden flex items-center">
                    {/* Sweet spot highlighted band */}
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500/70 to-[#50d8e9]/80 rounded-full"
                      style={{
                        marginLeft: `${((item.sweetSpotMin - item.literatureMin) / (item.literatureMax - item.literatureMin)) * 100}%`,
                        width: `${((item.sweetSpotMax - item.sweetSpotMin) / (item.literatureMax - item.literatureMin)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="text-[10.5px] text-[#7189a3] leading-snug">
                  {item.impactOnDefects}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* FEATURE 4: MECHANICAL PROPERTIES FREQUENTLY REPORTED */}
      {/* ==================================================================== */}
      {(activeSection === 'all' || activeSection === '4-reported') && (
        <section className="bg-[#10141b] border border-[#1e2633] rounded-xl p-5 sm:p-6 shadow-lg space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1c2430] pb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#50d8e9]/20 text-[#50d8e9] font-mono text-xs font-bold flex items-center justify-center border border-[#50d8e9]/30">
                  4
                </span>
                <h3 className="text-base font-bold text-white tracking-wide">
                  Mechanical Properties Frequently Reported
                </h3>
              </div>
              <p className="text-xs text-[#7d93ac]">
                Standardized mechanical metrics with high publication saturation, consensus testing standards, and typical value distributions.
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/30">
              High Saturation: Hardness (92%) &amp; Tensile (86%)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FREQUENTLY_REPORTED_PROPERTIES.map((prop) => (
              <div key={prop.propertyName} className="bg-[#0b0f17] border border-[#1a2536] p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{prop.propertyName}</span>
                      <span className="text-xs font-mono text-[#50d8e9]">({prop.symbol})</span>
                    </div>
                    <div className="text-[10.5px] text-[#718da9] font-mono mt-0.5">{prop.standardTest}</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#142334] text-[#50d8e9] border border-[#50d8e9]/40">
                      {prop.reportingFrequencyPct}% Frequency
                    </span>
                    <div className="text-[9.5px] text-[#6d849e] font-mono mt-0.5">{prop.sampleCount} papers</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#070a10] p-2.5 rounded-lg border border-[#17212e]">
                  <div>
                    <div className="text-[10px] text-[#718da9]">As-Built Range:</div>
                    <div className="text-white font-bold mt-0.5">{prop.typicalRangeAsBuilt}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#718da9]">Heat-Treated Range:</div>
                    <div className="text-emerald-400 font-bold mt-0.5">{prop.typicalRangeHeatTreated}</div>
                  </div>
                </div>

                <p className="text-xs text-[#7d93ac] leading-relaxed">
                  {prop.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* FEATURE 5: PROPERTIES WITH INSUFFICIENT PUBLISHED EVIDENCE (DATA GAPS) */}
      {/* ==================================================================== */}
      {(activeSection === 'all' || activeSection === '5-gaps') && (
        <section className="bg-[#10141b] border border-[#1e2633] rounded-xl p-5 sm:p-6 shadow-lg space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1c2430] pb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 font-mono text-xs font-bold flex items-center justify-center border border-rose-500/30">
                  5
                </span>
                <h3 className="text-base font-bold text-white tracking-wide">
                  Properties with Insufficient Published Evidence (Critical Data Gaps)
                </h3>
              </div>
              <p className="text-xs text-[#7d93ac]">
                Severe blind spots in published literature that create obstacles for aerospace flight qualification and medical device certification.
              </p>
            </div>
            <div className="text-xs font-mono text-rose-400 bg-rose-500/10 px-3 py-1 rounded-md border border-rose-500/30">
              6 Critical Qualification Blind Spots
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INSUFFICIENT_EVIDENCE_PROPERTIES.map((gap) => (
              <div key={gap.id} className="bg-[#0b0f17] border border-rose-950/40 p-4 rounded-xl space-y-3 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div className="text-xs font-bold text-white">{gap.propertyName}</div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    gap.severityLevel === 'Critical'
                      ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  }`}>
                    {gap.severityLevel} Gap ({gap.evidenceCoveragePct}%)
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-[#140b0e] p-2.5 rounded border border-rose-900/30 text-[11px] text-rose-200">
                    <strong className="text-rose-400">Missing Evidence:</strong> {gap.missingPhenomenon}
                  </div>

                  <div className="text-[11px] text-[#8ca4be] space-y-1">
                    <div>
                      <strong className="text-white">Aerospace Impact:</strong> {gap.aerospaceDefenseImpact}
                    </div>
                    {gap.biomedicalImpact !== 'Negligible in surgical applications.' && (
                      <div>
                        <strong className="text-white">Biomedical Impact:</strong> {gap.biomedicalImpact}
                      </div>
                    )}
                  </div>

                  <div className="bg-[#0a121c] p-2.5 rounded border border-[#1b2b3d] text-[11px] text-[#50d8e9]">
                    <strong>Action Required:</strong> {gap.recommendedExperimentalAction}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* FEATURE 6: RESEARCH OPPORTUNITIES */}
      {/* ==================================================================== */}
      {(activeSection === 'all' || activeSection === '6-opportunities') && (
        <section className="bg-[#10141b] border border-[#1e2633] rounded-xl p-5 sm:p-6 shadow-lg space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1c2430] pb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center border border-emerald-500/30">
                  6
                </span>
                <h3 className="text-base font-bold text-white tracking-wide">
                  High-Impact Research Opportunities
                </h3>
              </div>
              <p className="text-xs text-[#7d93ac]">
                Prioritized academic and industrial R&amp;D frontiers with high potential for publication breakthroughs and qualification milestones.
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/30">
              5 High-Impact Priority Frontiers
            </div>
          </div>

          <div className="space-y-4">
            {RESEARCH_OPPORTUNITIES.map((opp, idx) => (
              <div key={opp.id} className="bg-[#0b0f17] border border-[#1a2536] p-4 sm:p-5 rounded-xl space-y-3 hover:border-[#50d8e9]/40 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#15202e] pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-[#132233] text-[#50d8e9] font-mono text-xs font-bold flex items-center justify-center border border-[#50d8e9]/30">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-white tracking-wide">
                      {opp.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#142334] text-[#50d8e9] border border-[#50d8e9]/30">
                      {opp.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      opp.priority.includes('Tier 1')
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : opp.priority.includes('Tier 2')
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                    }`}>
                      {opp.priority}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                  <div className="md:col-span-6 space-y-2">
                    <div>
                      <span className="text-[10px] text-[#718da9] uppercase tracking-wider font-semibold">Potential Industrial &amp; Scientific Impact:</span>
                      <p className="text-[#a0b5cd] leading-relaxed mt-0.5">{opp.potentialImpact}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#718da9] uppercase tracking-wider font-semibold">Suggested Experimental Protocol:</span>
                      <p className="text-[#8ca4be] leading-relaxed mt-0.5">{opp.suggestedExperimentalMethod}</p>
                    </div>
                  </div>

                  <div className="md:col-span-6 space-y-2">
                    <div className="bg-[#0e1622] p-3 rounded-lg border border-[#1c2c3e]">
                      <span className="text-[10px] text-[#50d8e9] uppercase tracking-wider font-semibold">Target Measurable Deliverable:</span>
                      <p className="text-white font-medium leading-relaxed mt-0.5">{opp.targetDeliverable}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-[#6d849e]">Key Anchor Papers:</span>
                      {opp.keyCitations.map((cite) => (
                        <span key={cite} className="px-1.5 py-0.5 rounded bg-[#101723] text-[#8ca4be] text-[10px] font-mono border border-[#1b2636]">
                          {cite}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
