import './estilos/EstiloVistaInicialR.css'

export class VistaInicialR {
  constructor() {
    this._onCrearJuego = null
    this._onTutorial = null
    this._onReglas = null
    this._onCerrarSesion = null
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
      '#d66a1f',
      '#fff7ef',
      () => this._onCrearJuego && this._onCrearJuego()
    )
    btnCrearJuego.style.marginBottom = '10px'
    panelAcciones.appendChild(btnCrearJuego)

    const btnTutorial = this._crearBoton(
      'Tutorial',
      '#3c2d27',
      '#ffd6b7',
      () => this._onTutorial && this._onTutorial()
    )
    btnTutorial.style.marginBottom = '10px'
    panelAcciones.appendChild(btnTutorial)

    const btnReglas = this._crearBoton(
      'Ver reglas',
      '#3c2d27',
      '#ffd6b7',
      () => this._onReglas && this._onReglas()
    )
    panelAcciones.appendChild(btnReglas)

    const barraSuperior = document.createElement('div')
    barraSuperior.className = 'inicialr-barra-superior'
    container.appendChild(barraSuperior)

    const btnCerrarSesion = this._crearBoton(
      'Cerrar Sesión',
      '#a84f16',
      '#fff1e3',
      () => this._onCerrarSesion && this._onCerrarSesion()
    )
    btnCerrarSesion.style.width = '220px'
    btnCerrarSesion.style.height = '44px'
    btnCerrarSesion.style.fontSize = '18px'
    barraSuperior.appendChild(btnCerrarSesion)
  }

  _crearBoton(texto, fondo, color, callback) {
    const btn = document.createElement('button')
    btn.textContent = texto
    btn.className = 'inicialr-boton'
    btn.style.background = fondo
    btn.style.color = color
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

  mostrar() {
    if (this.containerEl) this.containerEl.style.display = 'flex'
  }

  ocultar() {
    if (this.containerEl) this.containerEl.style.display = 'none'
  }
}
