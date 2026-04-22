import * as BABYLON from '@babylonjs/core'
import * as GUI from '@babylonjs/gui'
import { GestorAjusteRatio } from './base/GestorAjusteRatio.js'

export class VistaInicial {
  constructor(canvas) {
    this.canvas = canvas
    this.engine = new BABYLON.Engine(canvas, true)
    this.scene = null
    this.gui = null
    this.overlay = null
    this.onTutorial = null
    this.onRegistro = null
    this.onInicioSesion = null
    this.onJugar = null
    this.onReglas = null
  }

  crearEscena() {
    const scene = new BABYLON.Scene(this.engine)
    scene.clearColor = new BABYLON.Color4(0.07, 0.05, 0.05, 1)

    const objetivoCamara = new BABYLON.Vector3(0, 1.2, 0)
    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      Math.PI / 2,
      Math.PI / 2.25,
      13,
      objetivoCamara,
      scene
    )
    camera.inputs.clear()

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

    scene.onBeforeRenderObservable.add(() => {
      const tiempoSolar = performance.now() * 0.000144
      const radioSolar = 24
      pointLight.position.x = Math.cos(tiempoSolar) * radioSolar
      pointLight.position.z = Math.sin(tiempoSolar) * radioSolar
      pointLight.position.y = 11 + Math.sin(tiempoSolar * 0.7) * 2.8
    })

    this.gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI', true, scene)
    GestorAjusteRatio.configurarGUI(this.gui)

    this.crearDecoracion(scene, camera)
    this.crearMenu()

