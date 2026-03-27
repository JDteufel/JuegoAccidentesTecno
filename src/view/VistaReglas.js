import * as GUI from '@babylonjs/gui'

export class VistaReglas {
  constructor(gui) {
    this.gui = gui
    this.overlay = null
    this.onVolverCallback = null
  }

  crear() {
    const overlay = this.crearOverlay('pantallaReglas')
    const tarjeta = this.crearTarjetaBase('tarjetaReglas')
    overlay.addControl(tarjeta)

    tarjeta.addControl(
      this.crearTexto({
        nombre: 'tituloReglas',
        texto: 'Reglas del Juego',
        tamano: 30,
        alto: '72px',
        top: '-220px'
      })
    )

    const items = [
      'Cada jugador recibe un perfil y cartas iniciales.',
      'Las cartas completan horas o actividades válidas para cada perfil.',
      'Los accidentes tecnológicos pueden debilitar o inhabilitar cartas.',
      'La partida termina cuando todos los perfiles se completan.'
    ]

    items.forEach((item, index) => {
      tarjeta.addControl(
        this.crearItemInfo({
          nombre: `regla${index}`,
          texto: item,
          top: `${-85 + index * 64}px`,
          alterno: index % 2 !== 0
        })
      )
    })

    tarjeta.addControl(
      this.crearBoton({
        nombre: 'reglasVolver',
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

  onVolver(callback) {
    this.onVolverCallback = callback
  }
}
