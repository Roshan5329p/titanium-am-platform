// State
let allMaterials = [];
let selectedMaterial = null;
let selectedVariant = null;
let activeCategory = '';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const categoryFilters = document.getElementById('categoryFilters');
const materialsList = document.getElementById('materialsList');
const resultsCount = document.getElementById('resultsCount');

const emptyState = document.getElementById('emptyState');
const detailContent = document.getElementById('detailContent');

const detailMaterialId = document.getElementById('detailMaterialId');
const detailClass = document.getElementById('detailClass');
const detailSubclass = document.getElementById('detailSubclass');
const detailTitle = document.getElementById('detailTitle');
const variantSelect = document.getElementById('variantSelect');

// Recipe elements
const recipeProcessName = document.getElementById('recipeProcessName');
const recipeSummary = document.getElementById('recipeSummary');
const recipeAtmosphere = document.getElementById('recipeAtmosphere');
const recipeEquipment = document.getElementById('recipeEquipment');
const paramsTableBody = document.getElementById('paramsTableBody');
const procedureStepsList = document.getElementById('procedureStepsList');

// Property Grids
const gridMechanical = document.getElementById('gridMechanical');
const gridThermal = document.getElementById('gridThermal');
const gridElectronic = document.getElementById('gridElectronic');
const gridDurability = document.getElementById('gridDurability');
const comparisonTable = document.getElementById('comparisonTable');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadMetadata();
    loadMaterials();
    setupEventListeners();
});

function setupEventListeners() {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();
        clearSearch.style.display = query ? 'block' : 'none';
        debounceTimer = setTimeout(() => {
            loadMaterials(query, activeCategory);
        }, 200);
    });

    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        clearSearch.style.display = 'none';
        loadMaterials('', activeCategory);
        searchInput.focus();
    });

    categoryFilters.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-pill');
        if (!btn) return;
        document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.class;
        loadMaterials(searchInput.value.trim(), activeCategory);
    });

    variantSelect.addEventListener('change', (e) => {
        const variantId = e.target.value;
        if (selectedMaterial && selectedMaterial.variants) {
            const v = selectedMaterial.variants.find(item => item.variantId === variantId);
            if (v) renderVariantDetail(v);
        }
    });
}

async function loadMetadata() {
    try {
        const res = await fetch('/api/metadata');
        if (res.ok) {
            const data = await res.json();
            document.getElementById('stat-materials').textContent = data.totalMaterials || 108;
            document.getElementById('stat-variants').textContent = data.totalVariants || 320;
        }
    } catch (e) {
        console.warn('Metadata fetch error:', e);
    }
}

async function loadMaterials(query = '', category = '') {
    resultsCount.textContent = 'Searching...';
    try {
        let url = `/api/search?q=${encodeURIComponent(query)}&class=${encodeURIComponent(category)}`;
        const res = await fetch(url);
        const variants = await res.json();

        // Group variants by materialId
        const materialMap = new Map();
        for (const v of variants) {
            if (!materialMap.has(v.materialId)) {
                materialMap.set(v.materialId, {
                    materialId: v.materialId,
                    name: v.name,
                    materialClass: v.materialClass,
                    subclass: v.subclass,
                    variants: []
                });
            }
            materialMap.get(v.materialId).variants.push(v);
        }

        const materials = Array.from(materialMap.values());
        renderMaterialsList(materials);
        resultsCount.textContent = `${materials.length} material${materials.length === 1 ? '' : 's'} (${variants.length} process variants)`;
    } catch (err) {
        console.error('Error loading materials:', err);
        resultsCount.textContent = 'Error connecting to server';
    }
}

function renderMaterialsList(materials) {
    materialsList.innerHTML = '';
    if (materials.length === 0) {
        materialsList.innerHTML = '<div style="padding: 1rem; color: var(--text-muted); font-size: 0.85rem;">No matching materials found. Try searching by alloy name, polymer, ceramic, or process.</div>';
        return;
    }

    materials.forEach((mat) => {
        const card = document.createElement('div');
        card.className = 'material-card';
        if (selectedMaterial && selectedMaterial.materialId === mat.materialId) {
            card.classList.add('active');
        }

        // Distinct routes list
        const routes = [...new Set(mat.variants.map(v => v.processRoute))].slice(0, 3);
        const routeTags = routes.map(r => `<span class="route-tag">${escapeHtml(r)}</span>`).join('');
        const moreTag = mat.variants.length > 3 ? `<span class="route-tag">+${mat.variants.length - 3} more</span>` : '';

        card.innerHTML = `
            <div class="card-top-row">
                <span class="card-title">${escapeHtml(mat.name)}</span>
                <span class="card-category-badge">${escapeHtml(mat.materialClass)}</span>
            </div>
            <div class="card-subclass">${escapeHtml(mat.subclass)} • <strong style="color:var(--accent-blue)">${mat.variants.length} process route${mat.variants.length === 1 ? '' : 's'}</strong></div>
            <div class="card-routes-tags">
                ${routeTags} ${moreTag}
            </div>
        `;

        card.addEventListener('click', () => {
            selectMaterial(mat.materialId);
        });

        materialsList.appendChild(card);
    });
}

