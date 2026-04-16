import * as BABYLON from '@babylonjs/core'
import * as GUI from '@babylonjs/gui'

export class VistaPartida {
  constructor(canvas, engine, sceneInicial) {
    this.canvas = canvas
    this.engine = engine
    this.sceneInicial = sceneInicial
    this.scene = null
    this.guiTexture = null
    this.callbackVolver = null
    this.visible = false
    this.overlay = null
    this.sceneAnterior = null
  }

  crear() {
    // Crear escena 3D
    this.scene = new BABYLON.Scene(this.engine)
    this.scene.clearColor = new BABYLON.Color4(0.1, 0.08, 0.07, 1)

    // Cámara
    const camera = new BABYLON.ArcRotateCamera(
      'cameraPartida',
      0,
      Math.PI / 2.8,
      12,
      new BABYLON.Vector3(0, 3.5, 0),
      this.scene
    )
    camera.inputs.clear()

    // Luces
    const light1 = new BABYLON.HemisphericLight(
      'light1',
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    )
    light1.intensity = 0.9

    const light2 = new BABYLON.PointLight(
      'light2',
      new BABYLON.Vector3(10, 10, 10),
      this.scene
    )
    light2.intensity = 1.2

    // Crear tablero 3D (plano base)
    const tablero = BABYLON.MeshBuilder.CreateGround('tablero', {
      width: 12,
      height: 17,
      subdivisions: 10
    }, this.scene)
    tablero.position.x = -5
    
    const materialTablero = new BABYLON.StandardMaterial('matTablero', this.scene)
    materialTablero.diffuseColor = new BABYLON.Color3(0.5, 0.35, 0.2)
    materialTablero.specularColor = new BABYLON.Color3(0.4, 0.3, 0.2)
    materialTablero.emissiveColor = new BABYLON.Color3(0.08, 0.05, 0.02)
    tablero.material = materialTablero

    // GUI - Crear texture para los botones de partida
    this.guiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('guiPartida', true, this.scene)

    // Overlay background
    this.overlay = new GUI.Rectangle('overlayPartida')
    this.overlay.width = 1
    this.overlay.height = 1
    this.overlay.thickness = 0
    this.overlay.background = 'transparent'
    this.guiTexture.addControl(this.overlay)

    // Panel derecha con botones circulares
    const panelDerecha = new GUI.StackPanel()
    panelDerecha.width = '120px'
    panelDerecha.height = '400px'
    panelDerecha.right = '20px'
    panelDerecha.isVertical = true
    panelDerecha.spacing = 15
    panelDerecha.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    panelDerecha.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
    this.overlay.addControl(panelDerecha)

    // Botones para partidas (P1-P4)
    for (let i = 1; i <= 4; i++) {
      const botonPartida = GUI.Button.CreateSimpleButton(`btnPartida${i}`, `P${i}`)
      botonPartida.width = '80px'
      botonPartida.height = '80px'
      botonPartida.cornerRadius = 40
      botonPartida.background = i === 1 ? '#d66a1f' : '#3c2d27'
      botonPartida.color = i === 1 ? '#fff7ef' : '#ffd6b7'
      botonPartida.fontSize = 18
      botonPartida.fontWeight = 'bold'
      botonPartida.fontFamily = 'Comic Sans MS'
      botonPartida.thickness = 2
      botonPartida.borderColor = '#a85a2a'

      botonPartida.onPointerUpObservable.add(() => {
        console.log(`Partida ${i} seleccionada`)
        for (let j = 1; j <= 4; j++) {
          const btn = this.guiTexture.getControlByName(`btnPartida${j}`)
          if (btn) {
            btn.background = j === i ? '#d66a1f' : '#3c2d27'
            btn.color = j === i ? '#fff7ef' : '#ffd6b7'
          }
        }
      })

      panelDerecha.addControl(botonPartida)
    }

    // Botón Volver arriba a la izquierda
    const botonVolver = GUI.Button.CreateSimpleButton('btnVolverPartida', 'Volver')
    botonVolver.width = '100px'
    botonVolver.height = '40px'
    botonVolver.left = '20px'
    botonVolver.top = '20px'
    botonVolver.background = '#3c2d27'
    botonVolver.color = '#ffd6b7'
    botonVolver.cornerRadius = 10
    botonVolver.thickness = 2
    botonVolver.borderColor = '#a85a2a'
    botonVolver.fontSize = 14
    botonVolver.fontWeight = 'bold'
    botonVolver.fontFamily = 'Comic Sans MS'
    botonVolver.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    botonVolver.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP

    botonVolver.onPointerUpObservable.add(() => {
      this.callbackVolver && this.callbackVolver()
    })

    this.overlay.addControl(botonVolver)

    // Panel inferior con cartas tipo tienda TFT
    const panelInferior = new GUI.Rectangle('panelCartas')
    panelInferior.width = '95%'
    panelInferior.height = '180px'
    panelInferior.bottom = '15px'
    panelInferior.background = 'rgba(28, 20, 18, 0.92)'
    panelInferior.cornerRadius = 15
    panelInferior.thickness = 3
    panelInferior.color = '#a85a2a'
    panelInferior.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    panelInferior.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
    panelInferior.zIndex = 100
    this.overlay.addControl(panelInferior)

    // Grid para las cartas (sin scroll)
    const gridCartas = new GUI.Grid()
    gridCartas.addColumnDefinition(0.1, true)
    gridCartas.addColumnDefinition(0.8, true)
    gridCartas.addColumnDefinition(0.1, true)
    gridCartas.width = '100%'
    gridCartas.height = '100%'
    gridCartas.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    panelInferior.addControl(gridCartas)

    // Botón anterior
    const btnAnterior = GUI.Button.CreateSimpleButton('btnAnterior', '◀')
    btnAnterior.fontSize = 20
    btnAnterior.color = '#ffd6b7'
    btnAnterior.fontWeight = 'bold'
    btnAnterior.background = 'rgba(60, 45, 39, 0.8)'
    btnAnterior.cornerRadius = 10
    btnAnterior.thickness = 0
    gridCartas.addControl(btnAnterior, 0, 0)

    // Container de cartas
    const containerCartas = new GUI.Rectangle('containerCartas')
    containerCartas.background = 'transparent'
    containerCartas.thickness = 0
    gridCartas.addControl(containerCartas, 0, 1)

    // StackPanel horizontal para las cartas
    const stackCartas = new GUI.StackPanel('stackCartas')
    stackCartas.isVertical = false
    stackCartas.spacing = 10
    stackCartas.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    stackCartas.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    stackCartas.width = '100%'
    stackCartas.height = '100%'
    containerCartas.addControl(stackCartas)

    // Datos de cartas (tecnologías/accidentes)
    const cartas = [
      { titulo: 'GitHub', icono: '📱', color: '#d66a1f' },
      { titulo: 'Discord', icono: '💬', color: '#d66a1f' },
      { titulo: 'Google Drive', icono: '☁️', color: '#d66a1f' },
      { titulo: 'YouTube', icono: '🎥', color: '#d66a1f' },
      { titulo: 'Slack', icono: '💼', color: '#d66a1f' },
      { titulo: 'Twitch', icono: '📺', color: '#d66a1f' }
    ]

    let cartaIndex = 0
    const actualizarCartas = () => {
      stackCartas.children.forEach((child) => child.dispose())
      
      for (let i = 0; i < 4 && cartaIndex + i < cartas.length; i++) {
        const carta = cartas[cartaIndex + i]
        const cartaPanel = new GUI.Rectangle(`carta_${cartaIndex + i}`)
        cartaPanel.width = '120px'
        cartaPanel.height = '150px'
        cartaPanel.background = 'rgba(47, 38, 35, 0.95)'
        cartaPanel.cornerRadius = 12
        cartaPanel.thickness = 2
        cartaPanel.color = '#b8654a'

        // Icono
        const icono = new GUI.TextBlock(`icono_${cartaIndex + i}`, carta.icono)
        icono.fontSize = 40
        icono.color = carta.color
        icono.height = '70px'
        icono.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP
        cartaPanel.addControl(icono)

        // Nombre
        const nombre = new GUI.TextBlock(`nombre_${cartaIndex + i}`, carta.titulo)
        nombre.fontSize = 12
        nombre.color = '#ffd6b7'
        nombre.fontFamily = 'Comic Sans MS'
        nombre.fontWeight = 'bold'
        nombre.height = '60px'
        nombre.textWrapping = true
        nombre.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
        cartaPanel.addControl(nombre)

        stackCartas.addControl(cartaPanel)
      }
    }

    actualizarCartas()

    // Botón siguiente
    const btnSiguiente = GUI.Button.CreateSimpleButton('btnSiguiente', '▶')
    btnSiguiente.fontSize = 20
    btnSiguiente.color = '#ffd6b7'
    btnSiguiente.fontWeight = 'bold'
    btnSiguiente.background = 'rgba(60, 45, 39, 0.8)'
    btnSiguiente.cornerRadius = 10
    btnSiguiente.thickness = 0
    gridCartas.addControl(btnSiguiente, 0, 2)

    btnAnterior.onPointerUpObservable.add(() => {
      if (cartaIndex > 0) {
        cartaIndex--
        actualizarCartas()
      }
    })

    btnSiguiente.onPointerUpObservable.add(() => {
      if (cartaIndex < cartas.length - 4) {
        cartaIndex++
        actualizarCartas()
      }
    })
  }

  onVolver(callback) {
    this.callbackVolver = callback
  }

  mostrar() {
    if (this.scene && this.overlay) {
      // Guardar la escena anterior si no está ya guardada
      if (!this.sceneAnterior && this.engine.activeScene) {
        this.sceneAnterior = this.engine.activeScene
      }
      this.engine.activeScene = this.scene
      this.overlay.isVisible = true
      this.visible = true
    }
  }

  ocultar() {
    if (this.scene && this.overlay) {
      // Restaurar la escena anterior
      if (this.sceneAnterior) {
        this.engine.activeScene = this.sceneAnterior
      }
      this.overlay.isVisible = false
      this.visible = false
    }
  }
}
