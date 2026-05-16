import './estilos/EstiloVistaInicialR.css'
import temaService from '../services/TemaService.js'

export class VistaInicialR {
  constructor() {
    this._onCrearJuego = null
    this._onTutorial = null
    this._onReglas = null
    this._onCerrarSesion = null
    this._onConfiguracion = null
    this.containerEl = null
  }

  crear() {
    const container = document.createElement('div')
    container.id = 'pantallaMenuInicialRegistrado'
    container.className = 'inicialr-overlay'
    container.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:none;justify-content:center;align-items:center;'
    document.body.appendChild(container)
    this.containerEl = container

    const panelAcciones = document.createElement('div')
    panelAcciones.className = 'inicialr-panel-acciones'
    container.appendChild(panelAcciones)

    const titulo = document.createElement('h2')
    titulo.textContent = 'Menú de Gamemaster'
    titulo.className = 'inicialr-titulo'
    panelAcciones.appendChild(titulo)

    const btnCrearJuego = this._crearBoton(
      'Crear juego',
      'primary',
      () => this._onCrearJuego && this._onCrearJuego()
    )
    btnCrearJuego.style.marginBottom = '10px'
    panelAcciones.appendChild(btnCrearJuego)

    const btnTutorial = this._crearBoton(
      'Tutorial',
      'dark',
      () => this._onTutorial && this._onTutorial()
    )
    btnTutorial.style.marginBottom = '10px'
    panelAcciones.appendChild(btnTutorial)

    const btnReglas = this._crearBoton(
      'Ver reglas',
      'dark',
      () => this._onReglas && this._onReglas()
    )
    panelAcciones.appendChild(btnReglas)

    const barraSuperior = document.createElement('div')
    barraSuperior.className = 'inicialr-barra-superior'
    container.appendChild(barraSuperior)

    const btnConfig = this._crearBotonConfig(
      () => this._onConfiguracion && this._onConfiguracion()
    )
    barraSuperior.appendChild(btnConfig)

    const btnCerrarSesion = this._crearBoton(
      'Cerrar Sesión',
      'danger',
      () => this._onCerrarSesion && this._onCerrarSesion()
    )
    btnCerrarSesion.style.width = '220px'
    btnCerrarSesion.style.height = '44px'
    btnCerrarSesion.style.fontSize = '18px'
    barraSuperior.appendChild(btnCerrarSesion)
  }

  _crearBoton(texto, temaClave, callback) {
    const colores = temaService.obtenerColoresTema(temaService.obtenerTemaActual())
    let fondo, colorTexto
    if (temaClave === 'primary') {
      fondo = colores.primary
      colorTexto = colores.primaryText
    } else if (temaClave === 'secondary') {
      fondo = colores.secondary
      colorTexto = colores.secondaryText
    } else if (temaClave === 'danger') {
      fondo = colores.danger || '#a84f16'
      colorTexto = colores.dangerText || '#fff1e3'
    } else {
      fondo = colores.darkAlt
      colorTexto = colores.darkAltText
    }
    const btn = document.createElement('button')
    btn.textContent = texto
    btn.className = 'inicialr-boton'
    btn.style.background = fondo
    btn.style.color = colorTexto
    const aplicarActivo = () => {
      btn.style.opacity = '0.85'
      btn.style.transform = 'scale(0.98)'
    }
    const removerActivo = () => {
      btn.style.opacity = '1'
      btn.style.transform = 'scale(1)'
    }
    btn.addEventListener('mouseenter', aplicarActivo)
    btn.addEventListener('mouseleave', removerActivo)
    btn.addEventListener('touchstart', aplicarActivo, { passive: true })
    btn.addEventListener('touchend', removerActivo, { passive: true })
    btn.addEventListener('touchcancel', removerActivo, { passive: true })
    btn.addEventListener('click', callback)
    return btn
  }

  _crearBotonConfig(callback) {
    const colores = temaService.obtenerColoresTema(temaService.obtenerTemaActual())
    const btn = document.createElement('button')
    btn.innerHTML = '&#9881;'
    btn.className = 'inicialr-boton-config'
    btn.style.width = '44px'
    btn.style.height = '44px'
    btn.style.background = 'transparent'
    btn.style.color = colores.textPrimary
    btn.style.fontSize = '24px'
    btn.style.border = 'none'
    btn.style.borderRadius = '12px'
    btn.style.cursor = 'pointer'
    btn.style.display = 'flex'
    btn.style.alignItems = 'center'
    btn.style.justifyContent = 'center'
    btn.style.transition = 'transform 0.3s, opacity 0.2s'
    const aplicarActivo = () => {
      btn.style.opacity = '0.7'
      btn.style.transform = 'rotate(90deg) scale(0.95)'
    }
    const removerActivo = () => {
      btn.style.opacity = '1'
      btn.style.transform = 'rotate(0deg) scale(1)'
    }
    btn.addEventListener('mouseenter', aplicarActivo)
    btn.addEventListener('mouseleave', removerActivo)
    btn.addEventListener('touchstart', aplicarActivo, { passive: true })
    btn.addEventListener('touchend', removerActivo, { passive: true })
    btn.addEventListener('touchcancel', removerActivo, { passive: true })
    btn.addEventListener('click', callback)
    return btn
  }

  onCrearJuego(callback) {
    this._onCrearJuego = callback
  }

  onTutorial(callback) {
    this._onTutorial = callback
  }

  onReglas(callback) {
    this._onReglas = callback
  }

  onCerrarSesion(callback) {
    this._onCerrarSesion = callback
  }

  onConfiguracion(callback) {
    this._onConfiguracion = callback
  }

  mostrar() {
    if (this.containerEl) this.containerEl.style.display = 'flex'
  }

  ocultar() {
    if (this.containerEl) this.containerEl.style.display = 'none'
  }

  aplicarTema(temaId) {
    const colores = temaService.obtenerColoresTema(temaId)

    if (this.containerEl) {
      this.containerEl.style.background = colores.overlay
    }

    const panelAcciones = this.containerEl?.querySelector('.inicialr-panel-acciones')
    if (panelAcciones) {
      panelAcciones.style.background = colores.cardBg
      panelAcciones.style.borderColor = colores.border
    }

    const barraSuperior = this.containerEl?.querySelector('.inicialr-barra-superior')
    if (barraSuperior) {
      barraSuperior.style.background = colores.topbar
    }

    const titulo = this.containerEl?.querySelector('.inicialr-titulo')
    if (titulo) {
      titulo.style.color = colores.textSecondary
    }

    const botones = this.containerEl?.querySelectorAll('.inicialr-boton')
    if (botones) {
      botones.forEach(btn => {
        const texto = btn.textContent
        if (texto === 'Crear juego') {
          btn.style.background = colores.primary
          btn.style.color = colores.primaryText
        } else if (texto === 'Cerrar Sesión') {
          btn.style.background = colores.danger || '#a84f16'
          btn.style.color = colores.dangerText || '#fff1e3'
        } else if (texto === 'Tutorial' || texto === 'Ver reglas') {
          btn.style.background = colores.darkAlt
          btn.style.color = colores.darkAltText
        }
      })
    }

    const btnConfig = this.containerEl?.querySelector('.inicialr-boton-config')
    if (btnConfig) {
      btnConfig.style.color = colores.textPrimary
    }
  }
}
