import { useEffect, useRef, useState } from 'react'

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [isTouch, setIsTouch] = useState(false)
  const pos = useRef({ x: -100, y: -100 })
  const ring = useRef({ x: -100, y: -100 })

  useEffect(() => {
    // hide on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true)
      return
    }

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top  = e.clientY + 'px'
      }
    }

    const onEnter = () => {
      dotRef.current?.classList.add('cursor-hover')
      ringRef.current?.classList.add('cursor-hover')
    }
    const onLeave = () => {
      dotRef.current?.classList.remove('cursor-hover')
      ringRef.current?.classList.remove('cursor-hover')
    }

    window.addEventListener('mousemove', onMove)

    const bindHovers = () => {
      document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }
    bindHovers()
    const obs = new MutationObserver(bindHovers)
    obs.observe(document.body, { childList: true, subtree: true })

    // smooth ring follow
    let rafId: number
    const animRing = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.11
      ring.current.y += (pos.current.y - ring.current.y) * 0.11
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + 'px'
        ringRef.current.style.top  = ring.current.y + 'px'
      }
      rafId = requestAnimationFrame(animRing)
    }
    animRing()

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
      obs.disconnect()
    }
  }, [])

  if (isTouch) return null

  return (
    <>
      {/* dot */}
      <div
        ref={dotRef}
        className="fixed pointer-events-none"
        style={{
          zIndex: 99999,
          width: 8, height: 8,
          background: 'var(--accent)',
          borderRadius: '50%',
          transform: 'translate(-50%,-50%)',
          transition: 'width .15s, height .15s, background .15s',
        }}
      />
      {/* ring */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none"
        style={{
          zIndex: 99998,
          width: 38, height: 38,
          border: '1.5px solid var(--purple-light)',
          borderRadius: '50%',
          transform: 'translate(-50%,-50%)',
          transition: 'width .25s, height .25s, border-color .2s, opacity .2s',
        }}
      />

      <style>{`
        .cursor-hover { width: 14px !important; height: 14px !important; background: #fff !important; }
        div[ref] + .cursor-hover { width: 54px !important; height: 54px !important; border-color: var(--accent) !important; }
      `}</style>
    </>
  )
}
