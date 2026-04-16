import { VistaPanelBase } from './VistaPanelBase.js'

export class VistaFormularioBase extends VistaPanelBase {
  constructor(gui) {
    super(gui)
    this.onVolverCallback = null
    this.onAccionCallback = null
    this.campos = {}
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
      const campoInput = this.crearCampoEntrada(campo)
      this.campos[campo.nombre] = campoInput
      tarjeta.addControl(campoInput)
    })

    // Crear elemento para mostrar errores
    this.errorText = this.crearTexto({
      nombre: configuracion.nombreOverlay + 'Error',
      texto: '',
      tamano: 16,
      alto: '40px',
      top: '70px',
      color: '#ff6b6b'
    })
    this.errorText.isVisible = false
    tarjeta.addControl(this.errorText)

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
        texto: 'Volver al Menú',
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

  getValorCampo(nombre) {
    const campo = this.campos[nombre]
    return campo ? campo.text : ''
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

  mostrarCargando(mostrar) {
    // Por defecto no hace nada, las subclases pueden sobrescribir
  }
}
