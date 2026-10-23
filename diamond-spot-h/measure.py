#!/usr/bin/env python3
"""Measures where the piece sits in every tile square (assets/p/*-t.webp) and writes data/bbox.json:
{image key: [x0, y0, x1, y1]} as fractions of the square. build.py turns it into one scale per piece, so a pair of studs,
a necklace and a ring read at one size on the shelf. Needs Pillow: uv run -q --with pillow python3 -I measure.py"""
import glob, json, os
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
out = {}
for f in sorted(glob.glob(os.path.join(ROOT, 'assets/p/*-t.webp'))):
    key = os.path.basename(f)[:-7]
    if key.endswith('-w'): continue  # worn thumbs (*-wt.webp are not matched, but be safe)
    im = Image.open(f).convert('L')
    w, h = im.size
    # ink = anything clearly darker than the white ground; soft shadow under the piece (> 236) does not count
    # the outer 2 % is ignored: two necklace squares carry a grey speck in a corner from their crop
    e = round(w * .02)
    box = im.crop((e, e, w - e, h - e)).point(lambda v: 255 if v < 236 else 0).getbbox()
    out[key] = [round((box[0] + e) / w, 4), round((box[1] + e) / h, 4), round((box[2] + e) / w, 4), round((box[3] + e) / h, 4)] if box else [.18, .18, .82, .82]
json.dump(out, open(os.path.join(ROOT, 'data/bbox.json'), 'w'), indent=0, sort_keys=True)
print(len(out), 'squares measured')
