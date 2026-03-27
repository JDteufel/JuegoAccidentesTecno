import * as BABYLON from '@babylonjs/core'
import * as GUI from '@babylonjs/gui'
import { VistaTutorial } from './VistaTutorial.js'
import { VistaRegistro } from './VistaRegistro.js'
import { VistaLogin } from './VistaLogin.js'
import { VistaJugar } from './VistaJugar.js'
import { VistaReglas } from './VistaReglas.js'
import { VistaCrearJuego } from './VistaCrearJuego.js'

export class VistaInicio {
  constructor(canvas) {
    this.canvas = canvas
    this.engine = new BABYLON.Engine(canvas, true)
    this.scene = null
    this.gui = null
    this.overlay = null
    this.vistaTutorial = null
    this.vistaRegistro = null
    this.vistaLogin = null
    this.vistaJugar = null
    this.vistaReglas = null
    this.vistaCrearJuego = null
    this.onTutorial = null
    this.onRegistro = null
    this.onLogin = null
    this.onJugar = null
    this.onReglas = null
    this.onCrearJuego = null
  }

  crearEscena() {
    const scene = new BABYLON.Scene(this.engine)
    scene.clearColor = new BABYLON.Color4(0.07, 0.05, 0.05, 1)

    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      Math.PI / 2,
      Math.PI / 2.25,
      13,
      BABYLON.Vector3.Zero(),
      scene
    )
    camera.attachControl(this.canvas, true)
    camera.lowerRadiusLimit = 11
    camera.upperRadiusLimit = 15
    camera.wheelDeltaPercentage = 0.01

