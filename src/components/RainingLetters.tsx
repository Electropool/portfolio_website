"use client"

import React, { useState, useEffect, useRef } from "react"

interface Character {
  char: string
  x: number
  y: number
  speed: number
  isActive: boolean
}

class TextScramble {
  el: HTMLElement
  chars: string
  queue: Array<{
    from: string
    to: string
    start: number
    end: number
    char?: string
  }>
  frame: number
  frameRequest: number
  resolve: (value: void | PromiseLike<void>) => void

  constructor(el: HTMLElement) {
    this.el = el
    this.chars = '!<>-_\\/[]{}—=+*^?#'
    this.queue = []
    this.frame = 0
    this.frameRequest = 0
    this.resolve = () => {}
    this.update = this.update.bind(this)
  }

  setText(newText: string) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise<void>((resolve) => this.resolve = resolve)
    this.queue = []
    
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from, to, start, end })
    }
    
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }

  update() {
    let output = ''
    let complete = 0
    
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)]
          this.queue[i].char = char
        }
        output += `<span class="dud">${char}</span>`
      } else {
        output += from
      }
    }
    
    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }
}

export const ScrambledTitle: React.FC = () => {
  const elementRef = useRef<HTMLHeadingElement>(null)
  const scramblerRef = useRef<TextScramble | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (elementRef.current && !scramblerRef.current) {
      scramblerRef.current = new TextScramble(elementRef.current)
      setMounted(true)
    }
  }, [])

  useEffect(() => {
    if (mounted && scramblerRef.current) {
      const phrases = [
        'ARPAN KAR',
        'ELECTRONICS ENGINEER',
        'SYSTEMS AUTOMATION',
        'HARDWARE DEV'
      ]
      
      let counter = 0
      const next = () => {
        if (scramblerRef.current) {
          scramblerRef.current.setText(phrases[counter]).then(() => {
            setTimeout(next, 2500)
          })
          counter = (counter + 1) % phrases.length
        }
      }

      next()
    }
  }, [mounted])

  return (
    <>
      <h1 
        ref={elementRef}
        className="text-white text-4xl md:text-6xl font-bold tracking-wider text-center"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        ARPAN KAR
      </h1>
      <style>{`
        .dud {
          color: rgba(255, 255, 255, 0.4);
          opacity: 0.7;
        }
      `}</style>
    </>
  )
}

const RainingLetters: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const charactersRef = useRef<Character[]>([])

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
    const charCount = isMobile ? 80 : 200 // Reduced count for performance

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      
      charactersRef.current = Array.from({ length: charCount }, () => ({
        char: chars[Math.floor(Math.random() * chars.length)],
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.5 + Math.random() * 1.5,
        isActive: false
      }))
    }

    window.addEventListener('resize', resize)
    resize()

    let rafId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      ctx.font = '14px monospace'
      ctx.textAlign = 'center'

      charactersRef.current.forEach(c => {
        c.y += c.speed
        if (c.y > canvas.height) {
          c.y = -20
          c.x = Math.random() * canvas.width
          c.char = chars[Math.floor(Math.random() * chars.length)]
        }

        // Randomly activate some chars
        if (Math.random() < 0.001) c.isActive = !c.isActive

        if (c.isActive) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
          ctx.shadowBlur = 10
          ctx.shadowColor = 'white'
          ctx.fillText(c.char, c.x, c.y)
          ctx.shadowBlur = 0
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
          ctx.fillText(c.char, c.x, c.y)
        }
      })

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="relative w-full h-[80vh] min-h-[500px] overflow-hidden rounded-xl border border-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.2)]">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-full px-4">
        {children}
      </div>
    </div>
  )
}

export default RainingLetters
