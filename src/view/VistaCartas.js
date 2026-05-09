import { crearCartaDesdeNombre, obtenerNombresCartas } from '../model/cartas/index.js'
import { GestorAjusteRatio } from './base/GestorAjusteRatio.js'

export class VistaCartas {
  constructor() {
    this.callbackVolver = null
    this.visible = false
    this.containerEl = null
    this.modalEl = null
    this.gridEl = null
    this.sliderEl = null
    this.touchStartY = 0
  }

  crear() {
    this.crearModal()
  }

  _obtenerConfiguracion() {
    const esLandscape = GestorAjusteRatio.esLandscape()
    const esMovil = GestorAjusteRatio.esMovil()
    const esTablet = GestorAjusteRatio.esTablet()

    return {
      tamanoCarta: esLandscape ? (esMovil ? 180 : esTablet ? 200 : 220) : (esMovil ? 150 : 220),
      altoCarta: esLandscape ? (esMovil ? 200 : 220) : (esMovil ? 180 : 220),
      columnas: !esLandscape && esMovil ? 'repeat(2, 150px)' : 'auto-fill',
      gap: esMovil ? 12 : 20,
      paddingLateral: esMovil ? 10 : 20,
      tamanoTitulo: esMovil ? '24px' : esTablet ? '34px' : '42px',
      tamanoTextoCarta: esLandscape ? (esMovil ? 13 : 16) : (esMovil ? 10 : 12),
      tamanoImagenCarta: esLandscape ? (esMovil ? 70 : 90) : (esMovil ? 55 : 90),
      tamanoBadgeCarta: esLandscape ? (esMovil ? 10 : 11) : (esMovil ? 8 : 11),
      headerGap: esMovil ? '12px' : '30px',
      paddingSuperior: esMovil ? '3%' : '4%',
      sliderAncho: 36
    }
  }

