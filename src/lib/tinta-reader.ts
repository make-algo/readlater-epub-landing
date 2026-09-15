/**
 * Motor de paso de página del concepto B — "La página es tinta electrónica"
 * (Fase 6, MAK-143). Ported desde `public/prototipos/b/index.html` (MAK-135),
 * con las correcciones de la crítica a ciegas MAK-137:
 *
 *   - `pushGhost` limpia SIEMPRE los fantasmas anteriores antes de añadir
 *     uno nuevo (antes se permitían dos en paralelo si el usuario pasaba de
 *     pantalla más rápido que los 4.6s de desvanecimiento — eso es lo que
 *     se veía como "el fantasma se duplica" en FAQ y portada).
 *   - Con `prefers-reduced-motion` no se llama a `pushGhost` en absoluto:
 *     sin flash y sin fantasma, página limpia (antes el corte seco
 *     conservaba el fantasma a plena intensidad).
 *   - El foco tras pasar de página se fuerza a la cabecera de la pantalla
 *     de destino aunque el componente no le haya puesto `tabindex="-1"` —
 *     así los screens que reutilizan componentes reales (Demo, WaitlistForm)
 *     no necesitan tocar su propio marcado para ser accesibles aquí.
 *   - `pushGhost` nunca se llama al ENTRAR en una pantalla marcada
 *     `data-no-ghost` (la del formulario, MAK-154): el fantasma es memoria
 *     de la pantalla anterior y no debe leerse detrás de controles
 *     interactivos reales — la crítica MAK-151 lo pilló tapando el campo de
 *     correo y los radios de la pantalla 8.
 *
 * La demo del EPUB NO se gestiona aquí: `secciones/Demo.astro` (reusado tal
 * cual desde el control) trae su propio script con IntersectionObserver,
 * estados de carga/éxito/error y roles tablist/tab/tabpanel.
 */

const screens = Array.prototype.slice.call(document.querySelectorAll<HTMLElement>('.screen')) as HTMLElement[]
const total = screens.length
let current = 0
let animating = false

const stage = document.getElementById('main') as HTMLElement
const flashOverlay = document.getElementById('flashOverlay') as HTMLElement
const ghostLayer = document.getElementById('ghostLayer') as HTMLElement
const statusBar = document.getElementById('statusBar') as HTMLElement
const tocDialog = document.getElementById('tocDialog') as HTMLElement
const tocList = document.getElementById('tocList') as HTMLElement
const tocOpenBtn = document.getElementById('tocOpenBtn') as HTMLButtonElement
const tocCloseBtn = document.getElementById('tocCloseBtn') as HTMLButtonElement
const screensaver = document.getElementById('screensaver') as HTMLElement

