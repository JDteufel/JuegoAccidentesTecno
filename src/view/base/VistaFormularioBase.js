import { VistaPanelBase } from './VistaPanelBase.js'

export class VistaFormularioBase extends VistaPanelBase {
  constructor(gui) {
    super(gui)
    this.onVolverCallback = null
    this.onAccionCallback = null
  }

  crear() {
    const configuracion = this.obtenerConfiguracionFormulario()
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

    configuracion.campos.forEach((campo) => {
      tarjeta.addControl(this.crearCampoEntrada(campo))
    })

    tarjeta.addControl(
      this.crearBoton({
        nombre: configuracion.nombreBotonAccion,
        texto: configuracion.textoBotonAccion,
        top: '115px',
        callback: () => this.onAccionCallback && this.onAccionCallback()
      })
    )

    tarjeta.addControl(
      this.crearBoton({
        nombre: configuracion.nombreBotonVolver,
        texto: 'Volver al menu',
        top: '185px',
        fondo: '#362924',
        color: '#ffd8bc',
        callback: () => this.onVolverCallback && this.onVolverCallback()
      })
    )

    this.overlay = overlay
  }

  obtenerConfiguracionFormulario() {
    throw new Error('La subclase debe implementar obtenerConfiguracionFormulario()')
  }

  onVolver(callback) {
    this.onVolverCallback = callback
  }

  onAccion(callback) {
    this.onAccionCallback = callback
  }
}
