import carta1 from '../assets/cartas/carta1.svg'
import carta2 from '../assets/cartas/carta2.svg'
import carta3 from '../assets/cartas/carta3.svg'
import carta4 from '../assets/cartas/carta4.svg'
import carta5 from '../assets/cartas/carta5.svg'
import carta6 from '../assets/cartas/carta6.svg'

export class VistaAccidentes {
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
    container.id = 'vistaAccidentes'
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
    titulo.textContent = 'Accidentes Tecnológicos'
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

    const accidentes = [
      { nombre: 'Falla Eléctrica', desc: 'Sobrecarga en el sistema.', img: carta1 },
      { nombre: 'Cortocircuito', desc: 'Conexión defectuosa.', img: carta2 },
      { nombre: 'Explosión', desc: 'Liberación de energía violenta.', img: carta3 },
      { nombre: 'Error Humano', desc: 'Decisión incorrecta.', img: carta4 },
      { nombre: 'Fuga Química', desc: 'Sustancias peligrosas.', img: carta5 },
      { nombre: 'Incendio', desc: 'Combustión descontrolada.', img: carta6 }
    ]

    accidentes.forEach((accidente) => {
      grid.appendChild(this._crearAccidente(accidente))
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

  _crearAccidente({ nombre, desc, img }) {
    const contenedor = document.createElement('div')
    contenedor.style.cssText = `
      width: 200px;
      height: 220px;
      border-radius: 15px;
      border: 2px solid #a85a2a;
      background: rgba(28,20,18,0.95);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px;
      box-sizing: border-box;
      gap: 3px;
    `

    const imagen = document.createElement('img')
    imagen.src = img
    imagen.alt = nombre
    imagen.style.cssText = `
      width: 100%;
      height: 90px;
      object-fit: cover;
      border-radius: 8px;
    `
    contenedor.appendChild(imagen)

    const titulo = document.createElement('h3')
    titulo.textContent = nombre
    titulo.style.cssText = `
      font-size: 16px;
      font-weight: bold;
      color: #ffd6b5;
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
      color: #ffe9d6;
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