    const light = new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(0, 1, 0),
      scene
    )
    light.intensity = 0.95

    const pointLight = new BABYLON.PointLight(
      'pointLight',
      new BABYLON.Vector3(0, 3, 0),
      scene
    )
    pointLight.diffuse = new BABYLON.Color3(1, 0.55, 0.2)
    pointLight.intensity = 18

    this.gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI', true, scene)

    this.crearDecoracion(scene)
    this.crearMenu()
    this.crearSubvistas()

    this.scene = scene
  }

  crearDecoracion(scene) {
    const materialPrincipal = new BABYLON.StandardMaterial('matPrincipal', scene)
    materialPrincipal.diffuseColor = new BABYLON.Color3(0.92, 0.4, 0.1)
    materialPrincipal.emissiveColor = new BABYLON.Color3(0.33, 0.12, 0.04)
    materialPrincipal.specularColor = new BABYLON.Color3(0.8, 0.45, 0.18)

    const materialSecundario = new BABYLON.StandardMaterial('matSecundario', scene)
    materialSecundario.diffuseColor = new BABYLON.Color3(0.96, 0.65, 0.24)
    materialSecundario.emissiveColor = new BABYLON.Color3(0.18, 0.08, 0.03)

    const materialOscuro = new BABYLON.StandardMaterial('matOscuro', scene)
    materialOscuro.diffuseColor = new BABYLON.Color3(0.16, 0.12, 0.12)
    materialOscuro.emissiveColor = new BABYLON.Color3(0.05, 0.03, 0.03)

    const suelo = BABYLON.MeshBuilder.CreateGround(
      'suelo',
      { width: 18, height: 18 },
      scene
    )
    suelo.position.y = -2.2
    suelo.material = materialOscuro

    const figuras = []

    const octaedro = BABYLON.MeshBuilder.CreatePolyhedron(
      'octaedro',
      { type: 1, size: 1.55 },
      scene
    )
    octaedro.position = new BABYLON.Vector3(0, 0.8, 0)
    octaedro.material = materialPrincipal
    figuras.push({
      mesh: octaedro,
      velocidad: new BABYLON.Vector3(0.004, 0.01, 0),
      offset: 0
    })

    const toro = BABYLON.MeshBuilder.CreateTorus(
      'toroCentral',
      { diameter: 4.6, thickness: 0.22, tessellation: 96 },
      scene
    )
    toro.rotation.x = Math.PI / 3
    toro.rotation.z = Math.PI / 5
    toro.position.y = 0.8
    toro.material = materialSecundario
    figuras.push({
      mesh: toro,
      velocidad: new BABYLON.Vector3(0.002, -0.004, 0.003),
      offset: 0.8
    })

    const cajaA = BABYLON.MeshBuilder.CreateBox(
      'cajaA',
      { size: 1.15 },
      scene
    )
    cajaA.position = new BABYLON.Vector3(-2.4, 1.75, 1.1)
    cajaA.material = materialSecundario
    figuras.push({
      mesh: cajaA,
      velocidad: new BABYLON.Vector3(0.008, 0.006, 0),
      offset: 1.4
    })

    const cajaB = BABYLON.MeshBuilder.CreateBox(
      'cajaB',
      { size: 0.95 },
      scene
    )
    cajaB.position = new BABYLON.Vector3(2.65, 0.1, -0.7)
    cajaB.material = materialPrincipal
    figuras.push({
      mesh: cajaB,
      velocidad: new BABYLON.Vector3(-0.006, 0.009, 0),
      offset: 2.2
    })

    const dodecaedro = BABYLON.MeshBuilder.CreatePolyhedron(
      'dodecaedro',
      { type: 3, size: 0.9 },
      scene
    )
    dodecaedro.position = new BABYLON.Vector3(2.15, 2.2, 1.8)
    dodecaedro.material = materialSecundario
    figuras.push({
      mesh: dodecaedro,
      velocidad: new BABYLON.Vector3(0.005, 0.007, 0),
      offset: 0.35
    })

    const icosaedro = BABYLON.MeshBuilder.CreatePolyhedron(
      'icosaedro',
      { type: 2, size: 0.82 },
      scene
    )
    icosaedro.position = new BABYLON.Vector3(-2.9, -0.15, -1.4)
    icosaedro.material = materialPrincipal
    figuras.push({
      mesh: icosaedro,
      velocidad: new BABYLON.Vector3(-0.007, 0.005, 0),
      offset: 2.8
    })

    scene.onBeforeRenderObservable.add(() => {
      const tiempo = performance.now() * 0.001

      figuras.forEach(({ mesh, velocidad, offset }, index) => {
        mesh.rotation.x += velocidad.x
        mesh.rotation.y += velocidad.y
        mesh.rotation.z += velocidad.z
        mesh.position.y += Math.sin(tiempo * 1.2 + offset + index * 0.4) * 0.0035
      })
    })
  }

  crearMenu() {
    const overlay = new GUI.Rectangle('pantallaMenu')
    overlay.width = 1
    overlay.height = 1
    overlay.thickness = 0
    overlay.background = 'rgba(12, 9, 8, 0.48)'
    overlay.isVisible = true
    this.gui.addControl(overlay)
    this.overlay = overlay

    const barraSuperior = new GUI.Rectangle('barraSuperiorMenu')
    barraSuperior.width = 1
    barraSuperior.height = '92px'
    barraSuperior.top = '-44%'
    barraSuperior.thickness = 0
    barraSuperior.background = 'rgba(18, 14, 13, 0.72)'
    overlay.addControl(barraSuperior)

    overlay.addControl(
      this.crearTexto({
        nombre: 'tituloMenu',
        texto: 'Juego de Accidentes Tecnológicos',
        tamano: 42,
        alto: '120px',
        top: '-33%',
        color: '#ffe6d1'
      })
    )

    overlay.addControl(
      this.crearBoton({
        nombre: 'botonInicioSesionSuperior',
        texto: 'Iniciar sesión',
        top: '-44%',
        left: '28%',
        width: '220px',
        height: '44px',
        fondo: '#a84f16',
        color: '#fff1e3',
        callback: () => this.onLogin && this.onLogin()
      })
    )

    overlay.addControl(
      this.crearBoton({
        nombre: 'botonRegistroSuperior',
        texto: 'Registrarse',
        top: '-44%',
        left: '12%',
        width: '200px',
        height: '44px',
        fondo: '#2f2623',
        color: '#ffd6b5',
        callback: () => this.onRegistro && this.onRegistro()
      })
    )

    const panelAcciones = new GUI.Rectangle('panelAccionesMenu')
    panelAcciones.width = '420px'
    panelAcciones.height = '470px'
    panelAcciones.left = '-23%'
    panelAcciones.top = '8%'
    panelAcciones.cornerRadius = 30
    panelAcciones.thickness = 2
    panelAcciones.color = '#8a4a20'
    panelAcciones.background = 'rgba(28, 20, 18, 0.92)'
    panelAcciones.shadowColor = '#00000066'
    panelAcciones.shadowBlur = 28
    panelAcciones.shadowOffsetX = 0
    panelAcciones.shadowOffsetY = 16
    overlay.addControl(panelAcciones)

    panelAcciones.addControl(
      this.crearTexto({
        nombre: 'tituloPanelAcciones',
        texto: 'Menú Principal',
        tamano: 28,
        alto: '60px',
        top: '-145px',
        color: '#ffd9bd'
      })
    )

    panelAcciones.addControl(
      this.crearBoton({
        nombre: 'botonJugar',
        texto: 'Jugar',
        top: '-55px',
        width: '290px',
        fondo: '#d66a1f',
        color: '#fff7ef',
        callback: () => this.onJugar && this.onJugar()
      })
    )

    panelAcciones.addControl(
      this.crearBoton({
        nombre: 'botonCrearJuego',
        texto: 'Crear juego',
        top: '20px',
        width: '290px',
        fondo: '#ba5617',
        color: '#fff1e6',
        callback: () => this.onCrearJuego && this.onCrearJuego()
      })
    )

    panelAcciones.addControl(
      this.crearBoton({
        nombre: 'botonTutorial',
        texto: 'Tutorial',
        top: '95px',
        width: '290px',
        fondo: '#3c2d27',
        color: '#ffd6b7',
        callback: () => this.onTutorial && this.onTutorial()
      })
    )

    panelAcciones.addControl(
      this.crearBoton({
        nombre: 'botonReglas',
        texto: 'Ver reglas',
        top: '170px',
        width: '290px',
        fondo: '#3c2d27',
        color: '#ffd6b7',
        callback: () => this.onReglas && this.onReglas()
      })
    )
  }

  crearSubvistas() {
    this.vistaTutorial = new VistaTutorial(this.gui)
    this.vistaTutorial.crear()
    this.vistaRegistro = new VistaRegistro(this.gui)
    this.vistaRegistro.crear()
    this.vistaLogin = new VistaLogin(this.gui)
    this.vistaLogin.crear()
    this.vistaJugar = new VistaJugar(this.gui)
    this.vistaJugar.crear()
    this.vistaReglas = new VistaReglas(this.gui)
    this.vistaReglas.crear()
    this.vistaCrearJuego = new VistaCrearJuego(this.gui)
    this.vistaCrearJuego.crear()
  }

  crearTexto({
    nombre,
    texto,
    tamano,
    alto,
    top = '0px',
    color = '#ffe5d2'
  }) {
    const bloque = new GUI.TextBlock(nombre, texto)
    bloque.width = '82%'
    bloque.height = alto
    bloque.color = color
    bloque.fontSize = tamano
    bloque.fontFamily = 'Comic Sans MS'
    bloque.textWrapping = true
    bloque.resizeToFit = false
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

  mostrar() {
    if (this.overlay) this.overlay.isVisible = true
  }

  ocultar() {
    if (this.overlay) this.overlay.isVisible = false
  }

  setOnTutorial(callback) {
    this.onTutorial = callback
  }

  setOnRegistro(callback) {
    this.onRegistro = callback
  }

  setOnLogin(callback) {
    this.onLogin = callback
  }

  setOnJugar(callback) {
    this.onJugar = callback
  }

  setOnReglas(callback) {
    this.onReglas = callback
  }

  setOnCrearJuego(callback) {
    this.onCrearJuego = callback
  }

  render() {
    this.crearEscena()
    if (!this.scene) return
    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
    window.addEventListener('resize', () => {
      this.engine.resize()
    })
  }
}
