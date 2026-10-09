# Tileable paper textures: fine grain + faint fibres, very low contrast, no cloudy blotches.
import numpy as np
from PIL import Image, ImageDraw
S=512
def make(name, rgb, seed, grain=5.0, fibre_alpha=14, nfib=260):
    rng=np.random.default_rng(seed)
    n=rng.normal(0,1,(S,S))
    # band-limit (periodic via FFT) to fine scale only
    F=np.fft.fft2(n); fy=np.fft.fftfreq(S)[:,None]; fx=np.fft.fftfreq(S)[None,:]
    r=np.sqrt(fx**2+fy**2); F*= (r>0.08)*np.exp(-(r/0.35)**2)
    g=np.real(np.fft.ifft2(F)); g/=g.std()
    img=np.zeros((S,S,3))+np.array(rgb)+g[...,None]*grain
    # fibres on 3x3 tiled canvas for wraparound
    L=Image.new('L',(S*3,S*3),128); d=ImageDraw.Draw(L)
    for _ in range(nfib*9):
        x,y=rng.uniform(0,S*3,2); a=rng.uniform(0,np.pi); l=rng.uniform(6,22)
        c=int(128+rng.choice([-1,1])*fibre_alpha*rng.uniform(.4,1))
        pts=[(x,y),(x+np.cos(a)*l*.5+rng.normal(0,1.2),y+np.sin(a)*l*.5+rng.normal(0,1.2)),(x+np.cos(a)*l,y+np.sin(a)*l)]
        d.line(pts,fill=c,width=1)
    f=np.array(L.crop((S,S,2*S,2*S))).astype(float)-128
    img+=f[...,None]*0.5
    Image.fromarray(np.clip(img,0,255).astype('uint8')).save(f'public/tex/{name}.webp','WEBP',quality=88)
make('paper-rose',(226,166,176),1)
make('paper-cream',(247,239,224),2,grain=3.5)
make('paper-lining',(244,230,208),3,grain=4)
make('paper-dark',(176,112,126),4,grain=4.5)