async function selectMaterial(materialId) {
    document.querySelectorAll('.material-card').forEach(c => c.classList.remove('active'));
    
    try {
        const res = await fetch(`/api/materials/${materialId}`);
        if (!res.ok) throw new Error('Material not found');
        selectedMaterial = await res.json();

        // Highlight active card in list
        const cards = materialsList.children;
        for (let card of cards) {
            if (card.querySelector('.card-title')?.textContent === selectedMaterial.name) {
                card.classList.add('active');
            }
        }

        renderMaterialDetail(selectedMaterial);
    } catch (e) {
        console.error('Error selecting material:', e);
    }
}

function renderMaterialDetail(material) {
    emptyState.style.display = 'none';
    detailContent.style.display = 'flex';

    detailMaterialId.textContent = material.materialId;
    detailClass.textContent = material.materialClass;
    detailSubclass.textContent = material.subclass;
    detailTitle.textContent = material.name;

    // Populate variant select dropdown
    variantSelect.innerHTML = '';
    material.variants.forEach((v) => {
        const opt = document.createElement('option');
        opt.value = v.variantId;
        opt.textContent = `${v.processRoute} → [${v.postTreatment}]`;
        variantSelect.appendChild(opt);
    });

    if (material.variants.length > 0) {
        variantSelect.value = material.variants[0].variantId;
        renderVariantDetail(material.variants[0]);
    }

    renderComparisonTable(material.variants);
}

