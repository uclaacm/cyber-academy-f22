#!/usr/bin/python
from PIL import Image
import sys

def setPixel(char, pixel):
  r = format(pixel[0], "08b")
  g = format(pixel[1], "08b")
  b = format(pixel[2], "08b")
  ch = format(ord(char), "08b")
  rn = r[:5] + ch[:3]
  gn = g[:5] + ch[3:6]
  bn = b[:6] + ch[6:]
  pixel = (int(rn,2),int(gn,2),int(bn,2))
  return pixel

def encode(secret, file, out):
  image = Image.open(file)
  pixels = image.load()
  i = 0
  j = 0
  index = 0
  while i < image.size[0] and index < len(secret):
    while j < image.size[1] and index < len(secret):
      pixels[i,j] = setPixel(secret[index], pixels[i,j])
      index+=1
      j+=1
    i+=1
  image.save(out)

if __name__ == "__main__":
  secret = sys.argv[1]
  file = sys.argv[2]
  out = sys.argv[3]
  encode(secret, file, out)