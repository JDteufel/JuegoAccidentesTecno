import * as BABYLON from '@babylonjs/core'
import * as GUI from '@babylonjs/gui'

export class VistaCartas {
  constructor(gui) {
    this.gui = gui
    this.overlay = null
    this.callbackVolver = null
    this.visible = false
  }

  crear() {
    this.crearUI()
  }

  crearUI() {
    const overlay = new GUI.Rectangle()
    overlay.width = 1
    overlay.height = 1
    overlay.thickness = 0
    overlay.background = 'rgba(12, 9, 8, 0.75)'
    overlay.isVisible = false
    this.gui.addControl(overlay)
    this.overlay = overlay

    // CONTENEDOR SUPERIOR CON TÍTULO Y BOTÓN
    const containerTop = new GUI.StackPanel()
    containerTop.width = 1
    containerTop.height = '80px'
    containerTop.top = '-45%'
    containerTop.isVertical = false
    containerTop.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    overlay.addControl(containerTop)

    const titulo = new GUI.TextBlock('tituloCartas', 'Actividades y Aplicaciones')
    titulo.fontSize = 42
    titulo.color = '#ffe6d1'
    titulo.fontFamily = 'Comic Sans MS'
    containerTop.addControl(titulo)

    // BOTÓN VOLVER
    const botonVolver = GUI.Button.CreateSimpleButton('volverCartas', 'Volver a Reglas')
    botonVolver.width = '320px'
    botonVolver.height = '52px'
    botonVolver.color = '#ffd8bc'
    botonVolver.background = '#362924'
    botonVolver.cornerRadius = 18
    botonVolver.thickness = 0
    botonVolver.fontSize = 21
    botonVolver.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    if (botonVolver.textBlock) {
      botonVolver.textBlock.fontFamily = 'Comic Sans MS'
    }

    botonVolver.onPointerUpObservable.add(() => {
      this.callbackVolver && this.callbackVolver()
    })

    containerTop.addControl(botonVolver)

    // GRID sin scroll
    const grid = new GUI.Grid()
    grid.width = '90%'
    grid.height = '70%'
    grid.top = '5%'
    grid.addColumnDefinition(0.33)
    grid.addColumnDefinition(0.33)
    grid.addColumnDefinition(0.34)

    for (let i = 0; i < 2; i++) {
      grid.addRowDefinition(220)
    }

    overlay.addControl(grid)

    const cartas = [
      { nombre: 'GitHub', desc: 'Plataforma de desarrollo colaborativo.', tipo: 'Trabajo' },
      { nombre: 'Discord', desc: 'Comunicación en tiempo real.', tipo: 'Entretenimiento' },
      { nombre: 'Google Drive', desc: 'Almacenamiento en la nube.', tipo: 'Trabajo' },
      { nombre: 'YouTube', desc: 'Plataforma de videos.', tipo: 'Entretenimiento' },
      { nombre: 'Slack', desc: 'Mensajería empresarial.', tipo: 'Trabajo' },
      { nombre: 'Twitch', desc: 'Streaming en vivo.', tipo: 'Entretenimiento' }
    ]

    cartas.forEach((carta, i) => {
      const fila = Math.floor(i / 3)
      const col = i % 3
      grid.addControl(this.crearCarta(carta, i), fila, col)
    })
  }

  crearCarta({ nombre, desc, tipo }, index) {
    const contenedor = new GUI.Rectangle()
    contenedor.width = '200px'
    contenedor.height = '220px'
    contenedor.cornerRadius = 15
    contenedor.thickness = 2
    contenedor.borderColor = '#4a90e2'
    contenedor.background = 'rgba(28,28,40,0.95)'

    // Stack vertical para organizar los elementos
    const stack = new GUI.StackPanel()
    stack.width = '95%'
    stack.height = '95%'
    stack.isVertical = true
    stack.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    stack.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    stack.spacing = 3
    contenedor.addControl(stack)

    // Badge de tipo
    const badge = new GUI.TextBlock()
    badge.text = tipo
    badge.fontSize = 11
    badge.fontWeight = 'bold'
    badge.color = tipo === 'Trabajo' ? '#90ee90' : '#ffa500'
    badge.background = 'rgba(0,0,0,0.5)'
    badge.paddingTop = '5px'
    badge.paddingBottom = '5px'
    badge.height = '25px'
    badge.cornerRadius = 5
    stack.addControl(badge)

    const titulo = new GUI.TextBlock()
    titulo.text = nombre
    titulo.fontSize = 18
    titulo.fontWeight = 'bold'
    titulo.color = '#4a90e2'
    titulo.fontFamily = 'Comic Sans MS'
    titulo.height = '35px'
    titulo.textWrapping = true
    stack.addControl(titulo)

    const descripcion = new GUI.TextBlock()
    descripcion.text = desc
    descripcion.fontSize = 12
    descripcion.color = '#d0d0d0'
    descripcion.textWrapping = true
    descripcion.height = '60px'
    descripcion.fontFamily = 'Comic Sans MS'
    stack.addControl(descripcion)

    return contenedor
  }

  onVolver(callback) {
    this.callbackVolver = callback
  }

  mostrar() {
    if (this.overlay) this.overlay.isVisible = true
    this.visible = true
  }

  ocultar() {
    if (this.overlay) this.overlay.isVisible = false
    this.visible = false
  }
}