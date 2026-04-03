import * as GUI from '@babylonjs/gui'

export class VistaPanelBase {
  constructor(gui) {
    this.gui = gui
    this.overlay = null
  }

  crearOverlay(nombre, background = 'rgba(12, 9, 8, 0.64)') {
    const overlay = new GUI.Rectangle(nombre)
    overlay.width = 1
    overlay.height = 1
    overlay.thickness = 0
    overlay.background = background
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
    color = '#fff7ef',
    left = '0px',
    width = '320px',
    height = '52px'
  }) {
    const boton = GUI.Button.CreateSimpleButton(nombre, texto)
    boton.width = width
    boton.height = height
    boton.top = top
    boton.left = left
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

  crearItemInfo({ nombre, texto, top, alterno = false }) {
    const bloque = new GUI.Rectangle(nombre)
    bloque.width = '78%'
    bloque.height = '52px'
    bloque.top = top
    bloque.cornerRadius = 14
    bloque.thickness = 0
    bloque.background = alterno ? '#3a2a24' : '#2f221d'
    bloque.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER

    const textoBloque = this.crearTexto({
      nombre: `${nombre}Texto`,
      texto,
      tamano: 18,
      alto: '48px',
      color: '#ffe2cc'
    })
    textoBloque.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    textoBloque.paddingLeft = '18px'
    bloque.addControl(textoBloque)

    return bloque
  }

  mostrar() {
    if (this.overlay) this.overlay.isVisible = true
  }

  ocultar() {
    if (this.overlay) this.overlay.isVisible = false
  }
}
