# AI Creatures (PyBullet)

Evolutionary “creatures” experiment where simple randomly generated bodies learn
to move via a genetic algorithm. Includes playback/viewer scripts that render
saved elite runs from CSV.

Demo video: <https://drive.google.com/file/d/19FTy6DhbWJja395a2VL3wsxdIpQHvmvW/view?usp=sharing>


## How to run (Windows)

### Prerequisites
- Windows 10/11
- Python 3.11 (64-bit) recommended
  - If typing `python` opens the Microsoft Store, disable Windows “App execution
    aliases” for `python.exe` / `python3.exe`:
    Settings → Apps → App execution aliases.
- (Optional) Updated GPU drivers (PyBullet GUI)

### 1) Open PowerShell in this folder
In File Explorer, open the `AI-creatures` project folder, click the address bar,
type `powershell`, press Enter.

### 2) Create a virtual environment (first time only)
```powershell
py -V:3.11 -m venv .venv
```

### 3) Install dependencies (first time only, or when deps change)
```powershell
.\.venv\Scripts\python.exe -m pip install --upgrade pip setuptools wheel
.\.venv\Scripts\python.exe -m pip install numpy pybullet
```

### 4) Run a viewer / playback script
The viewer scripts take a CSV filename argument (elite run playback).

List available CSV files:
```powershell
dir *.csv
```

Run a viewer (replace the CSV filename with one from the list):
```powershell
.\.venv\Scripts\python.exe viewer_angle1.py "elite_popsize64_r0_i199_f20.054968648775.csv"
```

Other available viewers (same usage):
```powershell
.\.venv\Scripts\python.exe viewer_angle2.py "your_file.csv"
.\.venv\Scripts\python.exe viewer_angle3.py "your_file.csv"
.\.venv\Scripts\python.exe viewer_angle4.py "your_file.csv"
.\.venv\Scripts\python.exe viewer_rotate_left.py "your_file.csv"
.\.venv\Scripts\python.exe viewer_rotate_right.py "your_file.csv"
```

### (Optional) Run tests
```powershell
.\.venv\Scripts\python.exe -m unittest -v
```


## Common errors

### `ModuleNotFoundError: No module named 'numpy'`
Install dependencies into the venv:
```powershell
.\.venv\Scripts\python.exe -m pip install numpy pybullet
```

### Script says you need a CSV filename argument
You must pass a CSV filename:
```powershell
.\.venv\Scripts\python.exe viewer_angle1.py "elite_popsize16_r0_i873_f10.74349527698206_walking_wheel"
```

### “Tried to load <file> but it does not exist”
- Make sure you’re running commands from the project folder, and
- Use the exact CSV filename shown by `dir *.csv` (or pass a full path).
```