function renderVariantDetail(variant) {
    selectedVariant = variant;

    // Recipe & Creation Parameters
    const recipe = variant.recipe || {};
    recipeProcessName.textContent = `${variant.processRoute} • Condition: ${variant.postTreatment}`;
    recipeSummary.textContent = recipe.summary || 'Standard manufacturing process.';
    recipeAtmosphere.textContent = recipe.atmosphere || 'Standard atmosphere';
    recipeEquipment.textContent = recipe.standardEquipment || 'Industrial manufacturing equipment';

    // Parameters Table
    paramsTableBody.innerHTML = '';
    if (recipe.parameters && recipe.parameters.length > 0) {
        recipe.parameters.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span class="param-category-tag">${escapeHtml(p.category)}</span></td>
                <td><strong>${escapeHtml(p.name)}</strong></td>
                <td><span class="param-value">${escapeHtml(p.value)}</span></td>
                <td><span class="param-unit">${escapeHtml(p.unit)}</span></td>
                <td><span class="param-desc">${escapeHtml(p.description)}</span></td>
            `;
            paramsTableBody.appendChild(tr);
        });
    } else {
        paramsTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">Standard process parameters apply.</td></tr>';
    }

    // Procedure Steps
    procedureStepsList.innerHTML = '';
    if (recipe.processSteps && recipe.processSteps.length > 0) {
        recipe.processSteps.forEach(s => {
            const li = document.createElement('li');
            li.textContent = s;
            procedureStepsList.appendChild(li);
        });
    } else {
        procedureStepsList.innerHTML = '<li>Step-by-step procedure verified according to standard industrial practices.</li>';
    }

    // Render Properties Grids
    renderPropertiesGrid(gridMechanical, variant.mechanicalProperties, {
        density: 'Density',
        youngsModulus: "Young's Modulus",
        yieldStrength: 'Yield Strength',
        ultimateTensileStrength: 'Tensile Strength (UTS)',
        elongationAtBreak: 'Elongation at Break',
        hardnessVickers: 'Vickers Hardness',
        hardnessShoreD: 'Shore D Hardness',
        fractureToughness: 'Fracture Toughness (KIC)',
        poissonsRatio: "Poisson's Ratio",
        compressiveStrength: 'Compressive Strength',
        flexuralStrength: 'Flexural Strength',
        fatigueStrength: 'Fatigue Strength (10⁷ cycles)',
        charpyImpactEnergy: 'Charpy Impact',
        notchedIzodImpact: 'Notched Izod Impact'
    });

    renderPropertiesGrid(gridThermal, variant.thermalProperties, {
        thermalConductivity: 'Thermal Conductivity',
        thermalExpansionCoeff: 'Thermal Expansion (CTE)',
        meltingOrSofteningPoint: 'Melting / Softening Point',
        specificHeat: 'Specific Heat Capacity',
        maxServiceTemperature: 'Max Service Temp'
    });

    renderPropertiesGrid(gridElectronic, { ...variant.electricalProperties, ...variant.opticalProperties }, {
        electricalResistivity: 'Electrical Resistivity',
        dielectricConstant: 'Dielectric Constant',
        bandGap: 'Bandgap',
        refractiveIndex: 'Refractive Index',
        visibleTransmittance: 'Visible Transmittance',
        visibleReflectance: 'Visible Reflectance'
    });

    renderPropertiesGrid(gridDurability, variant.durabilityProperties, {
        corrosionResistanceRating: 'Corrosion Resistance Rating'
    });
}

function renderPropertiesGrid(container, propMap, labelMap) {
    container.innerHTML = '';
    if (!propMap || Object.keys(propMap).length === 0) {
        container.innerHTML = '<span style="color:var(--text-muted); font-size: 0.8rem;">No experimental values reported for this category.</span>';
        return;
    }

    for (const [key, label] of Object.entries(labelMap)) {
        if (propMap[key] != null) {
            const item = propMap[key];
            const tile = document.createElement('div');
            tile.className = 'property-tile';

            let formattedVal = item.value;
            if (typeof formattedVal === 'number') {
                if (Math.abs(formattedVal) < 0.001 || Math.abs(formattedVal) > 100000) {
                    formattedVal = formattedVal.toExponential(3);
                } else if (Number.isInteger(formattedVal)) {
                    formattedVal = formattedVal.toString();
                } else {
                    formattedVal = formattedVal.toFixed(2);
                }
            }

            tile.innerHTML = `
                <span class="prop-name">${escapeHtml(label)}</span>
                <div class="prop-value-row">
                    <span class="prop-num">${escapeHtml(formattedVal)}</span>
                    <span class="prop-unit">${escapeHtml(item.unit)}</span>
                </div>
            `;
            container.appendChild(tile);
        }
    }
}

function renderComparisonTable(variants) {
    if (!variants || variants.length <= 1) {
        document.getElementById('comparisonSection').style.display = 'none';
        return;
    }
    document.getElementById('comparisonSection').style.display = 'block';

    let html = `
        <thead>
            <tr>
                <th>Process Route</th>
                <th>Condition</th>
                <th>Density (g/cm³)</th>
                <th>Yield Strength (MPa)</th>
                <th>Tensile Strength (MPa)</th>
                <th>Elongation (%)</th>
                <th>Hardness</th>
            </tr>
        </thead>
        <tbody>
    `;

    variants.forEach(v => {
        const isCurrent = selectedVariant && selectedVariant.variantId === v.variantId;
        const rowStyle = isCurrent ? 'background: rgba(56, 189, 248, 0.08); font-weight: 600;' : '';
        const density = v.mechanicalProperties?.density?.value?.toFixed(2) || '—';
        const ys = v.mechanicalProperties?.yieldStrength?.value?.toFixed(1) || '—';
        const uts = v.mechanicalProperties?.ultimateTensileStrength?.value?.toFixed(1) || '—';
        const elong = v.mechanicalProperties?.elongationAtBreak?.value?.toFixed(1) || '—';
        const hardness = v.mechanicalProperties?.hardnessVickers?.value?.toFixed(0) ? v.mechanicalProperties.hardnessVickers.value.toFixed(0) + ' HV' :
                         (v.mechanicalProperties?.hardnessShoreD?.value?.toFixed(0) ? v.mechanicalProperties.hardnessShoreD.value.toFixed(0) + ' Shore D' : '—');

        html += `
            <tr style="${rowStyle}">
                <td><strong style="color:var(--text-primary)">${escapeHtml(v.processRoute)}</strong></td>
                <td><span class="param-category-tag">${escapeHtml(v.postTreatment)}</span></td>
                <td>${density}</td>
                <td style="color:var(--accent-blue)">${ys}</td>
                <td>${uts}</td>
                <td>${elong}</td>
                <td>${hardness}</td>
            </tr>
        `;
    });

    html += '</tbody>';
    comparisonTable.innerHTML = html;
}

function quickSearch(term) {
    searchInput.value = term;
    clearSearch.style.display = 'block';
    loadMaterials(term, activeCategory);
}

function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
