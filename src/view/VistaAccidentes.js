import { seleccionarAccidentesAleatorios } from '../model/accidentes/index.js'
import { GestorAjusteRatio } from './base/GestorAjusteRatio.js'
import './estilos/EstiloVistaAccidentes.css'

export class VistaAccidentes {
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
      tamanoAccidente: esLandscape ? (esMovil ? 220 : esTablet ? 250 : 280) : (esMovil ? 150 : 280),
      altoMin: esLandscape ? (esMovil ? 160 : 180) : (esMovil ? 140 : 180),
      columnas: !esLandscape && esMovil ? 'repeat(2, 150px)' : 'auto-fill',
      gap: esMovil ? 12 : 20,
      paddingLateral: esMovil ? 10 : 20,
      tamanoTitulo: esMovil ? '24px' : esTablet ? '34px' : '42px',
      tamanoNombre: esLandscape ? (esMovil ? 15 : 18) : (esMovil ? 12 : 18),
      tamanoImagen: esLandscape ? (esMovil ? 70 : 90) : (esMovil ? 55 : 90),
      tamanoNivel: esLandscape ? (esMovil ? 11 : 12) : (esMovil ? 9 : 12),
      tamanoCat: esLandscape ? (esMovil ? 9 : 10) : (esMovil ? 7 : 10),
      tamanoDesc: esLandscape ? (esMovil ? 10 : 11) : (esMovil ? 8 : 11),
      headerGap: esMovil ? '12px' : '30px',
      paddingSuperior: esMovil ? '3%' : '4%',
      sliderAncho: 36
    }
  }

  crearUI() {
    const cfg = this._obtenerConfiguracion()

    const container = document.createElement('div')
    container.id = 'vistaAccidentes'
    container.className = 'accidentes-overlay'
    container.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;display:none;flex-direction:column;align-items:center;padding-top:${cfg.paddingSuperior};`
    document.body.appendChild(container)
    this.containerEl = container

    const header = document.createElement('div')
    header.className = 'accidentes-header'
    header.style.gap = cfg.headerGap
    header.style.padding = `0 ${cfg.paddingLateral}px`
    container.appendChild(header)

    const titulo = document.createElement('h1')
    titulo.textContent = 'Accidentes Tecnologicos'
    titulo.className = 'accidentes-titulo'
    titulo.style.fontSize = cfg.tamanoTitulo
    header.appendChild(titulo)

    const btnVolver = this._crearBoton('Volver a Reglas', '#362924', '#ffd8bc', () => {
      this.callbackVolver && this.callbackVolver()
    }, GestorAjusteRatio.esMovil())
    header.appendChild(btnVolver)

    const contenidoWrapper = document.createElement('div')
    contenidoWrapper.className = 'accidentes-contenido'
    container.appendChild(contenidoWrapper)

    const gridWrapper = document.createElement('div')
    gridWrapper.className = 'accidentes-grid-wrapper vista-accidentes-scroll'
    gridWrapper.style.padding = `5px ${cfg.paddingLateral}px 20px`
    gridWrapper.style.marginRight = `${cfg.sliderAncho}px`
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
      : `repeat(${cfg.columnas}, ${cfg.tamanoAccidente}px)`
    grid.className = 'accidentes-grid'
    grid.style.gridTemplateColumns = tamanoCSS
    grid.style.gap = `${cfg.gap}px`
    gridWrapper.appendChild(grid)
    this.gridEl = gridWrapper

    const accidentes = seleccionarAccidentesAleatorios(16)
    accidentes.forEach((accidente) => {
      grid.appendChild(this._crearAccidente(accidente, cfg))
    })

    const sliderBar = document.createElement('div')
    sliderBar.className = 'accidentes-slider-bar'
    sliderBar.style.width = `${cfg.sliderAncho}px`

    const slider = document.createElement('input')
    slider.type = 'range'
    slider.min = '0'
    slider.max = '100'
    slider.value = '0'
    slider.className = 'accidentes-slider'
    slider.style.width = `${cfg.sliderAncho - 8}px`
    slider.addEventListener('input', () => {
      const maxScroll = gridWrapper.scrollHeight - gridWrapper.clientHeight
      gridWrapper.scrollTop = (slider.value / 100) * maxScroll
    })

    sliderBar.appendChild(slider)
    contenidoWrapper.appendChild(sliderBar)
    this.sliderEl = slider

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
    overlay.id = 'modalAccidente'
    overlay.className = 'accidentes-modal-overlay'

    const contenido = document.createElement('div')
    contenido.id = 'modalAccidenteContenido'
    contenido.className = 'accidentes-modal-contenido'

    overlay.appendChild(contenido)
    document.body.appendChild(overlay)
    this.modalEl = { overlay, contenido }

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.cerrarModal()
    })
  }

  abrirModal(accidente, origenRect) {
    if (!this.modalEl) return
    const { overlay, contenido } = this.modalEl
    const nivelColor = accidente.nivel >= 3 ? '#ff4444' : accidente.nivel === 2 ? '#ffaa00' : '#ffcc66'
    const esMovil = GestorAjusteRatio.esMovil()
    const esLandscape = GestorAjusteRatio.esLandscape()

    const altoViewport = window.innerHeight
    const anchoViewport = window.innerWidth

    const altoModal = altoViewport * (esMovil && !esLandscape ? 0.85 : 0.7)
    const anchoModal = esMovil && !esLandscape
      ? anchoViewport * 0.9
      : Math.min(altoViewport * 0.55, anchoViewport * 0.6)

    const centroX = anchoViewport / 2
    const centroY = altoViewport / 2

    contenido.style.width = `${anchoModal}px`
    contenido.style.maxHeight = `${altoModal}px`
    contenido.style.left = `${centroX}px`
    contenido.style.top = `${centroY}px`
    contenido.style.transform = 'translate(-50%, -50%) scale(0.3)'
    contenido.style.opacity = '0'
    contenido.style.padding = `${Math.max(16, altoModal * 0.04)}px`
    contenido.style.gap = `${Math.max(10, altoModal * 0.015)}px`

    if (origenRect && !(esMovil && !esLandscape)) {
      const origenX = origenRect.left + origenRect.width / 2
      const origenY = origenRect.top + origenRect.height / 2
      contenido.style.transformOrigin = `${origenX - centroX + anchoModal / 2}px ${origenY - centroY + altoModal / 2}px`
    }

    contenido.innerHTML = ''
    contenido.style.border = `4px solid ${nivelColor}`

    const imagenSrc = accidente.obtenerImagen()
    if (imagenSrc) {
      const imagen = document.createElement('img')
      imagen.src = imagenSrc
      imagen.alt = accidente.nombre
      imagen.style.cssText = `
        width: 100%;
        max-height: ${altoModal * 0.35}px;
        object-fit: contain;
        border-radius: 14px;
      `
      contenido.appendChild(imagen)
    }

    const nivelBadge = document.createElement('span')
    nivelBadge.textContent = `Nivel ${accidente.nivel}`
    nivelBadge.style.cssText = `
      font-size: clamp(16px, ${altoModal * 0.035}px, 24px);
      font-weight: bold;
      color: ${nivelColor};
      background: rgba(0,0,0,0.5);
      padding: 8px 22px;
      border-radius: 10px;
    `
    contenido.appendChild(nivelBadge)

    const titulo = document.createElement('h2')
    titulo.textContent = accidente.nombre
    titulo.style.cssText = `
      font-size: clamp(28px, ${altoModal * 0.065}px, 44px);
      font-weight: bold;
      color: ${nivelColor};
      font-family: 'Comic Neue', 'Comic Sans MS', cursive;
      margin: 14px 0 8px;
      text-align: center;
    `
    contenido.appendChild(titulo)

    const codigo = document.createElement('span')
    codigo.textContent = `Codigo: ${accidente.codigo}`
    codigo.style.cssText = `
      font-size: clamp(14px, ${altoModal * 0.028}px, 20px);
      color: #aaa;
      font-family: 'Comic Neue', 'Comic Sans MS', cursive;
    `
    contenido.appendChild(codigo)

    const categoriasLabel = document.createElement('span')
    categoriasLabel.textContent = 'Categorias afectadas'
    categoriasLabel.style.cssText = `
      font-size: clamp(13px, ${altoModal * 0.025}px, 18px);
      color: #999;
      font-family: 'Comic Neue', 'Comic Sans MS', cursive;
      margin-top: 12px;
    `
    contenido.appendChild(categoriasLabel)

    const categorias = document.createElement('div')
    categorias.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
    `
    accidente.categoriasAfectadas.forEach((cat) => {
      const catBadge = document.createElement('span')
      catBadge.textContent = cat
      catBadge.style.cssText = `
        font-size: clamp(12px, ${altoModal * 0.024}px, 18px);
        color: #ffd8bc;
        background: rgba(168, 90, 42, 0.4);
        padding: 7px 16px;
        border-radius: 8px;
      `
      categorias.appendChild(catBadge)
    })
    contenido.appendChild(categorias)

    const descripcion = document.createElement('p')
    descripcion.textContent = accidente.descripcion
    descripcion.style.cssText = `
      font-size: clamp(15px, ${altoModal * 0.032}px, 22px);
      color: #ffe9d6;
      font-family: 'Comic Neue', 'Comic Sans MS', cursive;
      text-align: center;
      margin: 16px 0 0;
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

  _crearAccidente(accidente, cfg) {
    const nivelColor = accidente.nivel >= 3 ? '#ff4444' : accidente.nivel === 2 ? '#ffaa00' : '#ffcc66'

    const contenedor = document.createElement('div')
    contenedor.className = 'accidentes-item'
    contenedor.style.width = `${cfg.tamanoAccidente}px`
    contenedor.style.minHeight = `${cfg.altoMin}px`
    contenedor.style.borderColor = nivelColor
    contenedor.style.padding = '12px'

    if (GestorAjusteRatio.esLandscape() && !GestorAjusteRatio.esMovil()) {
      contenedor.addEventListener('mouseenter', () => {
        contenedor.style.transform = 'scale(1.05)'
        contenedor.style.boxShadow = `0 0 20px ${nivelColor}44`
      })
      contenedor.addEventListener('mouseleave', () => {
        contenedor.style.transform = 'scale(1)'
        contenedor.style.boxShadow = 'none'
      })
    }
    contenedor.addEventListener('click', () => {
      const rect = contenedor.getBoundingClientRect()
      this.abrirModal(accidente, rect)
    })

    const imagenSrc = accidente.obtenerImagen()
    if (imagenSrc) {
      const imagen = document.createElement('img')
      imagen.src = imagenSrc
      imagen.alt = accidente.nombre
      imagen.className = 'accidentes-item-imagen'
      imagen.style.height = `${cfg.tamanoImagen}px`
      contenedor.appendChild(imagen)
    }

    const nivelBadge = document.createElement('span')
    nivelBadge.textContent = `Nivel ${accidente.nivel}`
    nivelBadge.className = 'accidentes-item-nivel'
    nivelBadge.style.fontSize = `${cfg.tamanoNivel}px`
    nivelBadge.style.color = nivelColor
    contenedor.appendChild(nivelBadge)

    const titulo = document.createElement('h3')
    titulo.textContent = accidente.nombre
    titulo.className = 'accidentes-item-titulo'
    titulo.style.fontSize = `${cfg.tamanoNombre}px`
    titulo.style.color = nivelColor

    contenedor.appendChild(titulo)

    const categorias = document.createElement('div')
    categorias.className = 'accidentes-item-categorias'
    accidente.categoriasAfectadas.forEach((cat) => {
      const catBadge = document.createElement('span')
      catBadge.textContent = cat
      catBadge.className = 'accidentes-item-cat-badge'
      catBadge.style.fontSize = `${cfg.tamanoCat}px`
      categorias.appendChild(catBadge)
    })
    contenedor.appendChild(categorias)

    const descripcion = document.createElement('p')
    descripcion.textContent = accidente.descripcion
    descripcion.className = 'accidentes-item-descripcion'
    descripcion.style.fontSize = `${cfg.tamanoDesc}px`
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
