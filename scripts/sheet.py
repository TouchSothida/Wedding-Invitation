import sys
from PIL import Image
S,pre,w,h=sys.argv[1],sys.argv[2],int(sys.argv[3]),int(sys.argv[4]); fs=sys.argv[5].split(','); cols=int(sys.argv[6])
ims=[Image.open(f'{S}/{pre}_{f}.png').convert('RGB').resize((w,h)) for f in fs]
rows=(len(ims)+cols-1)//cols; sh=Image.new('RGB',(w*cols,h*rows))
for i,im in enumerate(ims): sh.paste(im,((i%cols)*w,(i//cols)*h))
sh.save(f'{S}/{pre}_sheet.jpg',quality=84)
