import { useEffect, useRef } from 'react'

interface StickerData {
  src: string
  img: HTMLImageElement | null
  x: number; y: number
  vx: number; vy: number
  size: number
  opacity: number
  life: number
  maxLife: number
}

const STICKER_SRCS = [
  '/assets/stickers/bulbasaur-pokemon.gif',
  '/assets/stickers/bee-pixel.webp',
  '/assets/stickers/mario-dance.webp',
  '/assets/stickers/minecraft-steve.webp',
  '/assets/stickers/minecraft-sword.webp',
  '/assets/stickers/creeper-minecraft.webp',
  '/assets/stickers/pixel-rabbit-rabbit.webp',
  '/assets/stickers/16bit-80s.webp',
  '/assets/stickers/party-fox.webp',
  '/assets/stickers/hmmm-villiage.webp',
  '/assets/stickers/sunnykins-sunny-bongo.gif',
  '/assets/stickers/sigh-bits.webp',
]

// Preload images cache
const imageCache: Record<string, HTMLImageElement> = {}

export default function FloatingStickers() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stickersRef = useRef<StickerData[]>([])
  const lastSpawnRef = useRef<number>(0)

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (isMobile) return // Disable on mobile for maximum performance

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)
    resize()

    const spawn = () => {
      const edge = Math.floor(Math.random() * 4)
      let x = 0, y = 0, vx = 0, vy = 0
      const speed = 0.5 + Math.random() * 0.8
      if (edge === 0) { x = Math.random() * canvas.width; y = -50; vx = (Math.random()-0.5)*speed; vy = speed }
      else if (edge === 1) { x = canvas.width + 50; y = Math.random() * canvas.height; vx = -speed; vy = (Math.random()-0.5)*speed }
      else if (edge === 2) { x = Math.random() * canvas.width; y = canvas.height + 50; vx = (Math.random()-0.5)*speed; vy = -speed }
      else { x = -50; y = Math.random() * canvas.height; vx = speed; vy = (Math.random()-0.5)*speed }

      const src = STICKER_SRCS[Math.floor(Math.random() * STICKER_SRCS.length)]
      let img = imageCache[src]
      if (!img) {
        img = new Image()
        img.src = src
        imageCache[src] = img
      }

      stickersRef.current.push({
        src, img, x, y, vx, vy,
        size: 40 + Math.random() * 30,
        opacity: 0,
        life: 0,
        maxLife: 300 + Math.random() * 300,
      })
    }

    let rafId: number
    const tick = (timestamp: number) => {
      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Spawn
      if (timestamp - lastSpawnRef.current > 4000 && stickersRef.current.length < 3) {
        spawn()
        lastSpawnRef.current = timestamp
      }

      // Update & Draw
      stickersRef.current = stickersRef.current.filter(s => {
        s.life++
        s.x += s.vx
        s.y += s.vy

        const fadeIn = 60, fadeOut = 60
        if (s.life < fadeIn) s.opacity = s.life / fadeIn
        else if (s.life > s.maxLife - fadeOut) s.opacity = (s.maxLife - s.life) / fadeOut
        else s.opacity = 1

        if (s.life >= s.maxLife) return false

        if (s.img && s.img.complete) {
          ctx.save()
          ctx.globalAlpha = s.opacity * 0.4
          // Apply some simple filters via canvas if needed, but keeping it raw is faster
          ctx.translate(s.x, s.y)
          // Grayscale effect alternative in canvas is expensive (getImageData), 
          // so we'll just use globalAlpha for the "ghostly" look
          ctx.drawImage(s.img, -s.size/2, -s.size/2, s.size, s.size)
          ctx.restore()
        }
        return true
      })

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
        imageRendering: 'pixelated'
      }}
    />
  )
}
