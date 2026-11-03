# MatSci Platform — Titanium Additive Manufacturing Intelligence

A high-performance materials informatics, additive manufacturing (AM), and process synthesis intelligence platform built in **pure Java** with zero external runtime dependencies and a **replicated cinematic React command dashboard**.

---

## What the Platform Delivers

For any titanium alloy designation or variant (e.g. `Ti-6Al-4V (Grade 5)`, `Ti-6Al-4V ELI (Grade 23)`, `Ti Grade 2 (CP)`, `Ti-6242`, `Ti-5553`, `Ti-48Al-2Cr-2Nb gamma-TiAl`):

0. **Custom Alloy Check**: Enter nominal alloying-element weight percentages, titanium balance, feedstock purities, target batch mass, and a proposed melting or additive-manufacturing process plan. The dashboard calculates theoretical feedstock charges and compares the composition with a small set of nominal reference formulas. This is an estimate only, not a certified specification or validated manufacturing recipe.
1. **Manufacturing & AM Process Routes**:
   - ISO/ASTM 52900 Additive Manufacturing categories: *Laser Powder Bed Fusion (L-PBF / SLM / DMLS)*, *Electron Beam PBF (EB-PBF / EBM)*, *Laser Powder DED (LENS)*, *Wire DED (Laser / EB)*, *Wire Arc AM (WAAM - GTAW & Plasma)*, *Binder Jetting + Sinter*, *Metal Filament Extrusion (FFF) + Sinter*, *Vat Photopolymerization (SLA/DLP) + Sinter*, and *Ultrasonic AM (UAM)*.
2. **Parameters of Creation & Standard Procedures**:
   - Synthesis temperatures (melt zones, bed preheat temps, transus boundaries), laser powers (175–3500 W), beam acceleration voltages (60 kV), scan speeds (800–1400 mm/s), build rates (cm³/h), protective atmospheres (Argon O₂ < 50 ppm, high vacuum < 10⁻⁴ mbar with Helium bleed), and equipment specifications.
3. **Comprehensive Metallurgical Profile (42 Quantitative Metrics)**:
   - **Mechanical**: Tensile strength (UTS), 0.2% yield strength, Young's modulus, elongation at break, Vickers hardness (HV), fracture toughness ($K_{IC}$), Poisson's ratio, $10^7$ cycle fatigue strength, Charpy impact energy, damping loss factor, longitudinal acoustic wave speed.
   - **Thermal & Phase Transitions**: Liquidus temperature, $\beta$-transus temperature, maximum service temperature, thermal conductivity, coefficient of thermal expansion (CTE), specific heat ($C_p$), hemispherical emissivity.
   - **Additive Quality Telemetry**: Relative density (%), porosity (%), surface roughness ($R_a$), maximum internal residual stress (MPa), build direction anisotropy, minimum feature size (mm), dimensional accuracy, volumetric build rate ($cm^3/h$).
   - **Durability & Electro-Optical**: Corrosion resistance rating (1–5), biocompatibility rating (1–5), interstitial oxygen content (wt. %), electrical resistivity ($\Omega\cdot m$), volume magnetic susceptibility ($10^{-6}$ SI), laser absorptivity at 1070 nm, polished visible reflectance.
4. **Cross-Condition Treatment Matrix**:
   - Comparison across *As-built*, *Stress-relieved*, *Hot Isostatic Pressing (HIP)*, *Annealed*, and *Solution-Treated & Aged (STA)* states.

---

## The Replicated Dashboard (from aee6b6f5-d066-4dff-8cc6-cb805a2f6b53)

The cinematic **MatSci Command Dashboard** is deployed and running locally:
- **Location**: `dashboard/` (React 19 + TypeScript + Vite + Tailwind CSS v4 + Lucide Icons + Motion)
- **Built Assets**: Deployed to `web/` and served directly by the Java backend at **[http://localhost:8080](http://localhost:8080)**.
- **Vite Dev Server**: Can also be run on **[http://localhost:3000](http://localhost:3000)** via `run-dashboard.bat`.

---

## Quick Start

### 1. Launch Platform (Port 8080)
Double-click `run.bat` or in PowerShell:
```powershell
.\run.ps1
```
Open browser: 👉 **[http://localhost:8080](http://localhost:8080)**

### 2. Hot-Reloading React Dev Server (Port 3000)
Double-click `run-dashboard.bat` or run:
```cmd
cd dashboard
npm.cmd run dev
```
Open browser: 👉 **[http://localhost:3000](http://localhost:3000)**

---

## REST JSON API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/metadata` | `GET` | Summary of alloys (20), total AM variants (275), and ISO/ASTM categories |
| `/api/materials` | `GET` | List all 20 Titanium alloys with property envelopes |
| `/api/materials/{alloyId}` | `GET` | Detailed record for an alloy with all 8–29 process variants |
| `/api/variants/{variantId}` | `GET` | Single AM variant with 42 metrics and enriched ASTM synthesis recipe |
| `/api/search?q={query}` | `GET` | Full-text search across alloys, AM processes, and heat treatments |
| `/api/compare?ids={id1,id2}` | `GET` | Side-by-side comparative matrix of up to 12 variants |
| `/api/stats` | `GET` | Persistent project visits, today's visits, and prediction counts |
| `/api/stats/visit` | `POST` | Record a dashboard page visit |
| `/api/stats/prediction` | `POST` | Record a completed live or inverse-design prediction |

Usage counts start at zero when `data/usage-stats.properties` is first created and persist across server restarts. Visits count dashboard page loads, not unique people; today's count resets at local server midnight. Live prediction recalculations and inverse-design runs increment the prediction count.

### Example Queries
- `http://localhost:8080/api/search?q=Ti-6Al-4V`
- `http://localhost:8080/api/variants/TIV-00077` (Ti-64 As-built LPBF)
- `http://localhost:8080/api/variants/TIV-00079` (Ti-64 HIP LPBF)
- `http://localhost:8080/api/compare?ids=TIV-00077,TIV-00079`

---

## Failsafe Security & Defense Controls (OWASP Aligned)

1. **Strict Path Traversal Protection**: Canonical path resolution guarantees zero access outside the `web/` directory. Direct requests for `.class`, `.java`, `.bat`, `.csv`, `.db`, or `.git` files return `404 Not Found`.
2. **Defensive Input Validation & Sanitization**: Query strings are length-bounded (128 characters max) with control-character stripping. IDs are verified against strict alphanumeric regex patterns (`^[A-Za-z0-9\-_]+$`). Compare IDs are capped at 12 items.
3. **HTTP Verb & CORS Hardening**: Disallows non-GET/OPTIONS mutations with clean 405 responses.
4. **OWASP Security Headers**:
   - `Content-Security-Policy`: Strict boundary locking scripts, styles, and fonts.
   - `X-Frame-Options: DENY`: Prevents clickjacking and UI redressing.
   - `X-Content-Type-Options: nosniff`: Defeats MIME-confusion attacks.
   - `X-XSS-Protection: 1; mode=block`: Activates browser reflected XSS defenses.
   - `Permissions-Policy`: Restricts camera, microphone, and geolocation.
   - `Server: MatSci-Engine/1.0 (Secured)`: Masks underlying Java / OS runtime version.
   - `Cache-Control: no-store, no-cache`: Prevents sensitive data leakage in public proxies.
