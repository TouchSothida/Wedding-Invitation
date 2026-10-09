import sys, asyncio
from playwright.async_api import async_playwright
async def main():
    out=sys.argv[1]; w=int(sys.argv[2]); h=int(sys.argv[3])
    async with async_playwright() as p:
        b=await p.chromium.launch()
        ctx=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=1)
        pg=await ctx.new_page(); errs=[]
        pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
        pg.on('pageerror',lambda e: errs.append('PAGEERR '+str(e)))
        await pg.goto('http://localhost:5173/#skip'); await pg.wait_for_timeout(1500)
        H=await pg.evaluate('document.documentElement.scrollHeight')
        secs=await pg.evaluate("[...document.querySelectorAll('main > section')].map(s=>[s.id,s.getBoundingClientRect().top+scrollY,s.offsetHeight])")
        print('height',H,secs)
        for sid,top,hh in secs:
            if sid=='story':
                for k,f in enumerate((0.05,0.5,0.95)):
                    await pg.evaluate(f'window.scrollTo(0,{top}+({hh}-innerHeight)*{f})'); await pg.wait_for_timeout(900)
                    await pg.screenshot(path=f'{out}_{sid}{k}.png')
                continue
            steps=max(1,round(hh/h))
            for k in range(min(steps,3)):
                await pg.evaluate(f'window.scrollTo(0,{top}+{k}*{h}*0.9)'); await pg.wait_for_timeout(2600 if k==0 else 1500)
                await pg.screenshot(path=f'{out}_{sid}{k}.png')
        ov=await pg.evaluate('''()=>{const W=document.documentElement.clientWidth;return [document.documentElement.scrollWidth,W,[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>W+2&&!e.closest('.corners,.sec-corners,.cover-photo,.marquee,.strip,.lanterns,.v-track,.viewer')}).slice(0,6).map(e=>e.tagName+'.'+e.className)]}''')
        print('overflow',ov); print('errors',errs[:6])
        await b.close()
asyncio.run(main())
