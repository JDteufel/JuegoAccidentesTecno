import { GestorAjusteRatio } from './GestorAjusteRatio.js'
import temaService from '../../services/TemaService.js'
import '../estilos/EstiloVistaListaBase.css'

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
    const esMovil = GestorAjusteRatio.esMovil()

    const container = document.createElement('div')
    container.id = configuracion.nombreOverlay
    container.className = 'lista-overlay'
    container.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;display:none;justify-content:center;align-items:center;padding:${esMovil ? '12px' : '20px'};`
    document.body.appendChild(container)
    this.containerEl = container

    const tarjeta = document.createElement('div')
    tarjeta.className = 'lista-tarjeta'
    tarjeta.style.borderRadius = esMovil ? '18px' : '28px'
    tarjeta.style.padding = esMovil ? '24px 18px' : '40px'
    container.appendChild(tarjeta)
    this.tarjetaEl = tarjeta

    this.tituloEl = document.createElement('h2')
    this.tituloEl.textContent = configuracion.titulo
    this.tituloEl.className = 'lista-titulo'
    this.tituloEl.style.fontSize = esMovil ? '26px' : '32px'
    this.tituloEl.style.marginBottom = esMovil ? '20px' : '30px'
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
    this.errorEl.className = 'lista-error'
    tarjeta.appendChild(this.errorEl)

    const btnVolver = this._crearBoton(
      'Volver al Menú',
      'dark',
      () => this.onVolverCallback && this.onVolverCallback()
    )
    btnVolver.style.marginTop = '20px'
    tarjeta.appendChild(btnVolver)
  }

  _crearItemInfo({ nombre, texto, alterno = false }) {
    const esMovil = GestorAjusteRatio.esMovil()
    const bloque = document.createElement('div')
    bloque.className = alterno ? 'lista-item lista-item-alterno' : 'lista-item'
    bloque.style.width = esMovil ? '92%' : '78%'
    bloque.style.minHeight = esMovil ? '48px' : '52px'
    bloque.style.padding = esMovil ? '0 14px' : '0 18px'

    const textoEl = document.createElement('span')
    textoEl.textContent = texto
    textoEl.className = 'lista-item-texto'
    textoEl.style.fontSize = esMovil ? '17px' : '19px'
    bloque.appendChild(textoEl)

    return bloque
  }

  _crearBoton(texto, temaClave, callback) {
    const esMovil = GestorAjusteRatio.esMovil()
    const colores = temaService.obtenerColoresTema(temaService.obtenerTemaActual())
    let fondo, colorTexto
    if (temaClave === 'primary') {
      fondo = colores.primary
      colorTexto = colores.primaryText
    } else if (temaClave === 'secondary') {
      fondo = colores.secondary
      colorTexto = colores.secondaryText
    } else if (temaClave === 'dark') {
      fondo = colores.darkAlt
      colorTexto = colores.darkAltText
    } else {
      fondo = colores.darkAlt
      colorTexto = colores.darkAltText
    }
    const btn = document.createElement('button')
    btn.textContent = texto
    btn.className = 'lista-boton'
    btn.style.width = esMovil ? '90%' : '320px'
    btn.style.background = fondo
    btn.style.color = colorTexto
    btn.style.fontSize = esMovil ? '19px' : '22px'
    this._agregarFeedbackBoton(btn)
    btn.addEventListener('click', callback)
    return btn
  }

  _agregarFeedbackBoton(btn) {
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

  aplicarTema(temaId) {
    const colores = temaService.obtenerColoresTema(temaId)

    const botones = this.containerEl?.querySelectorAll('.lista-boton')
    if (botones) {
      botones.forEach(btn => {
        const texto = btn.textContent
        if (texto === 'Volver al Menú' || texto === 'Volver a Reglas') {
          btn.style.background = colores.darkAlt
          btn.style.color = colores.darkAltText
        } else if (texto === 'Ver Cartas' || texto === 'Ver Accidentes') {
          btn.style.background = colores.darkAlt
          btn.style.color = colores.darkAltText
        }
      })
    }
  }
}