if (stage && flashOverlay && ghostLayer && statusBar && tocDialog && tocList && total > 0) {
  const reducedMotionMQ = window.matchMedia('(prefers-reduced-motion: reduce)')
  const reduced = () => reducedMotionMQ.matches

  document.documentElement.classList.toggle('reduced-motion', reduced())
  reducedMotionMQ.addEventListener('change', () => {
    document.documentElement.classList.toggle('reduced-motion', reduced())
  })

  // ---------- construir el índice ----------
  screens.forEach((s, i) => {
    const li = document.createElement('li')
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.setAttribute('aria-current', i === current ? 'true' : 'false')
    const idx = document.createElement('span')
    idx.className = 'idx'
    idx.textContent = String(i + 1).padStart(2, '0')
    const label = document.createElement('span')
    label.textContent = s.dataset.title || `Pantalla ${i + 1}`
    btn.appendChild(label)
    btn.appendChild(idx)
    btn.addEventListener('click', () => {
      closeToc()
      goTo(i)
    })
    li.appendChild(btn)
    tocList.appendChild(li)
  })

  function updateStatus() {
    const pct = Math.round(((current + 1) / total) * 100)
    const label = `Pantalla ${current + 1} de ${total}`
    statusBar.textContent = label + ` · ${pct}% leído` + (current === total - 1 ? ' · fin del documento' : '')
    tocList.querySelectorAll('button').forEach((b, i) => {
      b.setAttribute('aria-current', i === current ? 'true' : 'false')
    })
  }

  // ---------- fantasma ----------
  function pushGhost(fromScreen: HTMLElement) {
    // Nunca más de un fantasma vivo a la vez — la causa real de la
    // duplicación que vio la crítica (MAK-137).
    ghostLayer.querySelectorAll('.ghost-shot').forEach((g) => g.remove())

    const clone = fromScreen.cloneNode(true) as HTMLElement
    clone.removeAttribute('id')
    clone.classList.remove('is-active')
    clone.classList.add('ghost-shot')
    clone.style.visibility = 'visible'
    clone.style.opacity = ''
    clone.setAttribute('aria-hidden', 'true')
    clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'))
    clone.querySelectorAll('input,button,a,textarea,select').forEach((el) => {
      el.setAttribute('tabindex', '-1')
      ;(el as HTMLInputElement).disabled = true
    })

    ghostLayer.appendChild(clone)
    requestAnimationFrame(() => clone.classList.add('is-in'))

    setTimeout(() => clone.classList.add('is-fading'), 300)
    setTimeout(() => clone.remove(), 4600)
  }

  function clearGhosts() {
    ghostLayer.querySelectorAll('.ghost-shot').forEach((g) => g.remove())
  }

  // ---------- secuencia de flash ----------
  function flashThenSwap(swapFn: () => void, doneFn?: () => void) {
    if (reduced()) {
      swapFn()
      if (doneFn) doneFn()
      return
    }
    flashOverlay.className = 'flash-overlay f-black'
    setTimeout(() => {
      flashOverlay.className = 'flash-overlay f-white'
      swapFn()
      setTimeout(() => {
        flashOverlay.className = 'flash-overlay f-black'
        setTimeout(() => {
          flashOverlay.className = 'flash-overlay f-clear'
          setTimeout(() => { if (doneFn) doneFn() }, 90)
        }, 55)
      }, 65)
    }, 60)
  }

  // ---------- paso de página ----------
  function goTo(index: number) {
    if (animating) return
    index = Math.max(0, Math.min(total - 1, index))
    if (index === current) return
    animating = true
    dismissScreensaver(true)

    const from = screens[current]
    const to = screens[index]

    flashThenSwap(() => {
      // Con movimiento reducido: sin flash Y sin fantasma — página limpia.
      // Tampoco al entrar en una pantalla con controles interactivos reales
      // que el fantasma no debe tapar (MAK-154).
      if (!reduced() && !to.hasAttribute('data-no-ghost')) pushGhost(from)
      from.classList.remove('is-active')
      from.setAttribute('inert', '')
      from.setAttribute('aria-hidden', 'true')
      to.classList.add('is-active')
      to.removeAttribute('inert')
      to.removeAttribute('aria-hidden')
      current = index
      updateStatus()
    }, () => {
      animating = false
      const heading = to.querySelector<HTMLElement>('h1, h2')
      if (heading) {
        if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1')
        heading.focus({ preventScroll: true })
      }
      resetIdleTimers()
    })
  }

  function next() { if (current < total - 1) goTo(current + 1) }
  function prev() { if (current > 0) goTo(current - 1) }

  // estado inicial (la pantalla 0 ya llega `is-active` en el HTML servido,
  // para el fallback sin JS — aquí solo se confirma el resto)
  screens.forEach((s, i) => {
    if (i === 0) {
      s.classList.add('is-active')
    } else {
      s.setAttribute('inert', '')
      s.setAttribute('aria-hidden', 'true')
    }
  })
  updateStatus()

  // ---------- teclado ----------
  document.addEventListener('keydown', (e) => {
    if (tocDialog.classList.contains('is-open')) {
      if (e.key === 'Escape') closeToc()
      return
    }
    const tag = (e.target as HTMLElement)?.tagName || ''
    const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'

    if (screensaver.classList.contains('is-shown')) {
      dismissScreensaver()
      return
    }

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !typing)) {
      e.preventDefault()
      next()
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault()
      prev()
    } else if (e.key === 'i' && !typing) {
      openToc()
    }
    resetIdleTimers()
  })

  // ---------- rueda ----------
  let wheelCooldown = false
  stage.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) < 12) return
    if (wheelCooldown) return
    wheelCooldown = true
    setTimeout(() => { wheelCooldown = false }, 520)
    if (screensaver.classList.contains('is-shown')) { dismissScreensaver(); return }
    if (e.deltaY > 0) next(); else prev()
    resetIdleTimers()
  }, { passive: true })

  // ---------- bordes ----------
  document.getElementById('edgePrev')?.addEventListener('click', () => {
    if (screensaver.classList.contains('is-shown')) { dismissScreensaver(); return }
    prev(); resetIdleTimers()
  })
  document.getElementById('edgeNext')?.addEventListener('click', () => {
    if (screensaver.classList.contains('is-shown')) { dismissScreensaver(); return }
    next(); resetIdleTimers()
  })

  // ---------- swipe ----------
  let touchStartX: number | null = null
  let touchStartY: number | null = null
  stage.addEventListener('touchstart', (e) => {
    if (!e.touches || e.touches.length !== 1) return
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
  }, { passive: true })
  stage.addEventListener('touchend', (e) => {
    if (touchStartX === null || touchStartY === null) return
    const t = e.changedTouches && e.changedTouches[0]
    if (!t) return
    const dx = t.clientX - touchStartX
    const dy = t.clientY - touchStartY
    touchStartX = null; touchStartY = null
    if (Math.abs(dx) < 46 || Math.abs(dx) < Math.abs(dy)) return
    if (screensaver.classList.contains('is-shown')) { dismissScreensaver(); return }
    if (dx < 0) next(); else prev()
    resetIdleTimers()
  }, { passive: true })

  // ---------- botones de salto (hero / faq) ----------
  document.querySelectorAll<HTMLElement>('[data-jump]').forEach((btn) => {
    btn.addEventListener('click', () => goTo(parseInt(btn.dataset.jump || '0', 10)))
  })

  // ---------- diálogo de índice ----------
  let lastFocused: HTMLElement | null = null
  function openToc() {
    lastFocused = document.activeElement as HTMLElement
    tocDialog.classList.add('is-open')
    const first = tocList.querySelector<HTMLElement>('button')
    if (first) first.focus()
  }
  function closeToc() {
    tocDialog.classList.remove('is-open')
    if (lastFocused && lastFocused.focus) lastFocused.focus()
  }
  tocOpenBtn?.addEventListener('click', openToc)
  tocCloseBtn?.addEventListener('click', closeToc)
  tocDialog.addEventListener('click', (e) => { if (e.target === tocDialog) closeToc() })
  tocDialog.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return
    const list = Array.prototype.slice.call(tocDialog.querySelectorAll('button')) as HTMLElement[]
    const idx = list.indexOf(document.activeElement as HTMLElement)
    if (e.shiftKey && idx === 0) { e.preventDefault(); list[list.length - 1].focus() }
    else if (!e.shiftKey && idx === list.length - 1) { e.preventDefault(); list[0].focus() }
  })

  // ---------- inactividad: refresco espontáneo + salvapantallas ----------
  let refreshTimer: ReturnType<typeof setTimeout>
  let sleepTimer: ReturnType<typeof setTimeout>
  const REFRESH_AFTER = 22000
  const SLEEP_AFTER = 65000

  function spontaneousRefresh() {
    if (animating || screensaver.classList.contains('is-shown')) return
    if (reduced()) { clearGhosts(); return }
    animating = true
    flashThenSwap(() => clearGhosts(), () => { animating = false })
  }

  function showScreensaver() {
    screensaver.classList.add('is-shown')
    screensaver.setAttribute('aria-hidden', 'false')
    stage.setAttribute('inert', '')
  }

  function dismissScreensaver(silent?: boolean) {
    if (!screensaver.classList.contains('is-shown')) return
    screensaver.classList.remove('is-shown')
    screensaver.setAttribute('aria-hidden', 'true')
    stage.removeAttribute('inert')
    if (!silent && !reduced()) {
      flashOverlay.className = 'flash-overlay f-black'
      setTimeout(() => { flashOverlay.className = 'flash-overlay f-clear' }, 70)
    }
  }

  function resetIdleTimers() {
    clearTimeout(refreshTimer)
    clearTimeout(sleepTimer)
    refreshTimer = setTimeout(spontaneousRefresh, REFRESH_AFTER)
    sleepTimer = setTimeout(showScreensaver, SLEEP_AFTER)
  }
  resetIdleTimers()
  ;['mousedown', 'keydown', 'touchstart', 'wheel'].forEach((ev) => {
    document.addEventListener(ev, () => {
      if (!screensaver.classList.contains('is-shown')) resetIdleTimers()
    }, { passive: true })
  })
  screensaver.addEventListener('click', () => { dismissScreensaver(); resetIdleTimers() })
  screensaver.addEventListener('touchstart', () => { dismissScreensaver(); resetIdleTimers() }, { passive: true })
}
