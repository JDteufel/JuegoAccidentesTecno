export class VistaCartas {
  constructor() {
    this.callbackVolver = null
    this.visible = false
    this.containerEl = null
  }

  crear() {
    this.crearUI()
  }

  crearUI() {
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
      font-family: 'Comic Sans MS', cursive;
      padding-top: 5%;
    `
    document.body.appendChild(container)
    this.containerEl = container

    const header = document.createElement('div')
    header.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 40px;
      margin-bottom: 30px;
    `
    container.appendChild(header)

    const titulo = document.createElement('h1')
    titulo.textContent = 'Actividades y Aplicaciones'
    titulo.style.cssText = `
      color: #ffe6d1;
      font-size: 42px;
      margin: 0;
    `
    header.appendChild(titulo)

    const btnVolver = this._crearBoton('Volver a Reglas', '#362924', '#ffd8bc', () => {
      this.callbackVolver && this.callbackVolver()
    })
    header.appendChild(btnVolver)

    const grid = document.createElement('div')
    grid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(3, 220px);
      grid-template-rows: repeat(2, 220px);
      gap: 20px;
      justify-content: center;
    `
    container.appendChild(grid)

    const cartas = [
      { nombre: 'GitHub', desc: 'Plataforma de desarrollo colaborativo.', tipo: 'Trabajo' },
      { nombre: 'Discord', desc: 'Comunicación en tiempo real.', tipo: 'Entretenimiento' },
      { nombre: 'Google Drive', desc: 'Almacenamiento en la nube.', tipo: 'Trabajo' },
      { nombre: 'YouTube', desc: 'Plataforma de videos.', tipo: 'Entretenimiento' },
      { nombre: 'Slack', desc: 'Mensajería empresarial.', tipo: 'Trabajo' },
      { nombre: 'Twitch', desc: 'Streaming en vivo.', tipo: 'Entretenimiento' }
    ]

    cartas.forEach((carta) => {
      grid.appendChild(this._crearCarta(carta))
    })
  }

  _crearBoton(texto, fondo, color, callback) {
    const btn = document.createElement('button')
    btn.textContent = texto
    btn.style.cssText = `
      padding: 10px 24px;
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

  _crearCarta({ nombre, desc, tipo }) {
    const contenedor = document.createElement('div')
    contenedor.style.cssText = `
      width: 200px;
      height: 220px;
      border-radius: 15px;
      border: 2px solid #4a90e2;
      background: rgba(28,28,40,0.95);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px;
      box-sizing: border-box;
      gap: 3px;
    `

    const badge = document.createElement('span')
    badge.textContent = tipo
    badge.style.cssText = `
      font-size: 11px;
      font-weight: bold;
      color: ${tipo === 'Trabajo' ? '#90ee90' : '#ffa500'};
      background: rgba(0,0,0,0.5);
      padding: 5px 10px;
      border-radius: 5px;
    `
    contenedor.appendChild(badge)

    const titulo = document.createElement('h3')
    titulo.textContent = nombre
    titulo.style.cssText = `
      font-size: 18px;
      font-weight: bold;
      color: #4a90e2;
      font-family: 'Comic Sans MS', cursive;
      margin: 5px 0;
      text-align: center;
      word-wrap: break-word;
    `
    contenedor.appendChild(titulo)

    const descripcion = document.createElement('p')
    descripcion.textContent = desc
    descripcion.style.cssText = `
      font-size: 12px;
      color: #d0d0d0;
      font-family: 'Comic Sans MS', cursive;
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
    if (this.containerEl) this.containerEl.style.display = 'flex'
    this.visible = true
  }

  ocultar() {
    if (this.containerEl) this.containerEl.style.display = 'none'
    this.visible = false
  }
}
