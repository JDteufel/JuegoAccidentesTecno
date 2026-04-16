import { VistaPanelBase } from './VistaPanelBase.js'

export class VistaListaBase extends VistaPanelBase {
  constructor(gui) {
    super(gui)
    this.onVolverCallback = null
    this.tarjeta = null
  }

  crear() {
    const configuracion = this.obtenerConfiguracionLista()
    const overlay = this.crearOverlay(configuracion.nombreOverlay)
    const tarjeta = this.crearTarjetaBase(configuracion.nombreTarjeta)
    overlay.addControl(tarjeta)

    tarjeta.addControl(
      this.crearTexto({
        nombre: configuracion.nombreTitulo,
        texto: configuracion.titulo,
        tamano: 30,
        alto: '72px',
        top: '-220px'
      })
    )

    configuracion.items.forEach((item, index) => {
      tarjeta.addControl(
        this.crearItemInfo({
          nombre: `${configuracion.prefijoItems}${index}`,
          texto: item,
          top: `${-85 + index * 64}px`,
          alterno: index % 2 !== 0
        })
      )
    })

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
}
