# OtoDecks (JUCE)

Two-deck music player / DJ-style prototype built with JUCE (C++).

Demo video: <https://drive.google.com/file/d/1c7z3S-vMZf0EUN5hVlC7_6Qfe8wZig00/view?usp=sharing>

## Features
- Dual decks with transport controls (Play / Pause / Stop)
- Cueing
- Track loading
- Basic UI for deck controls (gain/volume/seek as implemented)

---

## Build & Run (Windows)

This is a JUCE C++ GUI application. You don’t run the `.jucer` file directly.
Use Projucer to generate a Visual Studio solution, then build and run it.

### Prerequisites
- Windows 10/11
- Visual Studio Community 2022 (or later) with:
  - Workload: Desktop development with C++
  - MSVC toolset + Windows 10/11 SDK
- JUCE 6.x (Projucer included under `JUCE/extras/Projucer/`)

### 1) Download JUCE
1. Download JUCE and extract it somewhere, e.g.:
   `C:\Dev\JUCE\juce-6.1.6\`
2. Confirm the modules folder exists:
   `C:\Dev\JUCE\juce-6.1.6\JUCE\modules`

### 2) Build Projucer (first-time setup)
1. Open in Visual Studio:
   `C:\Dev\JUCE\juce-6.1.6\JUCE\extras\Projucer\Builds\VisualStudio2022\Projucer.sln`
2. Set:
   - Configuration: Release
   - Platform: x64
3. Build, then run `Projucer.exe` (typically in `x64\Release\`).

### 3) Generate project files for this repo
1. Open `OtoDecks.jucer` in Projucer.
2. Set the JUCE modules path:
   - Projucer → File → Global Paths…
   - Path to JUCE Modules:
     `C:\Dev\JUCE\juce-6.1.6\JUCE\modules`
3. Ensure the Visual Studio 2022 exporter is enabled.
4. Click Save Project.

This will generate a solution file like:
`Builds\VisualStudio2022\OtoDecks.sln`

### 4) Build and run
1. Open:
   `Builds\VisualStudio2022\OtoDecks.sln`
2. Set:
   - Configuration: Debug
   - Platform: x64
3. Set `OtoDecks` as the Startup Project.
4. Press F5 to build and run.

---

## Troubleshooting
- If Projucer reports missing modules, re-check:
  Projucer → File → Global Paths… → Path to JUCE Modules
- If `Builds/` is missing, you likely haven’t saved the project in Projucer yet.