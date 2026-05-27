window.initPixelRain=()=>{

// ─── Canvas ────────────────────────────────────────────────────────────────────
const cv  = document.getElementById('cv')
const ctx = cv.getContext('2d')
const BTN = document.getElementById('replay')

function resize() { cv.width = window.innerWidth; cv.height = window.innerHeight }
resize()
window.addEventListener('resize', resize)

// ─── Mouse ─────────────────────────────────────────────────────────────────────
const mouse = { x: -9999, y: -9999 }
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY })
window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999 })

// ─── Default text ──────────────────────────────────────────────────────────────
// Change these to use your own text.
const WORD   = '生日快樂曜宇哥哥'

// ─── Text sampling ─────────────────────────────────────────────────────────────
// Rasterises `text` onto an offscreen canvas and returns [{x, y}] for every
// sampled lit pixel. density = step size in px (lower = more particles).
function sampleText(text, density = 4) {
    const off  = document.createElement('canvas')
    const octx = off.getContext('2d')
    off.width  = cv.width
    off.height = cv.height
    const fs = Math.min(cv.height * 0.42, cv.width / text.length * 1, 150)
    octx.font         = `700 ${fs}px "Space Grotesk", sans-serif`
    octx.textAlign    = 'center'
    octx.textBaseline = 'middle'
    octx.fillStyle    = '#fff'
    octx.fillText(text, off.width / 2, off.height / 2)
    const { data } = octx.getImageData(0, 0, off.width, off.height)
    const pts = []
    for (let y = 0; y < off.height; y += density)
        for (let x = 0; x < off.width; x += density)
            if (data[(y * off.width + x) * 4 + 3] > 128) pts.push({ x, y })
    return pts
}

// Pad or trim an array to exactly n elements, repeating randomly to fill.
function padTo(arr, n) {
    const out = arr.slice(0, n)
    while (out.length < n) out.push(arr[Math.floor(Math.random() * arr.length)])
    return out
}

// ─── Spring ────────────────────────────────────────────────────────────────────
function spring2D(s, tx, ty, k = 0.08, d = 0.75) {
    s.vx += (tx - s.x) * k;  s.vx *= d;  s.x += s.vx
    s.vy += (ty - s.y) * k;  s.vy *= d;  s.y += s.vy
}

// ─── Loop ──────────────────────────────────────────────────────────────────────
let _raf = null
function loop(tick) {
    cancelAnimationFrame(_raf)
    ;(function frame() { tick(); _raf = requestAnimationFrame(frame) })()
}

function run(fn) { fn(); BTN.onclick = fn }

// ── Pixel Rain ──────────────────────────────────────────────────────────
function pixel_rain() {
    const pts = sampleText(WORD)
    const P = pts.map(o => ({
        x: o.x + (Math.random() - 0.5) * 6,
        y: o.y - cv.height * (0.5 + Math.random() * 1.0),
        vx: (Math.random() - 0.5) * 1.5, vy: 0,
        ox: o.x, oy: o.y,
    }))
    loop(() => {
        ctx.fillStyle = '#080A0F'
        ctx.fillRect(0, 0, cv.width, cv.height)
        P.forEach(p => {
            spring2D(p, p.ox, p.oy, 0.045, 0.84)
            const dist  = Math.hypot(p.x - p.ox, p.y - p.oy)
            const alpha = Math.min(0.85, 0.15 + (1 - Math.min(1, dist / 200)) * 0.7)
            ctx.fillStyle = `rgba(46,230,166,${alpha})`
            ctx.beginPath()
            ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2)
            ctx.fill()
        })
    })
}

run(pixel_rain)
}
