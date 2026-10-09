import sys, asyncio, json
from playwright.async_api import async_playwright
async def main():
    out=sys.argv[1]; w=int(sys.argv[2]); h=int(sys.argv[3]); frames=[int(x) for x in sys.argv[4].split(',')] if len(sys.argv)>4 and not sys.argv[4].startswith('--') else []
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome' if False else None)
        ctx=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=2 if w<500 else 1)
        pg=await ctx.new_page(); errs=[]
        pg.on('console',lambda m: errs.append(m.text) if m.type in('error','warning') else None)
        pg.on('pageerror',lambda e: errs.append(str(e)))
        await pg.goto('http://localhost:5173/'); await pg.wait_for_timeout(1500)
        await pg.screenshot(path=f'{out}_closed.png')
        for f in frames:
            await pg.evaluate(f'window.__seek({f})'); await pg.wait_for_timeout(120)
            await pg.screenshot(path=f'{out}_f{f:04d}.png')
        if '--cover' in sys.argv:
            await pg.evaluate('window.__finish()'); await pg.wait_for_timeout(7000)
            await pg.screenshot(path=f'{out}_cover.png')
            ov=await pg.evaluate('''()=>{const W=document.documentElement.clientWidth;return [document.documentElement.scrollWidth,W,[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>W+2)&&!e.closest('.corners')&&!e.closest('.cover-photo')}).slice(0,5).map(e=>e.className+'')]}''')
            print('overflow',ov)
        print('console',errs[:8])
        await b.close()
asyncio.run(main())