  crearUI() {
    const cfg = this._obtenerConfiguracion()

    const container = document.createElement('div')
    container.id = 'vistaCartas'
    container.style.cssText = `
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      display: none;
      flex-direction: column;
      align-items: center;
      background: rgba(12, 9, 8, 0.75);
      z-index: 100;
      font-family: 'Comic Neue', 'Comic Sans MS', cursive;
      padding-top: ${cfg.paddingSuperior};
      box-sizing: border-box;
      overflow: hidden;
    `
    document.body.appendChild(container)
    this.containerEl = container

    const header = document.createElement('div')
    header.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      gap: ${cfg.headerGap};
      margin-bottom: 8px;
      flex-shrink: 0;
      flex-wrap: wrap;
      padding: 0 ${cfg.paddingLateral}px;
      width: 100%;
      box-sizing: border-box;
    `
    container.appendChild(header)

    const titulo = document.createElement('h1')
    titulo.textContent = 'Actividades y Aplicaciones'
    titulo.style.cssText = `
      color: #ffe6d1;
      font-size: ${cfg.tamanoTitulo};
      margin: 0;
      text-align: center;
    `
    header.appendChild(titulo)

    const btnVolver = this._crearBoton('Volver a Reglas', '#362924', '#ffd8bc', () => {
      this.callbackVolver && this.callbackVolver()
    }, GestorAjusteRatio.esMovil())
    header.appendChild(btnVolver)

    const contenidoWrapper = document.createElement('div')
    contenidoWrapper.style.cssText = `
      flex: 1;
      display: flex;
      width: 100%;
      min-height: 0;
      overflow: hidden;
    `
    container.appendChild(contenidoWrapper)

    const gridWrapper = document.createElement('div')
    gridWrapper.style.cssText = `
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 5px ${cfg.paddingLateral}px 20px;
      box-sizing: border-box;
      -webkit-overflow-scrolling: touch;
      touch-action: pan-y;
      margin-right: ${cfg.sliderAncho}px;
    `
    gridWrapper.addEventListener('wheel', (e) => {
      e.preventDefault()
      gridWrapper.scrollTop += e.deltaY
    }, { passive: false })

    gridWrapper.addEventListener('touchstart', (e) => {
      this.touchStartY = e.touches[0].clientY
    }, { passive: true })

    gridWrapper.addEventListener('touchmove', (e) => {
      const deltaY = this.touchStartY - e.touches[0].clientY
      this.touchStartY = e.touches[0].clientY
      gridWrapper.scrollTop += deltaY
    }, { passive: true })

    contenidoWrapper.appendChild(gridWrapper)

    const grid = document.createElement('div')
    const tamanoCSS = typeof cfg.columnas === 'string' && cfg.columnas.startsWith('repeat')
      ? cfg.columnas
      : `repeat(${cfg.columnas}, ${cfg.tamanoCarta}px)`
    grid.style.cssText = `
      display: grid;
      grid-template-columns: ${tamanoCSS};
      gap: ${cfg.gap}px;
      justify-content: center;
      padding-bottom: 20px;
    `
    gridWrapper.appendChild(grid)
    this.gridEl = gridWrapper

    const nombresCartas = obtenerNombresCartas()
    nombresCartas.forEach((nombre) => {
      const carta = crearCartaDesdeNombre(nombre)
      if (carta) {
        grid.appendChild(this._crearCarta(carta, cfg))
      }
    })

    const sliderBar = document.createElement('div')
    sliderBar.style.cssText = `
      width: ${cfg.sliderAncho}px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      padding: 10px 0;
    `

    const slider = document.createElement('input')
    slider.type = 'range'
    slider.min = '0'
    slider.max = '100'
    slider.value = '0'
    slider.style.cssText = `
      writing-mode: vertical-lr;
      height: 95%;
      width: ${cfg.sliderAncho - 8}px;
      -webkit-appearance: none;
      appearance: none;
      background: rgba(168, 90, 42, 0.3);
      border-radius: 4px;
      outline: none;
      cursor: pointer;
    `
    slider.addEventListener('input', () => {
      const maxScroll = gridWrapper.scrollHeight - gridWrapper.clientHeight
      gridWrapper.scrollTop = (slider.value / 100) * maxScroll
    })

    sliderBar.appendChild(slider)
    contenidoWrapper.appendChild(sliderBar)
    this.sliderEl = slider

    if (!document.getElementById('estilosVistaCartas')) {
      const style = document.createElement('style')
      style.id = 'estilosVistaCartas'
      style.textContent = `
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #a85a2a;
          cursor: pointer;
          border: 2px solid #ffd8bc;
        }
        input[type="range"]::-moz-range-thumb {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #a85a2a;
          cursor: pointer;
          border: 2px solid #ffd8bc;
        }
        .vista-cartas-scroll::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
      `
      document.head.appendChild(style)
    }

    gridWrapper.classList.add('vista-cartas-scroll')

    gridWrapper.addEventListener('scroll', () => {
      const maxScroll = gridWrapper.scrollHeight - gridWrapper.clientHeight
      if (maxScroll > 0 && this.sliderEl) {
        this.sliderEl.value = (gridWrapper.scrollTop / maxScroll) * 100
      }
    })
  }

  crearModal() {
    if (this.modalEl) return

    const overlay = document.createElement('div')
    overlay.id = 'modalCarta'
    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: none;
      z-index: 200;
    `

    const contenido = document.createElement('div')
    contenido.id = 'modalCartaContenido'
    contenido.style.cssText = `
      position: fixed;
      border-radius: 20px;
      background: rgba(28, 28, 40, 0.98);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30px;
      box-sizing: border-box;
      gap: 12px;
      overflow-y: auto;
      opacity: 0;
      transform: scale(0.3);
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
      -webkit-overflow-scrolling: touch;
    `

