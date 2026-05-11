import * as BABYLON from '@babylonjs/core'
import { GestorAjusteRatio } from './base/GestorAjusteRatio.js'
import './estilos/EstiloVistaInicial.css'

export class VistaInicial {
  constructor(canvas) {
    this.canvas = canvas
    this.engine = new BABYLON.Engine(canvas, true)
    this.scene = null
    this.overlayEl = null
    this._onTutorial = null
    this._onRegistro = null
    this._onInicioSesion = null
    this._onJugar = null
    this._onReglas = null
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
    const esMovil = window.innerWidth <= 768 || ('ontouchstart' in window && window.innerWidth < 1024)
    const overlay = document.createElement('div')
    overlay.id = 'pantallaMenuInicial'
    overlay.className = 'inicial-overlay'
    overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:none;'
    document.body.appendChild(overlay)
    this.overlayEl = overlay

    const barraSuperior = document.createElement('div')
    barraSuperior.className = 'inicial-barra-superior'
    if (esMovil) {
      barraSuperior.style.position = 'absolute'
      barraSuperior.style.top = '1%'
      barraSuperior.style.left = '50%'
      barraSuperior.style.right = 'auto'
      barraSuperior.style.transform = 'translateX(-50%)'
      barraSuperior.style.flexDirection = 'column'
      barraSuperior.style.gap = '8px'
      barraSuperior.style.width = '88%'
      barraSuperior.style.maxWidth = '340px'
      barraSuperior.style.height = 'auto'
      barraSuperior.style.padding = '10px 16px'
      barraSuperior.style.borderRadius = '14px'
    }
    overlay.appendChild(barraSuperior)

    const titulo = document.createElement('h1')
    titulo.textContent = 'Juego de Accidentes Tecnológicos'
    titulo.className = 'inicial-titulo'
    if (esMovil) {
      titulo.style.fontSize = '26px'
      titulo.style.top = '20%'
      titulo.style.width = '90%'
      titulo.style.lineHeight = '1.2'
      titulo.style.wordWrap = 'break-word'
    }
    overlay.appendChild(titulo)

    const btnRegistro = this._crearBoton(
      'Registrarse',
      '#2f2623',
      '#ffd6b5',
      () => this._onRegistro && this._onRegistro()
    )
    if (esMovil) {
      btnRegistro.style.width = '100%'
      btnRegistro.style.height = '42px'
      btnRegistro.style.fontSize = '17px'
    } else {
      btnRegistro.style.width = '200px'
      btnRegistro.style.height = '44px'
      btnRegistro.style.fontSize = '18px'
    }
    barraSuperior.appendChild(btnRegistro)

    const btnInicioSesion = this._crearBoton(
      'Iniciar Sesión',
      '#a84f16',
      '#fff1e3',
      () => this._onInicioSesion && this._onInicioSesion()
    )
    if (esMovil) {
      btnInicioSesion.style.width = '100%'
      btnInicioSesion.style.height = '42px'
      btnInicioSesion.style.fontSize = '17px'
    } else {
      btnInicioSesion.style.width = '220px'
      btnInicioSesion.style.height = '44px'
      btnInicioSesion.style.fontSize = '18px'
    }
    barraSuperior.appendChild(btnInicioSesion)

    const panelAcciones = document.createElement('div')
    panelAcciones.className = 'inicial-panel-acciones'
    if (esMovil) {
      panelAcciones.style.top = '34%'
      panelAcciones.style.left = '50%'
      panelAcciones.style.transform = 'translateX(-50%)'
      panelAcciones.style.width = '88%'
      panelAcciones.style.maxWidth = '340px'
      panelAcciones.style.height = 'auto'
      panelAcciones.style.minHeight = '260px'
      panelAcciones.style.borderRadius = '22px'
      panelAcciones.style.padding = '20px 16px'
    }
    overlay.appendChild(panelAcciones)

    const tituloPanel = document.createElement('h2')
    tituloPanel.textContent = 'Menú Principal'
    tituloPanel.className = 'inicial-panel-titulo'
    tituloPanel.style.fontSize = esMovil ? '22px' : '26px'
    tituloPanel.style.marginBottom = esMovil ? '16px' : '20px'
    panelAcciones.appendChild(tituloPanel)

    const btnJugar = this._crearBoton(
      'Jugar',
      '#d66a1f',
      '#fff7ef',
      () => this._onJugar && this._onJugar()
    )
    btnJugar.style.marginBottom = '10px'
    if (esMovil) {
      btnJugar.style.width = '100%'
      btnJugar.style.height = '48px'
      btnJugar.style.fontSize = '20px'
    }
    panelAcciones.appendChild(btnJugar)

    const btnTutorial = this._crearBoton(
      'Tutorial',
      '#3c2d27',
      '#ffd6b7',
      () => this._onTutorial && this._onTutorial()
    )
    btnTutorial.style.marginBottom = '10px'
    if (esMovil) {
      btnTutorial.style.width = '100%'
      btnTutorial.style.height = '48px'
      btnTutorial.style.fontSize = '20px'
    }
    panelAcciones.appendChild(btnTutorial)

    const btnReglas = this._crearBoton(
      'Ver reglas',
      '#3c2d27',
      '#ffd6b7',
      () => this._onReglas && this._onReglas()
    )
    if (esMovil) {
      btnReglas.style.width = '100%'
      btnReglas.style.height = '48px'
      btnReglas.style.fontSize = '20px'
    }
    panelAcciones.appendChild(btnReglas)
  }

  _crearBoton(texto, fondo, color, callback) {
    const btn = document.createElement('button')
    btn.textContent = texto
    btn.className = 'inicial-boton'
    btn.style.background = fondo
    btn.style.color = color
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

  onTutorial(callback) {
    this._onTutorial = callback
  }

  onRegistro(callback) {
    this._onRegistro = callback
  }

  onInicioSesion(callback) {
    this._onInicioSesion = callback
  }

  onJugar(callback) {
    this._onJugar = callback
  }

  onReglas(callback) {
    this._onReglas = callback
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
