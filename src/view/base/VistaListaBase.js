import { VistaPanelBase } from './VistaPanelBase.js'

export class VistaListaBase extends VistaPanelBase {
  constructor(gui) {
    super(gui)
    this.onVolverCallback = null
    this.tarjeta = null
    this.tituloControl = null
    this.itemsControls = []
    this.errorText = null
  }

  crear() {
    const configuracion = this.obtenerConfiguracionLista()
    const overlay = this.crearOverlay(configuracion.nombreOverlay)
    const tarjeta = this.crearTarjetaBase(configuracion.nombreTarjeta)
    overlay.addControl(tarjeta)

    this.tituloControl = this.crearTexto({
      nombre: configuracion.nombreTitulo,
      texto: configuracion.titulo,
      tamano: 30,
      alto: '72px',
      top: '-220px'
    })
    tarjeta.addControl(this.tituloControl)

    configuracion.items.forEach((item, index) => {
      const itemControl = this.crearItemInfo({
        nombre: `${configuracion.prefijoItems}${index}`,
        texto: item,
        top: `${-85 + index * 64}px`,
        alterno: index % 2 !== 0
      })
      this.itemsControls.push(itemControl)
      tarjeta.addControl(itemControl)
    })

    this.errorText = this.crearTexto({
      nombre: `${configuracion.nombreOverlay}Error`,
      texto: '',
      tamano: 16,
      alto: '40px',
      top: '125px',
      color: '#ff6b6b'
    })
    this.errorText.isVisible = false
    tarjeta.addControl(this.errorText)

    tarjeta.addControl(
      this.crearBoton({
        nombre: configuracion.nombreBotonVolver,
        texto: 'Volver al Menú',
        top: '185px',
        fondo: '#362924',
        color: '#ffd8bc',
        callback: () => this.onVolverCallback && this.onVolverCallback()
      })
    )

    this.overlay = overlay
    this.tarjeta = tarjeta
  }

  obtenerConfiguracionLista() {
    throw new Error('La subclase debe implementar obtenerConfiguracionLista()')
  }

  onVolver(callback) {
    this.onVolverCallback = callback
  }

  actualizarTitulo(texto) {
    if (this.tituloControl) {
      this.tituloControl.text = texto
    }
  }

  actualizarItems(items) {
    this.itemsControls.forEach((itemControl, index) => {
      const textoControl = itemControl.children[0]
      if (textoControl) {
        textoControl.text = items[index] || ''
      }
      itemControl.isVisible = Boolean(items[index])
    })
  }

  mostrarError(mensaje) {
    if (this.errorText) {
      this.errorText.text = mensaje
      this.errorText.isVisible = true
    }
  }

  limpiarError() {
    if (this.errorText) {
      this.errorText.text = ''
      this.errorText.isVisible = false
    }
  }
}
