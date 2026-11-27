import subprocess
import json

with open(r"C:\Users\guisn\FabricadorIA-remotion\src\auto\videos\AutoNovaCidadeTempo.json", "r", encoding="utf-8") as f:
    video = json.load(f)

output_dir = r"C:\Users\guisn\OneDrive\Área de Trabalho\Fabricador de Ia\videos\nova_cidade_tempo\frames"
FPS = 30

for i, cena in enumerate(video["cenas"]):
    t = cena["ini"] + (cena["fim"] - cena["ini"]) / 2
    frame = int(round(t * FPS))
    output_file = f"{output_dir}\\frame_{i:03d}.png"
    print(f"Rendering scene {i}: {cena['nome']} at t={t:.2f}s (frame {frame}) -> {output_file}")

    cmd = f'npx remotion still src/index.ts AutoNovaCidadeTempo "{output_file}" --frame={frame}'
    result = subprocess.run(cmd, cwd=r"C:\Users\guisn\FabricadorIA-remotion", capture_output=True, text=True, timeout=120, shell=True)

    if result.returncode == 0:
        print(f"  OK")
    else:
        print(f"  ERROR: {result.stderr[-500:]}")