    this.scene = scene
    this.engine.activeScene = this.scene
  }

  crearDecoracion(scene, camera) {
    const materialPrincipal = new BABYLON.StandardMaterial('matPrincipal', scene)
    materialPrincipal.diffuseColor = new BABYLON.Color3(0.92, 0.4, 0.1)
    materialPrincipal.emissiveColor = new BABYLON.Color3(0.33, 0.12, 0.04)
    materialPrincipal.specularColor = new BABYLON.Color3(0.8, 0.45, 0.18)

    const materialSecundario = new BABYLON.StandardMaterial('matSecundario', scene)
    materialSecundario.diffuseColor = new BABYLON.Color3(0.96, 0.65, 0.24)
    materialSecundario.emissiveColor = new BABYLON.Color3(0.18, 0.08, 0.03)

    const centroOrbita = new BABYLON.Vector3(0, 0.8, 0)
    const anguloDiagonalPantalla = BABYLON.Tools.ToRadians(35)
    const direccionCamara = centroOrbita.subtract(camera.position).normalize()
    const ejeProfundidad = camera.position.subtract(centroOrbita).normalize()
    const derechaPantalla = BABYLON.Vector3.Cross(
      direccionCamara,
      BABYLON.Vector3.Up()
    ).normalize()
    const arribaPantalla = BABYLON.Vector3.Cross(
      derechaPantalla,
      direccionCamara
    ).normalize()
    const ejeDiagonal = derechaPantalla
      .scale(Math.cos(anguloDiagonalPantalla))
      .add(arribaPantalla.scale(-Math.sin(anguloDiagonalPantalla)))
      .normalize()
    const ejeDiagonalPerpendicular = derechaPantalla
      .scale(Math.sin(anguloDiagonalPantalla))
      .add(arribaPantalla.scale(Math.cos(anguloDiagonalPantalla)))
      .normalize()
    const radioAnillo = 3.25
    const velocidadRotacionAnillos = 1
    const velocidadOrbitaAnillo = velocidadRotacionAnillos
    const velocidadRotacionOctaedro = 0.014
    const separacionAngular = (Math.PI * 2) / 4
    const figurasEnAnillo = []

    const octaedro = BABYLON.MeshBuilder.CreatePolyhedron(
      'octaedro',
      { type: 1, size: 1.55 },
      scene
    )
    octaedro.position = centroOrbita.clone()
    octaedro.material = materialPrincipal

    const materialAnilloBorde = new BABYLON.StandardMaterial(
      'matAnilloBorde',
      scene
    )
    materialAnilloBorde.diffuseColor = new BABYLON.Color3(0.98, 0.74, 0.3)
    materialAnilloBorde.emissiveColor = new BABYLON.Color3(0.2, 0.11, 0.04)

    const puntosAnilloBorde = []
    const ladosAnilloBorde = 8
    for (let i = 0; i <= ladosAnilloBorde; i += 1) {
      const t = (i / ladosAnilloBorde) * Math.PI * 2
      const punto = centroOrbita
        .add(ejeDiagonalPerpendicular.scale(radioAnillo * Math.cos(t)))
        .add(ejeProfundidad.scale(radioAnillo * Math.sin(t)))
      puntosAnilloBorde.push(punto)
    }
    let anilloBorde = BABYLON.MeshBuilder.CreateTube(
      'anilloBorde',
      {
        path: puntosAnilloBorde,
        radius: 0.07,
        tessellation: 32,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE,
        updatable: true
      },
      scene
    )
    anilloBorde.material = materialAnilloBorde

    const cajaA = BABYLON.MeshBuilder.CreateBox(
      'cajaA',
      { size: 1.15 },
      scene
    )
    cajaA.position = new BABYLON.Vector3(-2.4, 1.75, 1.1)
    cajaA.material = materialSecundario
    figurasEnAnillo.push({
      mesh: cajaA,
      radio: radioAnillo,
      velocidadOrbita: velocidadOrbitaAnillo,
      fase: 0 * separacionAngular,
      velocidadRotacion: new BABYLON.Vector3(0.008, 0.006, 0)
    })

    const tetraedroB = BABYLON.MeshBuilder.CreatePolyhedron(
      'tetraedroB',
      { type: 4, size: 1.0 },
      scene
    )
    tetraedroB.position = new BABYLON.Vector3(2.65, 0.1, -0.7)
    tetraedroB.material = materialPrincipal
    figurasEnAnillo.push({
      mesh: tetraedroB,
      radio: radioAnillo,
      velocidadOrbita: velocidadOrbitaAnillo,
      fase: 1 * separacionAngular,
      velocidadRotacion: new BABYLON.Vector3(-0.006, 0.009, 0)
    })

    const dodecaedro = BABYLON.MeshBuilder.CreatePolyhedron(
      'dodecaedro',
      { type: 3, size: 0.9 },
      scene
    )
    dodecaedro.position = new BABYLON.Vector3(2.15, 2.2, 1.8)
    dodecaedro.material = materialSecundario
    figurasEnAnillo.push({
      mesh: dodecaedro,
      radio: radioAnillo,
      velocidadOrbita: velocidadOrbitaAnillo,
      fase: 2 * separacionAngular,
      velocidadRotacion: new BABYLON.Vector3(0.005, 0.007, 0)
    })

    const icosaedro = BABYLON.MeshBuilder.CreatePolyhedron(
      'icosaedro',
      { type: 2, size: 0.82 },
      scene
    )
    icosaedro.position = new BABYLON.Vector3(-2.9, -0.15, -1.4)
    icosaedro.material = materialPrincipal
    figurasEnAnillo.push({
      mesh: icosaedro,
      radio: radioAnillo,
      velocidadOrbita: velocidadOrbitaAnillo,
      fase: 3 * separacionAngular,
      velocidadRotacion: new BABYLON.Vector3(-0.007, 0.005, 0)
    })

    scene.onBeforeRenderObservable.add(() => {
      const tiempo = performance.now() * 0.001
      const anguloRotacionAnillos = -tiempo * velocidadRotacionAnillos
      const rotacionAnillosY = BABYLON.Quaternion.FromEulerAngles(
        0,
        anguloRotacionAnillos,
        0
      )
      const ejeDiagonalOrbital = ejeDiagonal.rotateByQuaternionToRef(
        rotacionAnillosY,
        new BABYLON.Vector3()
      )
      const ejeProfundidadOrbital = ejeProfundidad.rotateByQuaternionToRef(
        rotacionAnillosY,
        new BABYLON.Vector3()
      )
      const ejeDiagonalPerpendicularOrbital =
        ejeDiagonalPerpendicular.rotateByQuaternionToRef(
          rotacionAnillosY,
          new BABYLON.Vector3()
        )

      octaedro.rotation.y += velocidadRotacionOctaedro
      octaedro.rotation.x = 0
      octaedro.rotation.z = 0

      figurasEnAnillo.forEach(
        ({
          mesh,
          radio,
          velocidadOrbita,
          fase,
          velocidadRotacion
        }) => {
          const angulo = tiempo * velocidadOrbita + fase
          const puntoAnillo = ejeDiagonalOrbital
            .scale(radio * Math.cos(angulo))
            .add(ejeProfundidadOrbital.scale(radio * Math.sin(angulo)))
          mesh.position.copyFrom(centroOrbita.add(puntoAnillo))
          mesh.rotation.x += velocidadRotacion.x
          mesh.rotation.y += velocidadRotacion.y
          mesh.rotation.z += velocidadRotacion.z
        }
      )

      const pathAnilloActualizado = []
      for (let i = 0; i <= ladosAnilloBorde; i += 1) {
        const t = (i / ladosAnilloBorde) * Math.PI * 2
        const punto = centroOrbita
          .add(ejeDiagonalPerpendicularOrbital.scale(radioAnillo * Math.cos(t)))
          .add(ejeProfundidadOrbital.scale(radioAnillo * Math.sin(t)))
        pathAnilloActualizado.push(punto)
      }
      anilloBorde = BABYLON.MeshBuilder.CreateTube(
        'anilloBorde',
        {
          path: pathAnilloActualizado,
          radius: 0.07,
          tessellation: 32,
          sideOrientation: BABYLON.Mesh.DOUBLESIDE,
          instance: anilloBorde
        },
        scene
      )
    })
  }

  crearMenu() {
    const overlay = new GUI.Rectangle('pantallaMenuInicial')
    overlay.width = 1
    overlay.height = 1
    overlay.thickness = 0
    overlay.background = 'rgba(12, 9, 8, 0.48)'
    overlay.isVisible = true
    this.gui.addControl(overlay)
    this.overlay = overlay

    const barraSuperior = new GUI.Rectangle('barraSuperiorMenuInicial')
    barraSuperior.width = 1
    barraSuperior.height = '92px'
    barraSuperior.top = '-44%'
    barraSuperior.thickness = 0
    barraSuperior.background = 'rgba(18, 14, 13, 0.72)'
    overlay.addControl(barraSuperior)

    overlay.addControl(
      this.crearTexto({
        nombre: 'tituloMenuInicial',
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
        texto: 'Iniciar Sesión',
        top: '-44%',
        left: '38%',
        width: '220px',
        height: '44px',
        fondo: '#a84f16',
        color: '#fff1e3',
        callback: () => this.onInicioSesion && this.onInicioSesion()
      })
    )

    overlay.addControl(
      this.crearBoton({
        nombre: 'botonRegistroSuperior',
        texto: 'Registrarse',
        top: '-44%',
        left: '24%',
        width: '200px',
        height: '44px',
        fondo: '#2f2623',
        color: '#ffd6b5',
        callback: () => this.onRegistro && this.onRegistro()
      })
    )

    const panelAcciones = new GUI.Rectangle('panelAccionesMenuInicial')
    panelAcciones.width = '420px'
    panelAcciones.height = '410px'
    panelAcciones.left = '-34%'
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
        nombre: 'tituloPanelAccionesInicial',
        texto: 'Menú Principal',
        tamano: 28,
        alto: '60px',
        top: '-135px',
        color: '#ffd9bd'
      })
    )

    panelAcciones.addControl(
      this.crearBoton({
        nombre: 'botonJugar',
        texto: 'Jugar',
        top: '-45px',
        width: '290px',
        fondo: '#d66a1f',
        color: '#fff7ef',
        callback: () => this.onJugar && this.onJugar()
      })
    )

    panelAcciones.addControl(
      this.crearBoton({
        nombre: 'botonTutorial',
        texto: 'Tutorial',
        top: '30px',
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
        top: '105px',
        width: '290px',
        fondo: '#3c2d27',
        color: '#ffd6b7',
        callback: () => this.onReglas && this.onReglas()
      })
    )
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

  setOnInicioSesion(callback) {
    this.onInicioSesion = callback
  }

  setOnJugar(callback) {
    this.onJugar = callback
  }

  setOnReglas(callback) {
    this.onReglas = callback
  }

  render(targetFps = 60) {
    this.crearEscena()
    if (!this.scene) return
    const frameInterval = 1000 / targetFps
    let ultimoFrame = 0
    this.engine.runRenderLoop(() => {
      const ahora = performance.now()
      const delta = ahora - ultimoFrame
      if (delta < frameInterval) return
      ultimoFrame = ahora - (delta % frameInterval)
      // Renderizar la escena activa del engine
      if (this.engine.activeScene) {
        this.engine.activeScene.render()
      }
    })
    window.addEventListener('resize', () => {
      this.engine.resize()
    })
  }
}
