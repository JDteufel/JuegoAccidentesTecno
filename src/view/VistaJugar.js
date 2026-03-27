import * as GUI from '@babylonjs/gui'

export class VistaJugar {
  constructor(gui) {
    this.gui = gui
    this.overlay = null
    this.onVolverCallback = null
    this.onAccionCallback = null
  }

  crear() {
    const overlay = this.crearOverlay('pantallaJugar')
    const tarjeta = this.crearTarjetaBase('tarjetaJugar')
    overlay.addControl(tarjeta)

    tarjeta.addControl(
      this.crearTexto({
        nombre: 'tituloJugar',
        texto: 'Jugar',
        tamano: 30,
        alto: '72px',
        top: '-220px'
      })
    )

    tarjeta.addControl(
      this.crearCampoEntrada({
        nombre: 'jugarCodigo',
        placeholder: 'Código del lobby',
        top: '-70px'
      })
    )

    tarjeta.addControl(
      this.crearCampoEntrada({
        nombre: 'jugarNombre',
        placeholder: 'Nombre temporal',
        top: '8px'
      })
    )

    tarjeta.addControl(
      this.crearBoton({
        nombre: 'jugarAccion',
        texto: 'Entrar al lobby',
        top: '115px',
        callback: () => this.onAccionCallback && this.onAccionCallback()
      })
    )

    tarjeta.addControl(
      this.crearBoton({
        nombre: 'jugarVolver',
        texto: 'Volver al menú',
        top: '185px',
        fondo: '#362924',
        color: '#ffd8bc',
        callback: () => this.onVolverCallback && this.onVolverCallback()
      })
    )

    this.overlay = overlay
  }

  crearOverlay(nombre) {
    const overlay = new GUI.Rectangle(nombre)
    overlay.width = 1
    overlay.height = 1
    overlay.thickness = 0
    overlay.background = 'rgba(12, 9, 8, 0.64)'
    overlay.isVisible = false
    this.gui.addControl(overlay)
    return overlay
  }

  crearTarjetaBase(nombre) {
    const tarjeta = new GUI.Rectangle(nombre)
    tarjeta.width = '720px'
    tarjeta.height = '620px'
    tarjeta.maxWidth = 0.92
    tarjeta.maxHeight = 0.9
    tarjeta.cornerRadius = 28
    tarjeta.thickness = 2
    tarjeta.color = '#8e4d22'
    tarjeta.background = 'rgba(28, 21, 18, 0.95)'
    tarjeta.shadowColor = '#00000066'
    tarjeta.shadowBlur = 22
    tarjeta.shadowOffsetX = 0
    tarjeta.shadowOffsetY = 14
    return tarjeta
  }

  crearTexto({
    nombre,
    texto,
    tamano,
    alto,
    top = '0px',
    color = '#ffe4cf'
  }) {
    const bloque = new GUI.TextBlock(nombre, texto)
    bloque.width = '82%'
    bloque.height = alto
    bloque.color = color
    bloque.fontSize = tamano
    bloque.fontFamily = 'Comic Sans MS'
    bloque.textWrapping = true
    bloque.top = top
    return bloque
  }

  crearBoton({
    nombre,
    texto,
    top,
    callback,
    fondo = '#d66a1f',
    color = '#fff7ef'
  }) {
    const boton = GUI.Button.CreateSimpleButton(nombre, texto)
    boton.width = '320px'
    boton.height = '52px'
    boton.top = top
    boton.color = color
    boton.background = fondo
    boton.cornerRadius = 18
    boton.thickness = 0
    boton.fontSize = 21
    boton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    if (boton.textBlock) {
      boton.textBlock.fontFamily = 'Comic Sans MS'
    }
    boton.onPointerUpObservable.add(callback)
    return boton
  }

  crearCampoEntrada({ nombre, placeholder, top }) {
    const input = new GUI.InputText(nombre)
    input.width = '76%'
    input.height = '54px'
    input.top = top
    input.color = '#fff2e8'
    input.background = '#2b211d'
    input.focusedBackground = '#352821'
    input.thickness = 2
    input.cornerRadius = 16
    input.placeholderText = placeholder
    input.placeholderColor = '#d6a98a'
    input.fontSize = 20
    input.fontFamily = 'Comic Sans MS'
    input.maxWidth = '520px'
    input.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    return input
  }

  mostrar() {
    if (this.overlay) this.overlay.isVisible = true
  }

  ocultar() {
    if (this.overlay) this.overlay.isVisible = false
  }

  onVolver(callback) {
    this.onVolverCallback = callback
  }

  onAccion(callback) {
    this.onAccionCallback = callback
  }
}
