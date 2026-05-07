import * as BABYLON from '@babylonjs/core'
import { GestorAjusteRatio } from './base/GestorAjusteRatio.js'

export class VistaInicial {
  constructor(canvas) {
    this.canvas = canvas
    this.engine = new BABYLON.Engine(canvas, true)
    this.scene = null
    this.overlayEl = null
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

    this.crearDecoracion(scene, camera)

    this.crearMenuDOM()

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

  crearMenuDOM() {
    const overlay = document.createElement('div')
    overlay.id = 'pantallaMenuInicial'
    overlay.style.cssText = `
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      display: none;
      background: rgba(12, 9, 8, 0.48);
      z-index: 100;
      font-family: 'Comic Sans MS', cursive;
    `
    document.body.appendChild(overlay)
    this.overlayEl = overlay

    const barraSuperior = document.createElement('div')
    barraSuperior.style.cssText = `
      position: absolute;
      top: 6%;
      right: 40px;
      display: flex;
      align-items: center;
      gap: 12px;
      height: 92px;
      background: rgba(18, 14, 13, 0.72);
      padding: 0 20px;
      border-radius: 18px;
      box-sizing: border-box;
    `
    overlay.appendChild(barraSuperior)

    const titulo = document.createElement('h1')
    titulo.textContent = 'Juego de Accidentes Tecnológicos'
    titulo.style.cssText = `
      color: #ffe6d1;
      font-size: 42px;
      margin: 0;
      position: absolute;
      top: 15%;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
    `
    overlay.appendChild(titulo)

    const btnRegistro = this._crearBoton(
      'Registrarse',
      '#2f2623',
      '#ffd6b5',
      () => this.onRegistro && this.onRegistro()
    )
    btnRegistro.style.cssText += `
      width: 200px;
      height: 44px;
      font-size: 18px;
    `
    barraSuperior.appendChild(btnRegistro)

    const btnInicioSesion = this._crearBoton(
      'Iniciar Sesión',
      '#a84f16',
      '#fff1e3',
      () => this.onInicioSesion && this.onInicioSesion()
    )
    btnInicioSesion.style.cssText += `
      width: 220px;
      height: 44px;
      font-size: 18px;
    `
    barraSuperior.appendChild(btnInicioSesion)

    const panelAcciones = document.createElement('div')
    panelAcciones.style.cssText = `
      position: absolute;
      top: 35%;
      left: 10%;
      width: 320px;
      height: 280px;
      border-radius: 30px;
      border: 2px solid #8a4a20;
      background: rgba(28, 20, 18, 0.92);
      box-shadow: 0 16px 28px rgba(0,0,0,0.4);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 25px;
    `
    overlay.appendChild(panelAcciones)

    const tituloPanel = document.createElement('h2')
    tituloPanel.textContent = 'Menú Principal'
    tituloPanel.style.cssText = `
      color: #ffd9bd;
      font-size: 26px;
      margin: 0 0 20px 0;
      text-align: center;
    `
    panelAcciones.appendChild(tituloPanel)

    const btnJugar = this._crearBoton(
      'Jugar',
      '#d66a1f',
      '#fff7ef',
      () => this.onJugar && this.onJugar()
    )
    btnJugar.style.marginBottom = '10px'
    panelAcciones.appendChild(btnJugar)

    const btnTutorial = this._crearBoton(
      'Tutorial',
      '#3c2d27',
      '#ffd6b7',
      () => this.onTutorial && this.onTutorial()
    )
    btnTutorial.style.marginBottom = '10px'
    panelAcciones.appendChild(btnTutorial)

    const btnReglas = this._crearBoton(
      'Ver reglas',
      '#3c2d27',
      '#ffd6b7',
      () => this.onReglas && this.onReglas()
    )
    panelAcciones.appendChild(btnReglas)
  }

  _crearBoton(texto, fondo, color, callback) {
    const btn = document.createElement('button')
    btn.textContent = texto
    btn.style.cssText = `
      width: 290px;
      height: 52px;
      border: none;
      border-radius: 18px;
      background: ${fondo};
      color: ${color};
      font-size: 21px;
      font-family: 'Comic Sans MS', cursive;
      cursor: pointer;
      transition: transform 0.2s, opacity 0.2s;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    `
    const aplicarActivo = () => {
      btn.style.opacity = '0.85'
      btn.style.transform = 'scale(0.98)'
    }
    const removerActivo = () => {
      btn.style.opacity = '1'
      btn.style.transform = 'scale(1)'
    }
    btn.addEventListener('mouseenter', aplicarActivo)
    btn.addEventListener('mouseleave', removerActivo)
    btn.addEventListener('touchstart', aplicarActivo, { passive: true })
    btn.addEventListener('touchend', removerActivo, { passive: true })
    btn.addEventListener('touchcancel', removerActivo, { passive: true })
    btn.addEventListener('click', callback)
    return btn
  }

  mostrar() {
    if (this.overlayEl) this.overlayEl.style.display = 'block'
  }

  ocultar() {
    if (this.overlayEl) this.overlayEl.style.display = 'none'
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

      if (this.engine.activeScene) {
        this.engine.activeScene.render()
      }
    })
    window.addEventListener('resize', () => {
      this.engine.resize()
    })
  }
}
