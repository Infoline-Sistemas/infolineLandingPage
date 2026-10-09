#!/usr/bin/env python3
"""
Gera as versões otimizadas das imagens (AVIF + WebP, várias larguras) a partir
dos PNGs originais. Uso:  python3 tools/images.py <pasta-com-originais> <saida>
Os originais NÃO fazem parte do site publicado (ficam só como matriz).
"""
import sys, os
from PIL import Image

SRC = sys.argv[1] if len(sys.argv) > 1 else 'tools/source-images'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'assets/img'
os.makedirs(OUT, exist_ok=True)

# nome final -> (arquivo original, larguras, recorte opcional (l,t,r,b))
JOBS = {
  'reality-atacado-v2':     ('reality/atacado-v2.png',     [480, 800, 1100], None),
  'reality-empresarial-v2': ('reality/empresarial-v2.png', [480, 800, 1100], None),
  'reality-importadores-v2':('reality/importadores-v2.png',[480, 800, 1100], None),
  'reality-industrial-v2':  ('reality/industrial-v2.png',  [480, 800, 1100], None),
}

manifest = {}
for name, (src, widths, crop) in JOBS.items():
    im = Image.open(os.path.join(SRC, src)).convert('RGB')
    if crop: im = im.crop(crop)
    manifest[name] = {'w': [], 'ratio': im.size}
    for w in widths:
        if w > im.width: continue
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS)
        r.save(f'{OUT}/{name}-{w}.webp', 'WEBP', quality=72, method=6)
        r.save(f'{OUT}/{name}-{w}.avif', 'AVIF', quality=48, speed=6)
        manifest[name]['w'].append(w)
    print(name, manifest[name]['w'], im.size)

import json
json.dump(manifest, open(os.path.join(os.path.dirname(OUT.rstrip('/')) or '.', 'images.manifest.json'), 'w'))
