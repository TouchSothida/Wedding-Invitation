import sys, asyncio
from playwright.async_api import async_playwright
async def main():
    out=sys.argv[1]; w=int(sys.argv[2]); h=int(sys.argv[3]); lang=sys.argv[4] if len(sys.argv)>4 else 'km'
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':w,'height':h}); pg=await ctx.new_page(); errs=[]
        pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None); pg.on('pageerror',lambda e: errs.append('PAGEERR '+str(e)))
        await pg.goto('http://localhost:5173/#skip'); await pg.evaluate(f"localStorage.setItem('lang','{lang}')"); await pg.reload(); await pg.wait_for_timeout(1200)
        # real scroll through everything to trigger reveals
        H=await pg.evaluate('document.documentElement.scrollHeight'); y=0
        while y<H: 
            await pg.evaluate(f'scrollTo(0,{y})'); await pg.wait_for_timeout(250); y+=h*.6
        await pg.wait_for_timeout(800)
        r=await pg.evaluate('''()=>{const W=document.documentElement.clientWidth;const bad=[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>W+2&&!e.closest('.corners,.sec-corners,.cover-photo,.marquee,.strip,.lanterns,.v-track,.viewer,.story-pin')}).slice(0,6).map(e=>e.tagName+'.'+e.className);
          const cover=document.querySelector('.cover-in').getBoundingClientRect();
          return {sw:document.documentElement.scrollWidth,W,bad,coverFits:cover.height<=innerHeight+1,coverH:Math.round(cover.height)}}''')
        print(w,h,lang,r)
        # lantern + ripples test
        await pg.evaluate("scrollTo(0,document.querySelector('#candle').offsetTop)"); await pg.wait_for_timeout(800)
        await pg.mouse.click(w*0.5,h*0.62); await pg.wait_for_timeout(1500)
        await pg.screenshot(path=f'{out}_lantern.png')
        # gallery viewer
        await pg.evaluate("scrollTo(0,document.querySelector('#gallery').offsetTop+300)"); await pg.wait_for_timeout(1500)
        await pg.click('.mi >> nth=2'); await pg.wait_for_timeout(1200); await pg.screenshot(path=f'{out}_viewer.png')
        await pg.keyboard.press('Escape')
        print('viewer closed',await pg.evaluate("document.querySelector('#viewer').hidden"),'errors',errs[:5])
        await b.close()
asyncio.run(main())