    overlay.appendChild(contenido)
    document.body.appendChild(overlay)
    this.modalEl = { overlay, contenido }

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.cerrarModal()
    })
  }

  abrirModal(carta, origenRect) {
    if (!this.modalEl) return
    const { overlay, contenido } = this.modalEl
    const esMovil = GestorAjusteRatio.esMovil()
    const esLandscape = GestorAjusteRatio.esLandscape()

    const altoViewport = window.innerHeight
    const anchoViewport = window.innerWidth

    const altoModal = altoViewport * (esMovil && !esLandscape ? 0.85 : 0.75)
    const relacionCarta = esLandscape ? 4 / 5 : 5 / 7
    const anchoModal = esMovil && !esLandscape
      ? anchoViewport * 0.88
      : Math.min(altoModal * relacionCarta, anchoViewport * 0.55)

    const centroX = anchoViewport / 2
    const centroY = altoViewport / 2

    contenido.style.width = `${anchoModal}px`
    contenido.style.maxHeight = `${altoModal}px`
    contenido.style.left = `${centroX}px`
    contenido.style.top = `${centroY}px`
    contenido.style.transform = 'translate(-50%, -50%) scale(0.3)'
    contenido.style.opacity = '0'
    contenido.style.padding = `${Math.max(16, altoModal * 0.04)}px`
    contenido.style.gap = `${Math.max(8, altoModal * 0.015)}px`

    if (origenRect && !(esMovil && !esLandscape)) {
      const origenX = origenRect.left + origenRect.width / 2
      const origenY = origenRect.top + origenRect.height / 2
      contenido.style.transformOrigin = `${origenX - centroX + anchoModal / 2}px ${origenY - centroY + altoModal / 2}px`
    }

    contenido.innerHTML = ''
    contenido.style.border = `4px solid ${carta.color}`

    const imagenSrc = carta.obtenerImagen()
    if (imagenSrc) {
      const imagen = document.createElement('img')
      imagen.src = imagenSrc
      imagen.alt = carta.titulo
      imagen.style.cssText = `
        width: 100%;
        max-height: ${altoModal * 0.35}px;
        object-fit: contain;
        border-radius: 14px;
      `
      contenido.appendChild(imagen)
    }

    const badge = document.createElement('span')
    badge.textContent = carta.categoria
    badge.style.cssText = `
      font-size: clamp(14px, ${altoModal * 0.025}px, 20px);
      font-weight: bold;
      color: ${carta.color};
      background: rgba(0,0,0,0.5);
      padding: 8px 20px;
      border-radius: 10px;
    `
    contenido.appendChild(badge)

    const titulo = document.createElement('h2')
    titulo.textContent = carta.titulo
    titulo.style.cssText = `
      font-size: clamp(24px, ${altoModal * 0.06}px, 42px);
      font-weight: bold;
      color: ${carta.color};
      font-family: 'Comic Neue', 'Comic Sans MS', cursive;
      margin: 10px 0 6px;
      text-align: center;
    `
    contenido.appendChild(titulo)

    const horas = document.createElement('span')
    horas.textContent = `${carta.horas} hora${carta.horas > 1 ? 's' : ''}`
    horas.style.cssText = `
      font-size: clamp(14px, ${altoModal * 0.028}px, 22px);
      color: #aaa;
      font-family: 'Comic Neue', 'Comic Sans MS', cursive;
    `
    contenido.appendChild(horas)

    const descripcion = document.createElement('p')
    descripcion.textContent = carta.detalle
    descripcion.style.cssText = `
      font-size: clamp(15px, ${altoModal * 0.032}px, 24px);
      color: #d0d0d0;
      font-family: 'Comic Neue', 'Comic Sans MS', cursive;
      text-align: center;
      margin: 14px 0;
      line-height: 1.6;
    `
    contenido.appendChild(descripcion)

    overlay.style.display = 'block'

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        contenido.style.transform = 'translate(-50%, -50%) scale(1)'
        contenido.style.opacity = '1'
      })
    })
  }

  cerrarModal() {
    if (!this.modalEl) return
    const { overlay, contenido } = this.modalEl
    contenido.style.transform = 'translate(-50%, -50%) scale(0.3)'
    contenido.style.opacity = '0'
    setTimeout(() => {
      overlay.style.display = 'none'
    }, 350)
  }

  _crearBoton(texto, fondo, color, callback, esMovil = false) {
    const btn = document.createElement('button')
    btn.textContent = texto
    const tamanoMinimo = esMovil ? '44px' : '36px'
    btn.style.cssText = `
      padding: ${esMovil ? '12px 20px' : '10px 24px'};
      min-height: ${tamanoMinimo};
      border: none;
      border-radius: 18px;
      background: ${fondo};
      color: ${color};
      font-size: ${esMovil ? '16px' : '21px'};
      font-family: 'Comic Neue', 'Comic Sans MS', cursive;
      cursor: pointer;
      transition: transform 0.2s, opacity 0.2s;
      -webkit-tap-highlight-color: transparent;
    `
    const aplicarHover = () => {
      btn.style.opacity = '0.85'
      btn.style.transform = 'scale(1.05)'
    }
    const removerHover = () => {
      btn.style.opacity = '1'
      btn.style.transform = 'scale(1)'
    }
    if (!esMovil) {
      btn.addEventListener('mouseenter', aplicarHover)
      btn.addEventListener('mouseleave', removerHover)
    }
    btn.addEventListener('touchstart', (e) => {
      e.preventDefault()
      aplicarHover()
    }, { passive: false })
    btn.addEventListener('touchend', (e) => {
      e.preventDefault()
      removerHover()
      callback()
    }, { passive: false })
    btn.addEventListener('click', callback)
    return btn
  }

  _crearCarta(carta, cfg) {
    const contenedor = document.createElement('div')
    contenedor.style.cssText = `
      width: ${cfg.tamanoCarta}px;
      height: ${cfg.altoCarta}px;
      border-radius: 15px;
      border: 2px solid ${carta.color};
      background: rgba(28,28,40,0.95);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px;
      box-sizing: border-box;
      gap: 3px;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      -webkit-tap-highlight-color: transparent;
    `

    if (GestorAjusteRatio.esLandscape() && !GestorAjusteRatio.esMovil()) {
      contenedor.addEventListener('mouseenter', () => {
        contenedor.style.transform = 'scale(1.05)'
        contenedor.style.boxShadow = `0 0 20px ${carta.color}44`
      })
      contenedor.addEventListener('mouseleave', () => {
        contenedor.style.transform = 'scale(1)'
        contenedor.style.boxShadow = 'none'
      })
    }
    contenedor.addEventListener('click', () => {
      const rect = contenedor.getBoundingClientRect()
      this.abrirModal(carta, rect)
    })

    const imagenSrc = carta.obtenerImagen()
    if (imagenSrc) {
      const imagen = document.createElement('img')
      imagen.src = imagenSrc
      imagen.alt = carta.titulo
      imagen.style.cssText = `
        width: 100%;
        height: ${cfg.tamanoImagenCarta}px;
        object-fit: contain;
        border-radius: 8px;
      `
      contenedor.appendChild(imagen)
    }

    const badge = document.createElement('span')
    badge.textContent = carta.categoria
    badge.style.cssText = `
      font-size: ${cfg.tamanoBadgeCarta}px;
      font-weight: bold;
      color: ${carta.color};
      background: rgba(0,0,0,0.5);
      padding: 4px 8px;
      border-radius: 5px;
    `
    contenedor.appendChild(badge)

    const titulo = document.createElement('h3')
    titulo.textContent = carta.titulo
    titulo.style.cssText = `
      font-size: ${cfg.tamanoTextoCarta}px;
      font-weight: bold;
      color: ${carta.color};
      font-family: 'Comic Neue', 'Comic Sans MS', cursive;
      margin: 4px 0;
      text-align: center;
      word-wrap: break-word;
    `
    contenedor.appendChild(titulo)

    const descripcion = document.createElement('p')
    descripcion.textContent = carta.detalle
    descripcion.style.cssText = `
      font-size: ${cfg.tamanoTextoCarta - 2}px;
      color: #d0d0d0;
      font-family: 'Comic Neue', 'Comic Sans MS', cursive;
      text-align: center;
      margin: 0;
      word-wrap: break-word;
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    `
    contenedor.appendChild(descripcion)

    return contenedor
  }

  onVolver(callback) {
    this.callbackVolver = callback
  }

  mostrar() {
    if (this.containerEl) {
      this.containerEl.remove()
      this.containerEl = null
      this.gridEl = null
      this.sliderEl = null
    }
    this.crearUI()
    this.containerEl.style.display = 'flex'
    this.visible = true
  }

  ocultar() {
    if (this.containerEl) this.containerEl.style.display = 'none'
    this.visible = false
    this.cerrarModal()
  }
}
