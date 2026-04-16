import * as BABYLON from '@babylonjs/core'
import * as GUI from '@babylonjs/gui'

import carta1 from '../assets/cartas/carta1.svg'
import carta2 from '../assets/cartas/carta2.svg'
import carta3 from '../assets/cartas/carta3.svg'
import carta4 from '../assets/cartas/carta4.svg'
import carta5 from '../assets/cartas/carta5.svg'
import carta6 from '../assets/cartas/carta6.svg'

export class VistaAccidentes {
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

    const titulo = new GUI.TextBlock('tituloAccidentes', 'Accidentes Tecnológicos')
    titulo.fontSize = 42
    titulo.color = '#ffe6d1'
    titulo.fontFamily = 'Comic Sans MS'
    containerTop.addControl(titulo)

    // BOTÓN VOLVER
    const botonVolver = GUI.Button.CreateSimpleButton('volverAccidentes', 'Volver a Reglas')
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

    const accidentes = [
      { nombre: 'Falla Eléctrica', desc: 'Sobrecarga en el sistema.', img: carta1 },
      { nombre: 'Cortocircuito', desc: 'Conexión defectuosa.', img: carta2 },
      { nombre: 'Explosión', desc: 'Liberación de energía violenta.', img: carta3 },
      { nombre: 'Error Humano', desc: 'Decisión incorrecta.', img: carta4 },
      { nombre: 'Fuga Química', desc: 'Sustancias peligrosas.', img: carta5 },
      { nombre: 'Incendio', desc: 'Combustión descontrolada.', img: carta6 }
    ]

    accidentes.forEach((accidente, i) => {
      const fila = Math.floor(i / 3)
      const col = i % 3
      grid.addControl(this.crearAccidente(accidente, i), fila, col)
    })
  }

  crearAccidente({ nombre, desc, img }, index) {
    const contenedor = new GUI.Rectangle()
    contenedor.width = '200px'
    contenedor.height = '220px'
    contenedor.cornerRadius = 15
    contenedor.thickness = 2
    contenedor.borderColor = '#a85a2a'
    contenedor.background = 'rgba(28,20,18,0.95)'

    // Stack vertical para organizar los elementos
    const stack = new GUI.StackPanel()
    stack.width = '95%'
    stack.height = '95%'
    stack.isVertical = true
    stack.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    stack.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    stack.spacing = 3
    contenedor.addControl(stack)

    const imagen = new GUI.Image(`imgAccidente_${index}`, img)
    imagen.width = '100%'
    imagen.height = '90px'
    imagen.stretch = GUI.Image.STRETCH_UNIFORM_TO_FILL
    stack.addControl(imagen)

    const titulo = new GUI.TextBlock()
    titulo.text = nombre
    titulo.fontSize = 16
    titulo.fontWeight = 'bold'
    titulo.color = '#ffd6b5'
    titulo.fontFamily = 'Comic Sans MS'
    titulo.height = '30px'
    titulo.textWrapping = true
    stack.addControl(titulo)

    const descripcion = new GUI.TextBlock()
    descripcion.text = desc
    descripcion.fontSize = 12
    descripcion.color = '#ffe9d6'
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
