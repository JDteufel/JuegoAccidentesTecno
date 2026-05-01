export class VistaListaBase {
  constructor() {
    this.onVolverCallback = null
    this.containerEl = null
    this.tarjetaEl = null
    this.tituloEl = null
    this.itemsElements = []
    this.errorEl = null
  }

  crear() {
    const configuracion = this.obtenerConfiguracionLista()

    const container = document.createElement('div')
    container.id = configuracion.nombreOverlay
    container.style.cssText = `
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      display: none;
      justify-content: center;
      align-items: center;
      background: rgba(12, 9, 8, 0.64);
      z-index: 100;
      font-family: 'Comic Sans MS', cursive;
    `
    document.body.appendChild(container)
    this.containerEl = container

    const tarjeta = document.createElement('div')
    tarjeta.style.cssText = `
      width: 720px;
      max-width: 92vw;
      height: 620px;
      max-height: 90vh;
      border-radius: 28px;
      border: 2px solid #8e4d22;
      background: rgba(28, 21, 18, 0.95);
      box-shadow: 0 14px 22px rgba(0,0,0,0.4);
      padding: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    `
    container.appendChild(tarjeta)
    this.tarjetaEl = tarjeta

    this.tituloEl = document.createElement('h2')
    this.tituloEl.textContent = configuracion.titulo
    this.tituloEl.style.cssText = `
      color: #ffe4cf;
      font-size: 30px;
      margin: 0 0 30px 0;
      text-align: center;
    `
    tarjeta.appendChild(this.tituloEl)

    this.itemsElements = []
    configuracion.items.forEach((item, index) => {
      const itemEl = this._crearItemInfo({
        nombre: `${configuracion.prefijoItems}${index}`,
        texto: item,
        alterno: index % 2 !== 0
      })
      this.itemsElements.push(itemEl)
      tarjeta.appendChild(itemEl)
    })

    this.errorEl = document.createElement('div')
    this.errorEl.style.cssText = `
      color: #ff6b6b;
      font-size: 16px;
      height: 40px;
      text-align: center;
      visibility: hidden;
      margin-top: 10px;
    `
    tarjeta.appendChild(this.errorEl)

    const btnVolver = this._crearBoton(
      'Volver al Menú',
      '#362924',
      '#ffd8bc',
      () => this.onVolverCallback && this.onVolverCallback()
    )
    btnVolver.style.marginTop = '20px'
    tarjeta.appendChild(btnVolver)
  }

  _crearItemInfo({ nombre, texto, alterno = false }) {
    const bloque = document.createElement('div')
    bloque.style.cssText = `
      width: 78%;
      height: 52px;
      border-radius: 14px;
      background: ${alterno ? '#3a2a24' : '#2f221d'};
      display: flex;
      align-items: center;
      padding: 0 18px;
      box-sizing: border-box;
      margin-bottom: 8px;
    `

    const textoEl = document.createElement('span')
    textoEl.textContent = texto
    textoEl.style.cssText = `
      color: #ffe2cc;
      font-size: 18px;
      font-family: 'Comic Sans MS', cursive;
    `
    bloque.appendChild(textoEl)

    return bloque
  }

  _crearBoton(texto, fondo, color, callback) {
    const btn = document.createElement('button')
    btn.textContent = texto
    btn.style.cssText = `
      width: 320px;
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

  obtenerConfiguracionLista() {
    throw new Error('La subclase debe implementar obtenerConfiguracionLista()')
  }

  onVolver(callback) {
    this.onVolverCallback = callback
  }

  actualizarTitulo(texto) {
    if (this.tituloEl) {
      this.tituloEl.textContent = texto
    }
  }

  actualizarItems(items) {
    this.itemsElements.forEach((itemEl, index) => {
      const textoEl = itemEl.querySelector('span')
      if (textoEl) {
        textoEl.textContent = items[index] || ''
      }
      itemEl.style.visibility = items[index] ? 'visible' : 'hidden'
    })
  }

  mostrarError(mensaje) {
    if (this.errorEl) {
      this.errorEl.textContent = mensaje
      this.errorEl.style.visibility = 'visible'
    }
  }

  limpiarError() {
    if (this.errorEl) {
      this.errorEl.textContent = ''
      this.errorEl.style.visibility = 'hidden'
    }
  }

  mostrar() {
    if (this.containerEl) this.containerEl.style.display = 'flex'
  }

  ocultar() {
    if (this.containerEl) this.containerEl.style.display = 'none'
  }
}
