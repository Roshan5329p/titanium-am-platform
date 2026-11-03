/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Atom, Menu, X } from 'lucide-react';
import { MatSciWorkbench } from './components/MatSciWorkbench';
import { MatSciCommandSections } from './components/MatSciCommandSections';
import { MaterialCompareModal } from './components/MaterialCompareModal';
import { ActiveTab, MatSciPredictor } from './components/MatSciPredictor';
import { SupplementaryDatasetsSection } from './components/SupplementaryDatasetsSection';

export default function App() {
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [activePredictorTab, setActivePredictorTab] = useState<ActiveTab>('predictions');
  const [compareIds, setCompareIds] = useState<string[]>(['ti-6al-4v', 'ti-6al-4v-eli']);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleClearCompare = () => {
    setCompareIds([]);
  };

  const handleSelectMaterialAndScroll = (id: string) => {
    setSelectedMaterialId(id);
    const workbenchEl = document.getElementById('workbench-anchor');
    if (workbenchEl) {
      workbenchEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#070708] text-[#e5e2e3] antialiased selection:bg-[#5E6BFF] selection:text-white">
      {/* Top 3-Zone Navigation Bar (Cinematic Precision) */}
      <header className="sticky top-0 z-40 w-full h-16 bg-[#070708]/90 backdrop-blur-md border-b border-[#232426]">
        <div className="max-w-[1640px] mx-auto h-full px-4 sm:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => {
              setSelectedMaterialId(null);
              handleScrollToSection('workbench-anchor');
            }}
            className="flex items-center gap-2.5 text-left group shrink-0 whitespace-nowrap"
          >
            <Atom className="w-5 h-5 text-[#50d8e9] group-hover:rotate-45 transition-transform duration-300" />
            <span className="font-h3 text-lg font-bold tracking-tight text-white">
              MatSci Navigator
            </span>
          </button>

          {/* Zone 2: Primary Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-[#9A9DA3]">
            <button
              onClick={() => {
                setActivePredictorTab('predictions');
                handleScrollToSection('physics-predictor');
              }}
              className="hover:text-[#50d8e9] transition-colors whitespace-nowrap shrink-0 font-medium flex items-center gap-1"
            >
              <span>Physics Predictor</span>
            </button>
            <button
              onClick={() => {
                setActivePredictorTab('literature-intel');
                handleScrollToSection('physics-predictor');
              }}
              className="hover:text-[#50d8e9] transition-colors whitespace-nowrap shrink-0 font-medium flex items-center gap-1.5"
            >
              <span>Evidence &amp; Gaps</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#50d8e9]/20 text-[#50d8e9] font-mono">6 Insights</span>
            </button>
            <button
              onClick={() => handleScrollToSection('supplementary-datasets')}
              className="hover:text-[#50d8e9] transition-colors whitespace-nowrap shrink-0 font-medium flex items-center gap-1.5"
            >
              <span>Supplementary Datasets</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#50d8e9]/20 text-[#50d8e9] font-mono">275 Records</span>
            </button>
            <button
              onClick={() => handleScrollToSection('workbench-anchor')}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Synthesis Explorer
            </button>
            <button
              onClick={() => handleScrollToSection('telemetry-section')}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Thermal Telemetry
            </button>
            <button
              onClick={() => handleScrollToSection('architecture-section')}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Route Architecture
            </button>
            <button
              onClick={() => handleScrollToSection('insights-section')}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Phase Kinetics
            </button>
          </nav>

          {/* Zone 3: Primary Action & Mobile Hamburger */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-mono-data font-medium bg-[#5E6BFF] text-white rounded-md hover:bg-[#4e5bef] transition-colors whitespace-nowrap shrink-0 shadow-[0_0_20px_rgba(94,107,255,0.28)]"
            >
              Compare Matrix ({compareIds.length})
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 text-[#9A9DA3] hover:text-white rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-[#232426] bg-[#070708]/98 backdrop-blur-xl px-4 py-3 space-y-1.5 shadow-2xl">
            <button
              onClick={() => {
                setActivePredictorTab('predictions');
                handleScrollToSection('physics-predictor');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm text-[#50d8e9] hover:bg-[#50d8e9]/10 font-medium transition-colors flex items-center justify-between"
            >
              <span>Physics Predictor</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#50d8e9]/20 text-[#50d8e9] font-mono">v2.0</span>
            </button>
            <button
              onClick={() => {
                setActivePredictorTab('literature-intel');
                handleScrollToSection('physics-predictor');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm text-[#50d8e9] hover:bg-[#50d8e9]/10 font-medium transition-colors flex items-center justify-between border border-[#50d8e9]/30 bg-[#50d8e9]/10"
            >
              <span className="flex items-center gap-2">
                <span>Evidence &amp; Gaps</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#50d8e9]/30 text-[#50d8e9] font-mono font-bold">6 Insights</span>
              </span>
              <span className="text-[10px] text-[#50d8e9] font-mono">Matrix →</span>
            </button>
            <button
              onClick={() => {
                handleScrollToSection('supplementary-datasets');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm text-[#50d8e9] hover:bg-[#50d8e9]/10 font-medium transition-colors flex items-center justify-between"
            >
              <span>Supplementary Datasets</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#50d8e9]/20 text-[#50d8e9] font-mono">275 Records</span>
            </button>
            <button
              onClick={() => {
                handleScrollToSection('workbench-anchor');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm text-[#9A9DA3] hover:text-white hover:bg-white/5 transition-colors"
            >
              Synthesis Explorer
            </button>
            <button
              onClick={() => {
                handleScrollToSection('telemetry-section');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm text-[#9A9DA3] hover:text-white hover:bg-white/5 transition-colors"
            >
              Thermal Telemetry
            </button>
            <button
              onClick={() => {
                handleScrollToSection('architecture-section');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm text-[#9A9DA3] hover:text-white hover:bg-white/5 transition-colors"
            >
              Route Architecture
            </button>
            <button
              onClick={() => {
                handleScrollToSection('insights-section');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm text-[#9A9DA3] hover:text-white hover:bg-white/5 transition-colors"
            >
              Phase Kinetics
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {/* MatSci Physics & Microstructure Predictor Suite matching reference views */}
        <MatSciPredictor
          initialAlloyId={selectedMaterialId || 'ti-6al-4v'}
          onAlloyChange={(newId) => setSelectedMaterialId(newId)}
          activeTab={activePredictorTab}
          onTabChange={setActivePredictorTab}
        />

        <MatSciWorkbench
          selectedMaterialId={selectedMaterialId}
          onSelectMaterial={setSelectedMaterialId}
          compareIds={compareIds}
          onToggleCompare={handleToggleCompare}
          onOpenCompareModal={() => setIsCompareModalOpen(true)}
          onNavigateArchitecture={() => handleScrollToSection('architecture-section')}
        />

        {/* Dedicated Supplementary Datasets & Empirical Telemetry Repository Section */}
        <SupplementaryDatasetsSection
          onSelectMaterialInWorkbench={handleSelectMaterialAndScroll}
          onApplyParametersToPredictor={(alloyId) => {
            setSelectedMaterialId(alloyId);
            setActivePredictorTab('predictions');
            handleScrollToSection('physics-predictor');
          }}
        />

        <MatSciCommandSections
          onSelectMaterialInWorkbench={handleSelectMaterialAndScroll}
          onOpenCompareModal={() => setIsCompareModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#232426] bg-[#070708] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <Atom className="w-5 h-5 text-[#50d8e9]" />
              <span className="font-h3 text-base font-bold text-white">
                MatSci Navigator
              </span>
            </div>
            <p className="text-xs text-[#9A9DA3] max-w-md">
              Titanium Additive Manufacturing Routes, Creation Parameters &amp; Properties — Covering the 8 ISO/ASTM AM processes with calibrated metallurgical telemetry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono-data text-[#9A9DA3]">
            <button
              onClick={() => handleSelectMaterialAndScroll('ti-6al-4v')}
              className="hover:text-[#50d8e9] transition-colors"
            >
              Ti-6Al-4V (Grade 5)
            </button>
            <button
              onClick={() => handleSelectMaterialAndScroll('ti-6al-4v-eli')}
              className="hover:text-[#50d8e9] transition-colors"
            >
              Ti-6Al-4V ELI (Grade 23)
            </button>
            <button
              onClick={() => handleSelectMaterialAndScroll('ti-grade-2')}
              className="hover:text-[#50d8e9] transition-colors"
            >
              Ti Grade 2 (CP)
            </button>
            <button
              onClick={() => handleSelectMaterialAndScroll('ti-6242')}
              className="hover:text-[#50d8e9] transition-colors"
            >
              Ti-6242 Creep-Resistant
            </button>
            <button
              onClick={() => handleSelectMaterialAndScroll('ti-5553')}
              className="hover:text-[#50d8e9] transition-colors"
            >
              Ti-5553 Near-Beta
            </button>
            <button
              onClick={() => handleSelectMaterialAndScroll('ti-48al-2cr-2nb')}
              className="hover:text-[#50d8e9] transition-colors"
            >
              Gamma TiAl (Intermetallic)
            </button>
            <button
              onClick={() => handleSelectMaterialAndScroll('cfrp')}
              className="hover:text-[#50d8e9] transition-colors"
            >
              CFRP
            </button>
          </div>
        </div>
      </footer>

      {/* Multi-Material Comparison Modal */}
      <MaterialCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        compareIds={compareIds}
        onToggleCompare={handleToggleCompare}
        onClearCompare={handleClearCompare}
        onSelectMaterial={handleSelectMaterialAndScroll}
      />
    </div>
  );
}
