import shapefile, math
import Image, ImageDraw
import argparse
import numpy.random as np

def pointToPentagone(x, y, r):
  dot = []
  for i in list(range(5)):
    i = math.radians(i * 72 + 90)
    dot.append([int(r * math.cos(i)) + x, int(r * math.sin(i)) + y])
  close = dot[0]
  dot.append(close)
  return dot


def getRandomColor():
  return str(np.random_integers(75, 240))


def process(r):
  iwidth = args['width']
  xys = []
  xy = []
  for shape in r.shapes():
    if shape.shapeType == 1:
      x,y = shape.points[0]
      penta = pointToPentagone(x, y, 10)
      for x,y in penta:
        xy.append((x,y))
      xys.append(xy)

    else:
      for x,y in shape.points:
        xy.append((x,y))
      xys.append(xy)
    xy = []

  bbox = r.bbox
  xdist = bbox[2] - bbox[0]
  ydist = bbox[3] - bbox[1]
  ratio=xdist/ydist
  iheight = int(iwidth/ratio)
  xratio = iwidth/xdist
  yratio = iheight/ydist

  img = Image.new("RGB", (iwidth, iheight), "white")
  transparent_area = (0,0,iwidth,iheight)

  mask=Image.new('L', (iwidth, iheight), color=255)
  draw=ImageDraw.Draw(mask)
  draw.rectangle(transparent_area, fill=0)
  img.putalpha(mask)

  draw = ImageDraw.Draw(img)

  for pts in xys:
    pixels2 = []
    for x,y in pts:
      px = int(iwidth - ((bbox[2] - x) * xratio))
      py = int((bbox[3] - y) * yratio)
      pixels2.append((px,py))
    draw.polygon(pixels2, outline=args['stroke'], fill=args['fill'])

  img.save(args['input']+".png")

parser = argparse.ArgumentParser(description="Produce .png image from shapefile. Optionally filter by attribute value(s).")
parser.add_argument('input' ,help='input filename (without .shp)')
parser.add_argument('-w', '--width', type=int, default=360)
parser.add_argument('--stroke', type=str, default='rgb(255, 255, 255)', help="polygon stroke color. defaults to \"rgb(255, 255, 255)\"")

args = vars(parser.parse_args())

myshp = open(args['input']+".shp", "rb")
mydbf = open(args['input']+".dbf", "rb")
r = shapefile.Reader(shp=myshp, shx=None, dbf=mydbf)

args['fill'] = "rgb(" + getRandomColor() + ',' + getRandomColor() + ',' + getRandomColor() + ')'
process(r)
