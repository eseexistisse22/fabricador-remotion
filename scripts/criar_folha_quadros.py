#!/usr/bin/env python3
"""Cria FOLHA_QUADROS.jpg a partir dos 18 frames renderizados."""
from PIL import Image, ImageDraw, ImageFont
import os

# Configurações
FRAME_DIR = r"C:\Users\guisn\FabricadorIA-remotion\videos\nova_cidade_tempo"
OUTPUT_PATH = os.path.join(FRAME_DIR, "FOLHA_QUADROS.jpg")
FRAME_PREFIX = "quadro_"
FRAME_EXT = ".png"
NUM_FRAMES = 18

# Grid 3x6
COLS = 3
ROWS = 6

# Escala para a folha (1/3 do original 1080x1920)
THUMB_W = 360
THUMB_H = 640

# Margens e espaçamento
MARGIN = 20
GAP = 10
LABEL_H = 40  # altura para número da cena + texto

# Cores
BG_COLOR = (18, 20, 28)  # fundo escuro estilo Roma
TEXT_COLOR = (240, 240, 240)
ACCENT_COLOR = (217, 166, 58)  # dourado

# Infos das cenas (baseado na TABELA_DE_CENAS_v3.md)
CENAS_INFO = [
    {"num": 0, "molde": "11 Plano aberto", "tempo": "0.0–4.8s", "nome": "praça"},
    {"num": 1, "molde": "7 Céu/evento", "tempo": "4.8–10.5s", "nome": "salto"},
    {"num": 2, "molde": "1 Narrador", "tempo": "10.5–14.7s", "nome": "repetição"},
    {"num": 3, "molde": "7 Céu/evento", "tempo": "14.7–20.2s", "nome": "apagão"},
    {"num": 4, "molde": "11 Plano aberto", "tempo": "20.2–26.3s", "nome": "retorno"},
    {"num": 5, "molde": "6 Viagem", "tempo": "26.3–30.1s", "nome": "trajeto"},
    {"num": 6, "molde": "4 Mesa frente", "tempo": "30.1–37.1s", "nome": "entrega"},
    {"num": 7, "molde": "1 Narrador", "tempo": "37.1–41.5s", "nome": "sacola"},
    {"num": 8, "molde": "4 Mesa frente", "tempo": "41.5–45.3s", "nome": "encontro"},
    {"num": 9, "molde": "1 Narrador", "tempo": "45.3–50.2s", "nome": "horário"},
    {"num": 10, "molde": "6 Viagem", "tempo": "50.2–54.5s", "nome": "foto"},
    {"num": 11, "molde": "1 Narrador", "tempo": "54.5–62.0s", "nome": "esquina"},
    {"num": 12, "molde": "6 Viagem", "tempo": "62.0–67.6s", "nome": "atalho"},
    {"num": 13, "molde": "4 Mesa frente", "tempo": "67.6–72.7s", "nome": "mala"},
    {"num": 14, "molde": "6 Viagem", "tempo": "72.7–79.8s", "nome": "embarque"},
    {"num": 15, "molde": "1 Narrador", "tempo": "79.8–87.6s", "nome": "escolha"},
    {"num": 16, "molde": "12 Escolha", "tempo": "87.6–92.7s", "nome": "escolhas"},
    {"num": 17, "molde": "12 Fim", "tempo": "92.7–98.4s", "nome": "fim"},
]

def main():
    # Carregar frames
    frames = []
    for i in range(NUM_FRAMES):
        path = os.path.join(FRAME_DIR, f"{FRAME_PREFIX}{i:02d}{FRAME_EXT}")
        if os.path.exists(path):
            img = Image.open(path)
            img = img.resize((THUMB_W, THUMB_H), Image.Resampling.LANCZOS)
            frames.append(img)
        else:
            print(f"AVISO: {path} não encontrado")
            # Placeholder
            img = Image.new("RGB", (THUMB_W, THUMB_H), (40, 40, 50))
            frames.append(img)

    # Dimensões da folha
    sheet_w = COLS * THUMB_W + (COLS + 1) * MARGIN
    sheet_h = ROWS * (THUMB_H + LABEL_H) + (ROWS + 1) * MARGIN

    # Criar folha
    sheet = Image.new("RGB", (sheet_w, sheet_h), BG_COLOR)
    draw = ImageDraw.Draw(sheet)

    # Tentar carregar fonte
    try:
        font = ImageFont.truetype("arial.ttf", 16)
        font_bold = ImageFont.truetype("arialbd.ttf", 18)
        font_small = ImageFont.truetype("arial.ttf", 12)
    except:
        font = ImageFont.load_default()
        font_bold = ImageFont.load_default()
        font_small = ImageFont.load_default()

    # Título no topo
    title = "CIDADE DO TEMPO — FOLHA DE QUADROS (18 cenas)"
    title_bbox = draw.textbbox((0, 0), title, font=font_bold)
    title_w = title_bbox[2] - title_bbox[0]
    draw.text(((sheet_w - title_w) // 2, MARGIN // 2), title, fill=ACCENT_COLOR, font=font_bold)

    # Colar frames em grid
    for idx, (frame, info) in enumerate(zip(frames, CENAS_INFO)):
        col = idx % COLS
        row = idx // COLS

        x = MARGIN + col * (THUMB_W + MARGIN)
        y = MARGIN + row * (THUMB_H + LABEL_H + MARGIN) + 30  # +30 para título

        # Colar thumbnail
        sheet.paste(frame, (x, y))

        # Desenhar label
        label_y = y + THUMB_H + 4
        label_text = f"Cena {info['num']:02d}  |  {info['molde']}  |  {info['tempo']}  |  {info['nome']}"
        draw.text((x, label_y), label_text, fill=TEXT_COLOR, font=font_small)

    # Salvar
    sheet.save(OUTPUT_PATH, "JPEG", quality=90)
    print(f"FOLHA_QUADROS.jpg criada: {OUTPUT_PATH}")
    print(f"Dimensões: {sheet_w}x{sheet_h}")

if __name__ == "__main__":
    main()