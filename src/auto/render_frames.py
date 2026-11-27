import subprocess
import json

with open("C:/Users/guisn/FabricadorIA-remotion/src/auto/videos/AutoNovaCidadeTempo.json", "r", encoding="utf-8") as f:
    video = json.load(f)

output_dir = "C:/Users/guisn/OneDrive/Área de Trabalho/Fabricador de Ia/videos/nova_cidade_tempo/frames"

for i, cena in enumerate(video["cenas"]):
    t = cena["ini"] + (cena["fim"] - cena["ini"]) / 2
    output_file = f"{output_dir}/frame_{i:03d}.png"
    print(f"Rendering scene {i}: {cena['nome']} at t={t:.2f}s -> {output_file}")

    result = subprocess.run([
        "npx", "remotion", "still", "src/index.ts", "AutoNovaCidadeTempo", output_file, f"--frame={t}"
    ], cwd="C:/Users/guisn/FabricadorIA-remotion", capture_output=True, text=True, timeout=120)

    if result.returncode == 0:
        print(f"  OK")
    else:
        print(f"  ERROR: {result.stderr[-500:]}")