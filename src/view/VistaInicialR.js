export class VistaInicialR {
  constructor() {
    this.onCrearJuego = null
    this.onTutorial = null
    this.onReglas = null
    this.onCerrarSesion = null
    this.containerEl = null
  }

  crear() {
    const container = document.createElement('div')
    container.id = 'pantallaMenuInicialRegistrado'
    container.style.cssText = `
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      display: none;
      justify-content: center;
      align-items: center;
      background: rgba(12, 9, 8, 0.48);
      z-index: 100;
      font-family: 'Comic Sans MS', cursive;
    `
    document.body.appendChild(container)
    this.containerEl = container

    const panelAcciones = document.createElement('div')
    panelAcciones.style.cssText = `
      position: absolute;
      top: 35%;
      left: 10%;
      width: 320px;
      height: 280px;
      border-radius: 30px;
      border: 2px solid #8a4a20;
      background: rgba(28, 20, 18, 0.92);
      box-shadow: 0 16px 28px rgba(0,0,0,0.4);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 25px;
    `
    container.appendChild(panelAcciones)

    const titulo = document.createElement('h2')
    titulo.textContent = 'Menú de Usuario Registrado'
    titulo.style.cssText = `
      color: #ffd9bd;
      font-size: 24px;
      margin: 0 0 20px 0;
      text-align: center;
    `
    panelAcciones.appendChild(titulo)

    const btnCrearJuego = this._crearBoton(
      'Crear juego',
      '#d66a1f',
      '#fff7ef',
      () => this.onCrearJuego && this.onCrearJuego()
    )
    btnCrearJuego.style.marginBottom = '10px'
    panelAcciones.appendChild(btnCrearJuego)

    const btnTutorial = this._crearBoton(
      'Tutorial',
      '#3c2d27',
      '#ffd6b7',
      () => this.onTutorial && this.onTutorial()
    )
    btnTutorial.style.marginBottom = '10px'
    panelAcciones.appendChild(btnTutorial)

    const btnReglas = this._crearBoton(
      'Ver reglas',
      '#3c2d27',
      '#ffd6b7',
      () => this.onReglas && this.onReglas()
    )
    panelAcciones.appendChild(btnReglas)

    const barraSuperior = document.createElement('div')
    barraSuperior.style.cssText = `
      position: absolute;
      top: 6%;
      right: 40px;
      display: flex;
      align-items: center;
      gap: 12px;
      height: 92px;
      background: rgba(18, 14, 13, 0.72);
      padding: 0 20px;
      border-radius: 18px;
      box-sizing: border-box;
    `
    container.appendChild(barraSuperior)

    const btnCerrarSesion = this._crearBoton(
      'Cerrar Sesión',
      '#a84f16',
      '#fff1e3',
      () => this.onCerrarSesion && this.onCerrarSesion()
    )
    btnCerrarSesion.style.cssText += `
      width: 220px;
      height: 44px;
      font-size: 18px;
    `
    barraSuperior.appendChild(btnCerrarSesion)
  }

  _crearBoton(texto, fondo, color, callback) {
    const btn = document.createElement('button')
    btn.textContent = texto
    btn.style.cssText = `
      width: 290px;
      height: 52px;
      border: none;
      border-radius: 18px;
      background: ${fondo};
      color: ${color};
      font-size: 21px;
      font-family: 'Comic Sans MS', cursive;
      cursor: pointer;
      transition: transform 0.2s, opacity 0.2s;
    `
    btn.addEventListener('mouseenter', () => {
      btn.style.opacity = '0.85'
      btn.style.transform = 'scale(1.05)'
    })
    btn.addEventListener('mouseleave', () => {
      btn.style.opacity = '1'
      btn.style.transform = 'scale(1)'
    })
    btn.addEventListener('click', callback)
    return btn
  }

  setOnCrearJuego(callback) {
    this.onCrearJuego = callback
  }

  setOnTutorial(callback) {
    this.onTutorial = callback
  }

  setOnReglas(callback) {
    this.onReglas = callback
  }

  setOnCerrarSesion(callback) {
    this.onCerrarSesion = callback
  }

  mostrar() {
    if (this.containerEl) this.containerEl.style.display = 'flex'
  }

  ocultar() {
    if (this.containerEl) this.containerEl.style.display = 'none'
  }
}
