import * as BABYLON from '@babylonjs/core'
import * as GUI from '@babylonjs/gui'
import { GestorAjusteRatio } from './base/GestorAjusteRatio.js'

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
    this.centroTablero = new BABYLON.Vector3(-3.7, 0.2, 0)
    this.carruselAccidentes = null

    this.accidentes = []
    this.perfil = null
    this.cartas = []
  }

  crear() {
    this.scene = new BABYLON.Scene(this.engine)
    this.scene.clearColor = new BABYLON.Color4(0.09, 0.07, 0.06, 1)

    this.crearEscena3D()
    this.crearHUD()
  }

  crearEscena3D() {
    const camera = new BABYLON.ArcRotateCamera(
      'cameraPartida',
      0,
      1.08,
      18,
      this.centroTablero,
      this.scene
    )
    this.cameraPartida = camera
    camera.inputs.clear()
    camera.lowerRadiusLimit = 17
    camera.upperRadiusLimit = 19
    camera.fov = 0.6
    this.scene.ambientColor = new BABYLON.Color3(0.18, 0.12, 0.08)

    const hemisferica = new BABYLON.HemisphericLight(
      'light1',
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    )
    hemisferica.intensity = 0.72
    hemisferica.diffuse = new BABYLON.Color3(0.95, 0.85, 0.74)
    hemisferica.groundColor = new BABYLON.Color3(0.22, 0.12, 0.07)

    const direccionCamara = this.centroTablero.subtract(camera.position).normalize()
    const luzPrincipal = new BABYLON.SpotLight(
      'light2',
      camera.position.add(new BABYLON.Vector3(0, 1.4, 1.2)),
      direccionCamara,
      Math.PI / 2.7,
      16,
      this.scene
    )
    luzPrincipal.diffuse = new BABYLON.Color3(0.98, 0.8, 0.58)
    luzPrincipal.specular = new BABYLON.Color3(0.65, 0.5, 0.32)
    luzPrincipal.intensity = 10.5

    const luzContraste = new BABYLON.SpotLight(
      'light3',
      this.centroTablero.add(new BABYLON.Vector3(7.5, 6.8, -3.8)),
      new BABYLON.Vector3(-0.72, -0.66, 0.18),
      Math.PI / 3.1,
      14,
      this.scene
    )
    luzContraste.diffuse = new BABYLON.Color3(0.46, 0.38, 0.28)
    luzContraste.specular = new BABYLON.Color3(0.14, 0.12, 0.1)
    luzContraste.intensity = 4.2

    const luzAmbiente = new BABYLON.PointLight(
      'light4',
      this.centroTablero.add(new BABYLON.Vector3(0, 5.4, 0)),
      this.scene
    )
    luzAmbiente.diffuse = new BABYLON.Color3(0.64, 0.48, 0.34)
    luzAmbiente.intensity = 2.4

    const luzRelleno = new BABYLON.PointLight(
      'light5',
      this.centroTablero.add(new BABYLON.Vector3(-5.5, 4.2, 4.8)),
      this.scene
    )
    luzRelleno.diffuse = new BABYLON.Color3(0.34, 0.29, 0.24)
    luzRelleno.intensity = 1.6

    this.crearTablero3D()
  }

  crearTablero3D() {
    const baseMesa = BABYLON.MeshBuilder.CreateGround(
      'baseMesa',
      {
        width: 18,
        height: 18,
        subdivisions: 2
      },
      this.scene
    )
    baseMesa.position.x = this.centroTablero.x
    baseMesa.position.y = -0.05

    const materialMesa = new BABYLON.StandardMaterial('matMesa', this.scene)
    materialMesa.diffuseColor = new BABYLON.Color3(0.3, 0.19, 0.11)
    materialMesa.specularColor = new BABYLON.Color3(0.12, 0.08, 0.04)
    materialMesa.emissiveColor = new BABYLON.Color3(0.015, 0.008, 0.004)
    baseMesa.material = materialMesa

    const resplandorMesa = BABYLON.MeshBuilder.CreateDisc(
      'resplandorMesa',
      {
        radius: 8.8,
        tessellation: 64
      },
      this.scene
    )
    resplandorMesa.rotation.x = Math.PI / 2
    resplandorMesa.position = this.centroTablero.add(new BABYLON.Vector3(0, -0.035, 0))

    const materialResplandor = new BABYLON.StandardMaterial(
      'matResplandorMesa',
      this.scene
    )
    materialResplandor.diffuseColor = new BABYLON.Color3(0.12, 0.07, 0.03)
    materialResplandor.emissiveColor = new BABYLON.Color3(0.03, 0.015, 0.006)
    materialResplandor.alpha = 0.38
    resplandorMesa.material = materialResplandor

    const tablero = BABYLON.MeshBuilder.CreateBox(
      'tableroCentral',
      {
        width: 12.4,
        depth: 12.4,
        height: 0.34
      },
      this.scene
    )
    tablero.position.x = this.centroTablero.x
    tablero.position.y = 0.12

    const materialTablero = new BABYLON.StandardMaterial('matTablero', this.scene)
    materialTablero.diffuseColor = new BABYLON.Color3(0.56, 0.36, 0.2)
    materialTablero.specularColor = new BABYLON.Color3(0.22, 0.14, 0.07)
    materialTablero.emissiveColor = new BABYLON.Color3(0.03, 0.015, 0.008)
    tablero.material = materialTablero

    const tapete = BABYLON.MeshBuilder.CreateGround(
      'tapeteJuego',
      {
        width: 11.3,
        height: 11.3,
        subdivisions: 2
      },
      this.scene
    )
    tapete.position.x = this.centroTablero.x
    tapete.position.y = 0.3

    const materialTapete = new BABYLON.StandardMaterial('matTapete', this.scene)
    materialTapete.diffuseColor = new BABYLON.Color3(0.21, 0.31, 0.28)
    materialTapete.specularColor = new BABYLON.Color3(0.05, 0.06, 0.05)
    materialTapete.emissiveColor = new BABYLON.Color3(0.012, 0.02, 0.017)
    tapete.material = materialTapete

    const marcoInterior = BABYLON.MeshBuilder.CreateBox(
      'marcoInteriorTablero',
      {
        width: 11.65,
        depth: 11.65,
        height: 0.08
      },
      this.scene
    )
    marcoInterior.position = this.centroTablero.add(new BABYLON.Vector3(0, 0.34, 0))

    const materialMarcoInterior = new BABYLON.StandardMaterial(
      'matMarcoInteriorTablero',
      this.scene
    )
    materialMarcoInterior.diffuseColor = new BABYLON.Color3(0.34, 0.24, 0.15)
    materialMarcoInterior.specularColor = new BABYLON.Color3(0.14, 0.1, 0.06)
    materialMarcoInterior.emissiveColor = new BABYLON.Color3(0.02, 0.01, 0.005)
    marcoInterior.material = materialMarcoInterior

    this.crearLineaDecorativa({
      nombre: 'lineaVerticalCentro',
      width: 0.08,
      height: 9.2,
      posicion: this.centroTablero.add(new BABYLON.Vector3(0, 0.35, 0)),
      color: new BABYLON.Color3(0.63, 0.46, 0.24)
    })

    this.crearLineaDecorativa({
      nombre: 'lineaHorizontalCentro',
      width: 9.2,
      height: 0.08,
      posicion: this.centroTablero.add(new BABYLON.Vector3(0, 0.35, 0)),
      color: new BABYLON.Color3(0.63, 0.46, 0.24)
    })

    this.crearLineaDecorativa({
      nombre: 'lineaNorte',
      width: 6.8,
      height: 0.06,
      posicion: this.centroTablero.add(new BABYLON.Vector3(0, 0.35, -3.15)),
      color: new BABYLON.Color3(0.48, 0.37, 0.22)
    })

    this.crearLineaDecorativa({
      nombre: 'lineaSur',
      width: 6.8,
      height: 0.06,
      posicion: this.centroTablero.add(new BABYLON.Vector3(0, 0.35, 3.15)),
      color: new BABYLON.Color3(0.48, 0.37, 0.22)
    })

    this.crearLineaDecorativa({
      nombre: 'lineaOeste',
      width: 0.06,
      height: 6.8,
      posicion: this.centroTablero.add(new BABYLON.Vector3(-3.15, 0.35, 0)),
      color: new BABYLON.Color3(0.48, 0.37, 0.22)
    })

    this.crearLineaDecorativa({
      nombre: 'lineaEste',
      width: 0.06,
      height: 6.8,
      posicion: this.centroTablero.add(new BABYLON.Vector3(3.15, 0.35, 0)),
      color: new BABYLON.Color3(0.48, 0.37, 0.22)
    })

    this.crearZonaTablero({
      nombre: 'zonaAccidente',
      width: 2.4,
      height: 2.4,
      position: this.centroTablero.add(new BABYLON.Vector3(0, 0.12, 0)),
      color: new BABYLON.Color3(0.4, 0.18, 0.12)
    })

    this.crearZonaTablero({
      nombre: 'zonaJugadorNorte',
      width: 6.8,
      height: 2,
      position: this.centroTablero.add(new BABYLON.Vector3(0, 0.12, -4.25)),
      color: new BABYLON.Color3(0.28, 0.21, 0.14)
    })

    this.crearZonaTablero({
      nombre: 'zonaJugadorSur',
      width: 6.8,
      height: 2,
      position: this.centroTablero.add(new BABYLON.Vector3(0, 0.12, 4.25)),
      color: new BABYLON.Color3(0.22, 0.2, 0.14)
    })

    this.crearZonaTablero({
      nombre: 'zonaJugadorOeste',
      width: 2,
      height: 6.8,
      position: this.centroTablero.add(new BABYLON.Vector3(-4.25, 0.12, 0)),
      color: new BABYLON.Color3(0.2, 0.16, 0.11)
    })

    this.crearZonaTablero({
      nombre: 'zonaJugadorEste',
      width: 2,
      height: 6.8,
      position: this.centroTablero.add(new BABYLON.Vector3(4.25, 0.12, 0)),
      color: new BABYLON.Color3(0.2, 0.16, 0.11)
    })

    this.crearZonaTablero({
      nombre: 'zonaCentroSuperior',
      width: 4.1,
      height: 1.7,
      position: this.centroTablero.add(new BABYLON.Vector3(0, 0.12, -2.15)),
      color: new BABYLON.Color3(0.25, 0.23, 0.16)
    })

    this.crearZonaTablero({
      nombre: 'zonaCentroInferior',
      width: 4.1,
      height: 1.7,
      position: this.centroTablero.add(new BABYLON.Vector3(0, 0.12, 2.15)),
      color: new BABYLON.Color3(0.25, 0.23, 0.16)
    })

    this.crearBandejaTablero({
      nombre: 'bandejaJugadorNorte',
      width: 5.8,
      depth: 1.14,
      position: this.centroTablero.add(new BABYLON.Vector3(0, 0.38, -4.25)),
      colorBase: new BABYLON.Color3(0.31, 0.23, 0.16),
      colorAcento: new BABYLON.Color3(0.79, 0.56, 0.24)
    })

    this.crearBandejaTablero({
      nombre: 'bandejaJugadorSur',
      width: 5.8,
      depth: 1.14,
      position: this.centroTablero.add(new BABYLON.Vector3(0, 0.38, 4.25)),
      colorBase: new BABYLON.Color3(0.28, 0.21, 0.15),
      colorAcento: new BABYLON.Color3(0.78, 0.52, 0.22)
    })

    this.crearBandejaTablero({
      nombre: 'bandejaJugadorOeste',
      width: 1.14,
      depth: 5.8,
      position: this.centroTablero.add(new BABYLON.Vector3(-4.25, 0.38, 0)),
      colorBase: new BABYLON.Color3(0.24, 0.19, 0.14),
      colorAcento: new BABYLON.Color3(0.67, 0.47, 0.22)
    })

    this.crearBandejaTablero({
      nombre: 'bandejaJugadorEste',
      width: 1.14,
      depth: 5.8,
      position: this.centroTablero.add(new BABYLON.Vector3(4.25, 0.38, 0)),
      colorBase: new BABYLON.Color3(0.24, 0.19, 0.14),
      colorAcento: new BABYLON.Color3(0.67, 0.47, 0.22)
    })

    this.crearCarruselAccidente()
  }

  crearZonaTablero({ nombre, width, height, position, color }) {
    const zona = BABYLON.MeshBuilder.CreateGround(
      nombre,
      {
        width,
        height,
        subdivisions: 1
      },
      this.scene
    )
    zona.position = position

    const materialZona = new BABYLON.StandardMaterial(`mat_${nombre}`, this.scene)
    materialZona.diffuseColor = color
    materialZona.specularColor = new BABYLON.Color3(0.12, 0.1, 0.08)
    materialZona.emissiveColor = color.scale(0.16)
    zona.material = materialZona
  }

  crearLineaDecorativa({ nombre, width, height, posicion, color }) {
    const linea = BABYLON.MeshBuilder.CreateGround(
      nombre,
      {
        width,
        height,
        subdivisions: 1
      },
      this.scene
    )
    linea.position = posicion

    const materialLinea = new BABYLON.StandardMaterial(`mat_${nombre}`, this.scene)
    materialLinea.diffuseColor = color
    materialLinea.emissiveColor = color.scale(0.1)
    materialLinea.specularColor = new BABYLON.Color3(0.04, 0.03, 0.02)
    linea.material = materialLinea
  }

  crearCarruselAccidente() {
    this.carruselAccidentes = new BABYLON.TransformNode(
      'carruselAccidentes',
      this.scene
    )
    this.carruselAccidentes.position = this.centroTablero.clone()

    const plataformaCarrusel = BABYLON.MeshBuilder.CreateCylinder(
      'plataformaCarruselAccidente',
      {
        diameter: 2.3,
        height: 0.12,
        tessellation: 48
      },
      this.scene
    )
    plataformaCarrusel.parent = this.carruselAccidentes
    plataformaCarrusel.position = new BABYLON.Vector3(0, 0.34, 0)

    const materialPlataforma = new BABYLON.StandardMaterial(
      'matPlataformaCarruselAccidente',
      this.scene
    )
    materialPlataforma.diffuseColor = new BABYLON.Color3(0.31, 0.18, 0.12)
    materialPlataforma.specularColor = new BABYLON.Color3(0.1, 0.06, 0.04)
    materialPlataforma.emissiveColor = new BABYLON.Color3(0.014, 0.006, 0.003)
    plataformaCarrusel.material = materialPlataforma

    const selloCarrusel = BABYLON.MeshBuilder.CreateDisc(
      'selloCarruselAccidente',
      {
        radius: 0.92,
        tessellation: 48
      },
      this.scene
    )
    selloCarrusel.rotation.x = Math.PI / 2
    selloCarrusel.parent = this.carruselAccidentes
    selloCarrusel.position = new BABYLON.Vector3(0, 0.405, 0)

    const materialSelloCarrusel = new BABYLON.StandardMaterial(
      'matSelloCarruselAccidente',
      this.scene
    )
    materialSelloCarrusel.diffuseColor = new BABYLON.Color3(0.68, 0.5, 0.24)
    materialSelloCarrusel.emissiveColor = new BABYLON.Color3(0.02, 0.01, 0.004)
    materialSelloCarrusel.alpha = 0.92
    selloCarrusel.material = materialSelloCarrusel

    const radioMarcadores = 1.8
    for (let i = 0; i < 8; i++) {
      const angulo = (Math.PI * 2 * i) / 8
      const contenedorCarta = new BABYLON.TransformNode(
        `contenedorCarrusel_${i}`,
        this.scene
      )
      contenedorCarta.parent = this.carruselAccidentes
      contenedorCarta.position = new BABYLON.Vector3(
        Math.cos(angulo) * radioMarcadores,
        0.4,
        Math.sin(angulo) * radioMarcadores
      )
      this.orientarCartaCarruselHaciaAfuera(contenedorCarta)

      this.crearCartaCarruselAccidente(i, contenedorCarta)
    }

    this.configurarAnimacionCarrusel()
  }

  crearCartaCarruselAccidente(indice, contenedor) {
    const baseCarta = BABYLON.MeshBuilder.CreateBox(
      `baseCartaCarrusel_${indice}`,
      {
        width: 1.04,
        height: 1.38,
        depth: 0.08
      },
      this.scene
    )
    baseCarta.parent = contenedor
    baseCarta.position.y = 0.75

    const materialBaseCarta = new BABYLON.StandardMaterial(
      `matBaseCartaCarrusel_${indice}`,
      this.scene
    )
    materialBaseCarta.diffuseColor = new BABYLON.Color3(0.2, 0.13, 0.09)
    materialBaseCarta.specularColor = new BABYLON.Color3(0.06, 0.04, 0.03)
    materialBaseCarta.emissiveColor = new BABYLON.Color3(0.008, 0.004, 0.002)
    baseCarta.material = materialBaseCarta

    const caraCarta = BABYLON.MeshBuilder.CreatePlane(
      `caraCartaCarrusel_${indice}`,
      {
        width: 0.94,
        height: 1.32
      },
      this.scene
    )
    caraCarta.parent = contenedor
    caraCarta.rotation.y = Math.PI
    caraCarta.position = new BABYLON.Vector3(0, 0.75, -0.043)

    const materialCaraCarta = new BABYLON.StandardMaterial(
      `matCaraCartaCarrusel_${indice}`,
      this.scene
    )

    const coloresCarta = [
      new BABYLON.Color3(0.63, 0.29, 0.19),
      new BABYLON.Color3(0.62, 0.39, 0.18),
      new BABYLON.Color3(0.55, 0.33, 0.2),
      new BABYLON.Color3(0.45, 0.27, 0.18)
    ]
    const colorCarta = coloresCarta[indice % coloresCarta.length]
    materialCaraCarta.diffuseColor = colorCarta
    materialCaraCarta.specularColor = new BABYLON.Color3(0.05, 0.03, 0.02)
    materialCaraCarta.emissiveColor = colorCarta.scale(0.05)
    caraCarta.material = materialCaraCarta

    const bandaCarta = BABYLON.MeshBuilder.CreatePlane(
      `bandaCartaCarrusel_${indice}`,
      {
        width: 0.94,
        height: 0.26
      },
      this.scene
    )
    bandaCarta.parent = contenedor
    bandaCarta.rotation.y = Math.PI
    bandaCarta.position = new BABYLON.Vector3(0, 1.18, -0.044)

    const materialBandaCarta = new BABYLON.StandardMaterial(
      `matBandaCartaCarrusel_${indice}`,
      this.scene
    )
    materialBandaCarta.diffuseColor = new BABYLON.Color3(0.84, 0.66, 0.3)
    materialBandaCarta.emissiveColor = new BABYLON.Color3(0.03, 0.02, 0.006)
    bandaCarta.material = materialBandaCarta

  }

  configurarAnimacionCarrusel() {
    if (!this.carruselAccidentes) {
      return
    }

    const velocidadRotacion = 0.00045

    this.scene.onBeforeRenderObservable.add(() => {
      if (!this.visible || !this.carruselAccidentes) {
        return
      }

      const delta = this.engine.getDeltaTime()
      this.carruselAccidentes.rotation.y -= delta * velocidadRotacion
    })
  }

  orientarCartaCarruselHaciaAfuera(contenedor) {
    const angulo = Math.atan2(contenedor.position.z, contenedor.position.x)
    contenedor.rotation.y = Math.PI / 2 - angulo
  }

  crearBandejaTablero({ nombre, width, depth, position, colorBase, colorAcento }) {
    const bandeja = BABYLON.MeshBuilder.CreateBox(
      nombre,
      {
        width,
        depth,
        height: 0.09
      },
      this.scene
    )
    bandeja.position = position

    const materialBandeja = new BABYLON.StandardMaterial(`mat_${nombre}`, this.scene)
    materialBandeja.diffuseColor = colorBase
    materialBandeja.specularColor = new BABYLON.Color3(0.08, 0.06, 0.04)
    materialBandeja.emissiveColor = colorBase.scale(0.06)
    bandeja.material = materialBandeja

    const superficie = BABYLON.MeshBuilder.CreateGround(
      `${nombre}_superficie`,
      {
        width: Math.max(width - 0.26, 0.7),
        height: Math.max(depth - 0.26, 0.7),
        subdivisions: 1
      },
      this.scene
    )
    superficie.position = position.add(new BABYLON.Vector3(0, 0.05, 0))

    const materialSuperficie = new BABYLON.StandardMaterial(
      `mat_${nombre}_superficie`,
      this.scene
    )
    materialSuperficie.diffuseColor = colorBase.scale(0.82)
    materialSuperficie.specularColor = new BABYLON.Color3(0.04, 0.03, 0.02)
    materialSuperficie.emissiveColor = colorBase.scale(0.04)
    superficie.material = materialSuperficie

    const acento = BABYLON.MeshBuilder.CreateGround(
      `${nombre}_acento`,
      {
        width: Math.max(width - 0.62, 0.22),
        height: Math.min(depth * 0.14, 0.38),
        subdivisions: 1
      },
      this.scene
    )
    acento.position = position.add(new BABYLON.Vector3(0, 0.055, -depth * 0.24))

    if (depth > width) {
      acento.scaling.x = 0.55
      acento.scaling.z = 2.7
    }

    const materialAcento = new BABYLON.StandardMaterial(
      `mat_${nombre}_acento`,
      this.scene
    )
    materialAcento.diffuseColor = colorAcento
    materialAcento.emissiveColor = colorAcento.scale(0.1)
    materialAcento.specularColor = new BABYLON.Color3(0.03, 0.025, 0.02)
    acento.material = materialAcento

    const marcador = BABYLON.MeshBuilder.CreateDisc(
      `${nombre}_marcador`,
      {
        radius: 0.18,
        tessellation: 28
      },
      this.scene
    )
    marcador.rotation.x = Math.PI / 2
    marcador.position = position.add(
      new BABYLON.Vector3(width > depth ? width * 0.36 : 0, 0.058, depth > width ? depth * 0.36 : 0)
    )

    const materialMarcador = new BABYLON.StandardMaterial(
      `mat_${nombre}_marcador`,
      this.scene
    )
    materialMarcador.diffuseColor = colorAcento
    materialMarcador.emissiveColor = colorAcento.scale(0.12)
    marcador.material = materialMarcador
  }

  crearHUD() {
    this.guiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
      'guiPartida',
      true,
      this.scene
    )
    GestorAjusteRatio.configurarGUI(this.guiTexture)

    this.overlay = new GUI.Rectangle('overlayPartida')
    this.overlay.width = 1
    this.overlay.height = 1
    this.overlay.thickness = 0
    this.overlay.background = 'transparent'
    this.guiTexture.addControl(this.overlay)

    this.crearEncabezadoPartida()
    this.crearPanelDerecha()
    this.crearBotonVolver()
    this.crearPanelCartas()
    this.crearPanelesInicio()
  }

  crearPanelesInicio() {
    console.log('[VistaPartida] crearPanelesInicio - Iniciando')

    this.panelAccidentesInicio = this.crearPanelModal('panelAccidentesInicio', 'Accidentes en Mesa')
    this.panelPerfilInicio = this.crearPanelModal('panelPerfilInicio', 'Tu Perfil Asignado')

    console.log('[VistaPartida] crearPanelesInicio - Panel accidentes:', !!this.panelAccidentesInicio)
    console.log('[VistaPartida] crearPanelesInicio - Panel perfil:', !!this.panelPerfilInicio)
  }

  crearPanelModal(nombre, tituloTexto) {
    const panel = new GUI.Rectangle(nombre)
    panel.width = '600px'
    panel.height = '500px'
    panel.thickness = 3
    panel.cornerRadius = 20
    panel.color = '#8e4d22'
    panel.background = 'rgba(28, 20, 16, 0.95)'
    panel.shadowColor = '#000000'
    panel.shadowBlur = 30
    panel.shadowOffsetY = 10
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    panel.isVisible = false
    panel.zIndex = 1000
    this.overlay.addControl(panel)

    const titulo = new GUI.TextBlock(`${nombre}_titulo`, tituloTexto)
    titulo.top = '-200px'
    titulo.height = '50px'
    titulo.color = '#ffe2c8'
    titulo.fontSize = 26
    titulo.fontFamily = 'Comic Sans MS'
    titulo.fontWeight = 'bold'
    panel.addControl(titulo)

    const container = new GUI.Rectangle(`${nombre}_container`)
    container.width = '540px'
    container.height = '360px'
    container.top = '20px'
    container.thickness = 0
    container.background = 'transparent'
    container.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    panel.addControl(container)

    const grid = new GUI.Grid(`${nombre}_grid`)
    grid.width = '520px'
    grid.height = '340px'

    for (let i = 0; i < 4; i++) {
      grid.addRowDefinition(80)
    }
    for (let i = 0; i < 2; i++) {
      grid.addColumnDefinition(0.5)
    }

    container.addControl(grid)

    const botonCerrar = GUI.Button.CreateSimpleButton(`${nombre}_cerrar`, 'Omitir')
    botonCerrar.width = '120px'
    botonCerrar.height = '40px'
    botonCerrar.top = '180px'
    botonCerrar.background = '#5a3321'
    botonCerrar.color = '#ffd8bc'
    botonCerrar.cornerRadius = 12
    botonCerrar.thickness = 2
    botonCerrar.borderColor = '#8e4d22'
    botonCerrar.fontSize = 14
    botonCerrar.fontFamily = 'Comic Sans MS'
    botonCerrar.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    botonCerrar.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
    botonCerrar.onPointerUpObservable.add(() => {
      panel.isVisible = false
    })
    panel.addControl(botonCerrar)

    return { panel, grid, titulo }
  }

  mostrarPanelAccidentesInicio() {
    if (!this.panelAccidentesInicio) return

    const { panel, grid } = this.panelAccidentesInicio

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 2; j++) {
        const control = grid.getControlByName(`accidente_${i}_${j}`)
        if (control) {
          grid.removeControl(control)
        }
      }
    }

    const accidentesEjemplo = [
      { codigo: 'SR', nombre: 'Sobrecarga de Red', nivel: 1 },
      { codigo: 'FD', nombre: 'Fuga de Datos', nivel: 2 },
      { codigo: 'AS', nombre: 'Ataque de Seguridad', nivel: 2 },
      { codigo: 'FS', nombre: 'Fallo de Software', nivel: 1 },
      { codigo: 'FH', nombre: 'Fallo de Hardware', nivel: 2 },
      { codigo: 'SI', nombre: 'Sesgo de IA', nivel: 3 },
      { codigo: 'CE', nombre: 'Corte de Energia', nivel: 2 },
      { codigo: 'PM', nombre: 'Phishing Masivo', nivel: 2 }
    ]

    accidentesEjemplo.forEach((accidente, indice) => {
      const fila = Math.floor(indice / 2)
      const columna = indice % 2

      const tarjeta = new GUI.Rectangle(`accidente_${indice}_0`)
      tarjeta.width = '240px'
      tarjeta.height = '70px'
      tarjeta.thickness = 2
      tarjeta.cornerRadius = 10
      tarjeta.color = '#a85a2a'

      const nivel = accidente.nivel || 1
      const coloresNivel = ['#4a2e1a', '#5a3520', '#6b4025', '#7d4a2a']
      tarjeta.background = coloresNivel[(nivel - 1) % coloresNivel.length]

      const texto = new GUI.TextBlock(`accidente_${indice}_1`, `${accidente.codigo}: ${accidente.nombre}`)
      texto.color = '#ffe0c2'
      texto.fontSize = 14
      texto.fontFamily = 'Comic Sans MS'
      texto.fontWeight = 'bold'
      texto.textWrapping = true
      tarjeta.addControl(texto)

      grid.addControl(tarjeta, fila, columna)
    })

    panel.isVisible = true
    console.log('[VistaPartida] Panel accidentes visible:', panel.isVisible)
  }

  mostrarPanelPerfilInicio() {
    if (!this.panelPerfilInicio) return

    const { panel, grid, titulo } = this.panelPerfilInicio

    const perfilEjemplo = {
      nombre: 'Analista de Sistemas',
      horasRequeridas: 6,
      descripcion: 'Analiza y optimiza sistemas tecnologicos.',
      categoriasValidas: ['Trabajo', 'Gestion', 'Desarrollo']
    }

    titulo.text = `Perfil: ${perfilEjemplo.nombre}`

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 2; j++) {
        const control = grid.getControlByName(`perfil_${i}_${j}`)
        if (control) {
          grid.removeControl(control)
        }
      }
    }

    const nombrePerfil = new GUI.Rectangle('perfil_0_0')
    nombrePerfil.width = '240px'
    nombrePerfil.height = '70px'
    nombrePerfil.thickness = 2
    nombrePerfil.cornerRadius = 10
    nombrePerfil.color = '#d66a1f'
    nombrePerfil.background = '#3d2a1d'

    const textoNombre = new GUI.TextBlock('perfil_0_1', perfilEjemplo.nombre)
    textoNombre.color = '#ffe2c8'
    textoNombre.fontSize = 16
    textoNombre.fontFamily = 'Comic Sans MS'
    textoNombre.fontWeight = 'bold'
    nombrePerfil.addControl(textoNombre)
    grid.addControl(nombrePerfil, 0, 0)

    const horasReq = new GUI.Rectangle('perfil_1_0')
    horasReq.width = '240px'
    horasReq.height = '70px'
    horasReq.thickness = 2
    horasReq.cornerRadius = 10
    horasReq.color = '#cf8a34'
    horasReq.background = '#3d2a1d'

    const textoHoras = new GUI.TextBlock('perfil_1_1', `Horas requeridas: ${perfilEjemplo.horasRequeridas}`)
    textoHoras.color = '#ffe0c2'
    textoHoras.fontSize = 14
    textoHoras.fontFamily = 'Comic Sans MS'
    horasReq.addControl(textoHoras)
    grid.addControl(horasReq, 1, 0)

    const descripcion = new GUI.Rectangle('perfil_2_0')
    descripcion.width = '490px'
    descripcion.height = '70px'
    descripcion.thickness = 2
    descripcion.cornerRadius = 10
    descripcion.color = '#845a3a'
    descripcion.background = '#2d221d'
    descripcion.columnSpan = 2

    const textoDesc = new GUI.TextBlock('perfil_2_1', perfilEjemplo.descripcion)
    textoDesc.color = '#f4cbaa'
    textoDesc.fontSize = 13
    textoDesc.fontFamily = 'Comic Sans MS'
    textoDesc.textWrapping = true
    descripcion.addControl(textoDesc)
    grid.addControl(descripcion, 2, 0)

    const categorias = perfilEjemplo.categoriasValidas.join(', ')
    const catsPanel = new GUI.Rectangle('perfil_3_0')
    catsPanel.width = '490px'
    catsPanel.height = '70px'
    catsPanel.thickness = 2
    catsPanel.cornerRadius = 10
    catsPanel.color = '#6b4c3a'
    catsPanel.background = '#2d221d'
    catsPanel.columnSpan = 2

    const textoCats = new GUI.TextBlock('perfil_3_1', `Categorias validas: ${categorias}`)
    textoCats.color = '#e7cfbc'
    textoCats.fontSize = 12
    textoCats.fontFamily = 'Comic Sans MS'
    textoCats.textWrapping = true
    catsPanel.addControl(textoCats)
    grid.addControl(catsPanel, 3, 0)

    panel.isVisible = true
    console.log('[VistaPartida] Panel perfil visible:', panel.isVisible)
  }

  mostrarSecuenciaInicio() {
    console.log('[VistaPartida] mostrarSecuenciaInicio - Iniciando')
    console.log('[VistaPartida] panelAccidentesInicio:', !!this.panelAccidentesInicio)
    console.log('[VistaPartida] panelPerfilInicio:', !!this.panelPerfilInicio)

    this.mostrarPanelAccidentesInicio()

    setTimeout(() => {
      console.log('[VistaPartida] Cerrando panel accidentes')
      if (this.panelAccidentesInicio && this.panelAccidentesInicio.panel) {
        this.panelAccidentesInicio.panel.isVisible = false
      }

      this.mostrarPanelPerfilInicio()

      setTimeout(() => {
        console.log('[VistaPartida] Cerrando panel perfil')
        if (this.panelPerfilInicio && this.panelPerfilInicio.panel) {
          this.panelPerfilInicio.panel.isVisible = false
        }
      }, 5000)
    }, 5000)
  }

  crearEncabezadoPartida() {
    const panelEncabezado = new GUI.Rectangle('panelEncabezadoPartida')
    panelEncabezado.width = '860px'
    panelEncabezado.height = '124px'
    panelEncabezado.top = '18px'
    panelEncabezado.thickness = 2
    panelEncabezado.cornerRadius = 24
    panelEncabezado.color = '#8e4d22'
    panelEncabezado.background = 'rgba(23, 17, 14, 0.88)'
    panelEncabezado.shadowColor = '#00000066'
    panelEncabezado.shadowBlur = 20
    panelEncabezado.shadowOffsetY = 8
    panelEncabezado.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    panelEncabezado.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP
    this.overlay.addControl(panelEncabezado)

    const titulo = new GUI.TextBlock('tituloPartida', 'Esperando inicio de partida...')
    titulo.top = '-28px'
    titulo.height = '34px'
    titulo.color = '#ffe2c8'
    titulo.fontSize = 28
    titulo.fontFamily = 'Comic Sans MS'
    titulo.fontWeight = 'bold'
    panelEncabezado.addControl(titulo)

    const subtitulo = new GUI.TextBlock(
      'subtituloPartida',
      'Cargando datos del juego...'
    )
    subtitulo.top = '2px'
    subtitulo.height = '28px'
    subtitulo.color = '#f4cbaa'
    subtitulo.fontSize = 16
    subtitulo.fontFamily = 'Comic Sans MS'
    panelEncabezado.addControl(subtitulo)

    const panelEstado = new GUI.Grid('gridEstadoPartida')
    panelEstado.width = '92%'
    panelEstado.height = '36px'
    panelEstado.top = '34px'
    panelEstado.addColumnDefinition(0.33)
    panelEstado.addColumnDefinition(0.34)
    panelEstado.addColumnDefinition(0.33)
    panelEncabezado.addControl(panelEstado)

    const estados = [
      'Perfil: Sin asignar',
      'Accidentes: 0 en mesa',
      'Objetivo: 0 horas'
    ]

    estados.forEach((texto, indice) => {
      const bloque = new GUI.Rectangle(`estado_${indice}`)
      bloque.height = '32px'
      bloque.thickness = 0
      bloque.cornerRadius = 12
      bloque.background = indice === 1 ? '#5a2e1d' : '#2d221d'

      const textoEstado = new GUI.TextBlock(`estadoTexto_${indice}`, texto)
      textoEstado.color = '#ffe8d3'
      textoEstado.fontSize = 14
      textoEstado.fontFamily = 'Comic Sans MS'
      bloque.addControl(textoEstado)

      panelEstado.addControl(bloque, 0, indice)
    })
  }

  crearPanelDerecha() {
    const panelDerecha = new GUI.StackPanel()
    panelDerecha.width = '120px'
    panelDerecha.height = '400px'
    panelDerecha.right = '20px'
    panelDerecha.isVertical = true
    panelDerecha.spacing = 15
    panelDerecha.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    panelDerecha.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
    this.overlay.addControl(panelDerecha)

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
  }

  crearBotonVolver() {
    const botonVolver = GUI.Button.CreateSimpleButton('btnVolverPartida', 'Volver')
    botonVolver.width = '150px'
    botonVolver.height = '48px'
    botonVolver.left = '20px'
    botonVolver.top = '20px'
    botonVolver.background = '#362924'
    botonVolver.color = '#ffd8bc'
    botonVolver.cornerRadius = 16
    botonVolver.thickness = 2
    botonVolver.borderColor = '#8e4d22'
    botonVolver.fontSize = 18
    botonVolver.fontWeight = 'bold'
    botonVolver.fontFamily = 'Comic Sans MS'
    botonVolver.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    botonVolver.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP

    botonVolver.onPointerUpObservable.add(() => {
      this.callbackVolver && this.callbackVolver()
    })

    this.overlay.addControl(botonVolver)
  }

  crearPanelCartas() {
    const panelInferior = new GUI.Rectangle('panelCartas')
    panelInferior.width = '95%'
    panelInferior.height = '240px'
    panelInferior.bottom = '15px'
    panelInferior.background = 'rgba(28, 20, 18, 0.92)'
    panelInferior.cornerRadius = 15
    panelInferior.thickness = 3
    panelInferior.color = '#a85a2a'
    panelInferior.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    panelInferior.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
    panelInferior.zIndex = 100
    this.overlay.addControl(panelInferior)

    const containerCartas = new GUI.Rectangle('containerCartas')
    containerCartas.width = '97%'
    containerCartas.height = '170px'
    containerCartas.top = '18px'
    containerCartas.background = 'transparent'
    containerCartas.thickness = 0
    panelInferior.addControl(containerCartas)

    const gridMano = new GUI.Grid('gridManoCartas')
    gridMano.width = '100%'
    gridMano.height = '100%'
    gridMano.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    gridMano.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    gridMano.paddingLeft = '8px'
    gridMano.paddingRight = '8px'
    for (let columna = 0; columna < 8; columna++) {
      gridMano.addColumnDefinition(1 / 8)
    }
    for (let fila = 0; fila < 1; fila++) {
      gridMano.addRowDefinition(1)
    }
    containerCartas.addControl(gridMano)

    const cartas = [
      {
        titulo: 'GitHub',
        categoria: 'Trabajo',
        codigo: 'GH',
        detalle: 'Versiona tareas y coordina entregas.',
        color: '#d66a1f'
      },
      {
        titulo: 'Discord',
        categoria: 'Comunicacion',
        codigo: 'DS',
        detalle: 'Coordina mensajes y actividades grupales.',
        color: '#b95a2e'
      },
      {
        titulo: 'Google Drive',
        categoria: 'Nube',
        codigo: 'GD',
        detalle: 'Respalda archivos y comparte recursos.',
        color: '#cf8a34'
      },
      {
        titulo: 'YouTube',
        categoria: 'Difusion',
        codigo: 'YT',
        detalle: 'Expone contenido y tutoriales del equipo.',
        color: '#bc4a2c'
      },
      {
        titulo: 'Slack',
        categoria: 'Trabajo',
        codigo: 'SL',
        detalle: 'Organiza conversaciones por canales.',
        color: '#845a3a'
      },
      {
        titulo: 'Twitch',
        categoria: 'Streaming',
        codigo: 'TW',
        detalle: 'Activa eventos en vivo e interacciones.',
        color: '#7d4d31'
      },
      {
        titulo: 'Jira',
        categoria: 'Gestion',
        codigo: 'JR',
        detalle: 'Gestiona proyectos y seguimiento de tareas.',
        color: '#6b4c3a'
      },
      {
        titulo: 'Notion',
        categoria: 'Productividad',
        codigo: 'NT',
        detalle: 'Crea文档 y bases de conocimiento.',
        color: '#5a4a3a'
      }
    ]

    cartas.slice(0, 8).forEach((carta, indice) => {
      gridMano.addControl(this.crearCartaMano(carta, indice), 0, indice)
    })
  }

  crearCartaMano(carta, indice) {
    const cartaPanel = new GUI.Rectangle(`carta_${indice}`)
    cartaPanel.width = '98%'
    cartaPanel.height = '90%'
    cartaPanel.background = '#211713'
    cartaPanel.cornerRadius = 14
    cartaPanel.thickness = 2
    cartaPanel.color = '#d3a06a'
    cartaPanel.shadowColor = '#00000055'
    cartaPanel.shadowBlur = 8
    cartaPanel.shadowOffsetY = 3

    const bandaSuperior = new GUI.Rectangle(`cartaBanda_${indice}`)
    bandaSuperior.width = '18px'
    bandaSuperior.height = '100%'
    bandaSuperior.thickness = 0
    bandaSuperior.background = carta.color
    bandaSuperior.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    cartaPanel.addControl(bandaSuperior)

    const placaCodigo = new GUI.Ellipse(`placaCodigo_${indice}`)
    placaCodigo.width = '34px'
    placaCodigo.height = '34px'
    placaCodigo.left = '-46px'
    placaCodigo.top = '0px'
    placaCodigo.thickness = 2
    placaCodigo.color = '#f6d9b8'
    placaCodigo.background = '#5a3321'
    cartaPanel.addControl(placaCodigo)

    const codigo = new GUI.TextBlock(`codigo_${indice}`, carta.codigo)
    codigo.color = '#fff0df'
    codigo.fontSize = 16
    codigo.fontFamily = 'Comic Sans MS'
    codigo.fontWeight = 'bold'
    placaCodigo.addControl(codigo)

    const categoria = new GUI.TextBlock(
      `categoria_${indice}`,
      carta.categoria.toUpperCase()
    )
    categoria.top = '-22px'
    categoria.left = '18px'
    categoria.width = '96px'
    categoria.height = '18px'
    categoria.color = '#fff4ea'
    categoria.fontSize = 9
    categoria.fontFamily = 'Comic Sans MS'
    categoria.fontWeight = 'bold'
    categoria.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    cartaPanel.addControl(categoria)

    const ilustracion = new GUI.Rectangle(`ilustracion_${indice}`)
    ilustracion.width = '34px'
    ilustracion.height = '34px'
    ilustracion.left = '2px'
    ilustracion.top = '10px'
    ilustracion.thickness = 2
    ilustracion.cornerRadius = 8
    ilustracion.color = '#8a5a37'
    ilustracion.background = '#31211b'
    cartaPanel.addControl(ilustracion)

    const icono = new GUI.TextBlock(`iconoCarta_${indice}`, carta.codigo)
    icono.color = '#f6d5b3'
    icono.fontSize = 14
    icono.fontFamily = 'Comic Sans MS'
    icono.fontWeight = 'bold'
    ilustracion.addControl(icono)

    const nombre = new GUI.TextBlock(`nombre_${indice}`, carta.titulo)
    nombre.top = '2px'
    nombre.left = '26px'
    nombre.width = '96px'
    nombre.height = '24px'
    nombre.color = '#ffe0c2'
    nombre.fontSize = 13
    nombre.fontFamily = 'Comic Sans MS'
    nombre.fontWeight = 'bold'
    nombre.textWrapping = true
    nombre.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    cartaPanel.addControl(nombre)

    const descripcion = new GUI.TextBlock(`detalle_${indice}`, carta.detalle)
    descripcion.top = '24px'
    descripcion.left = '26px'
    descripcion.width = '96px'
    descripcion.height = '30px'
    descripcion.color = '#e7cfbc'
    descripcion.fontSize = 8.5
    descripcion.fontFamily = 'Comic Sans MS'
    descripcion.textWrapping = true
    descripcion.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    cartaPanel.addControl(descripcion)

    const pieCarta = new GUI.Rectangle(`pieCarta_${indice}`)
    pieCarta.width = '104px'
    pieCarta.height = '8px'
    pieCarta.top = '30px'
    pieCarta.left = '22px'
    pieCarta.thickness = 0
    pieCarta.cornerRadius = 4
    pieCarta.background = carta.color
    cartaPanel.addControl(pieCarta)

    return cartaPanel
  }

  onVolver(callback) {
    this.callbackVolver = callback
  }

  configurarAccidentes(accidentes) {
    this.accidentes = accidentes
    if (this.carruselAccidentes) {
      this.actualizarCarruselAccidentes()
    }
  }

  actualizarCarruselAccidentes() {
    if (!this.accidentes || this.accidentes.length === 0) return

    const cantidad = Math.min(this.accidentes.length, 8)
    for (let i = 0; i < 8; i++) {
      const caraCarta = this.scene.getMeshByName(`caraCartaCarrusel_${i}`)
      const bandaCarta = this.scene.getMeshByName(`bandaCartaCarrusel_${i}`)

      if (i < cantidad && this.accidentes[i]) {
        const accidente = this.accidentes[i]
        const color = this.obtenerColorAccidente(accidente)

        if (caraCarta && caraCarta.material) {
          caraCarta.material.diffuseColor = color
          caraCarta.material.emissiveColor = color.scale(0.08)
        }

        if (bandaCarta && bandaCarta.material) {
          bandaCarta.material.diffuseColor = new BABYLON.Color3(0.84, 0.66, 0.3)
          bandaCarta.material.emissiveColor = new BABYLON.Color3(0.03, 0.02, 0.006)
        }
      }
    }
  }

  obtenerColorAccidente(accidente) {
    const coloresPorNivel = [
      new BABYLON.Color3(0.55, 0.28, 0.18),
      new BABYLON.Color3(0.58, 0.36, 0.16),
      new BABYLON.Color3(0.62, 0.24, 0.14),
      new BABYLON.Color3(0.48, 0.22, 0.16)
    ]
    const nivel = accidente.nivel || 1
    return coloresPorNivel[(nivel - 1) % coloresPorNivel.length]
  }

  configurarPerfil(perfil) {
    this.perfil = perfil
    this.actualizarHUDPerfil()
  }

  actualizarHUDPerfil() {
    if (!this.perfil) return

    const tituloPartida = this.guiTexture.getControlByName('tituloPartida')
    if (tituloPartida) {
      tituloPartida.text = `${this.perfil.nombre}`
    }

    const estado0 = this.guiTexture.getControlByName('estado_0')
    if (estado0) {
      const texto = estado0.children[0]
      if (texto) {
        texto.text = `Perfil: ${this.perfil.nombre}`
      }
    }

    const estado1 = this.guiTexture.getControlByName('estado_1')
    if (estado1 && this.accidentes) {
      const texto = estado1.children[0]
      if (texto) {
        texto.text = `Accidentes: ${this.accidentes.length} en mesa`
      }
    }

    const estado2 = this.guiTexture.getControlByName('estado_2')
    if (estado2) {
      const texto = estado2.children[0]
      if (texto) {
        texto.text = `Objetivo: ${this.perfil.horasRequeridas} horas`
      }
    }
  }

  configurarCartas(cartas) {
    this.cartas = cartas
    this.actualizarPanelCartas()
  }

  actualizarPanelCartas() {
    if (!this.cartas || this.cartas.length === 0) return

    const gridMano = this.guiTexture.getControlByName('gridManoCartas')
    if (!gridMano) return

    for (let i = 0; i < 8; i++) {
      if (i < this.cartas.length) {
        const carta = this.cartas[i]
        this.actualizarCartaMano(i, carta)
      }
    }
  }

  actualizarCartaMano(indice, carta) {
    const cartaPanel = this.guiTexture.getControlByName(`carta_${indice}`)
    if (!cartaPanel) return

    const categoria = cartaPanel.children.find(c => c.name === `categoria_${indice}`)
    if (categoria) {
      categoria.text = carta.categoria.toUpperCase()
    }

    const nombre = cartaPanel.children.find(c => c.name === `nombre_${indice}`)
    if (nombre) {
      nombre.text = carta.titulo
    }

    const detalle = cartaPanel.children.find(c => c.name === `detalle_${indice}`)
    if (detalle) {
      detalle.text = carta.detalle
    }

    const icono = cartaPanel.children.find(c => c.name === `iconoCarta_${indice}`)
    if (icono) {
      icono.text = carta.codigo
    }

    const banda = cartaPanel.children.find(c => c.name?.startsWith('cartaBanda_'))
    if (banda) {
      banda.background = carta.color
    }

    const pie = cartaPanel.children.find(c => c.name?.startsWith('pieCarta_'))
    if (pie) {
      pie.background = carta.color
    }

    cartaPanel.color = carta.estaDeshabilitada() ? '#666666' : '#d3a06a'
    cartaPanel.isEnabled = !carta.estaDeshabilitada()
  }

  mostrar() {
    if (this.scene && this.overlay) {
      if (!this.sceneAnterior && this.engine.activeScene) {
        this.sceneAnterior = this.engine.activeScene
      }
      this.engine.activeScene = this.scene
      this.overlay.isVisible = true
      this.visible = true

      this.actualizarCarruselAccidentes()
      this.actualizarHUDPerfil()
      this.actualizarPanelCartas()

      this.mostrarPanelesInicioDirecto()
    }
  }

  mostrarPanelesInicioDirecto() {
    console.log('[VistaPartida] mostrarPanelesInicioDirecto - Iniciando')

    if (!this.overlay) {
      console.log('[VistaPartida] ERROR: overlay no existe')
      return
    }

    const panelAccidentes = new GUI.Rectangle('panelAccidentesInicio')
    panelAccidentes.width = '600px'
    panelAccidentes.height = '500px'
    panelAccidentes.thickness = 3
    panelAccidentes.cornerRadius = 20
    panelAccidentes.color = '#8e4d22'
    panelAccidentes.background = 'rgba(28, 20, 16, 0.95)'
    panelAccidentes.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    panelAccidentes.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    panelAccidentes.zIndex = 1000
    this.overlay.addControl(panelAccidentes)

    const tituloAcc = new GUI.TextBlock('tituloAccidentes', 'Accidentes en Mesa')
    tituloAcc.top = '-200px'
    tituloAcc.height = '50px'
    tituloAcc.color = '#ffe2c8'
    tituloAcc.fontSize = 26
    tituloAcc.fontFamily = 'Comic Sans MS'
    tituloAcc.fontWeight = 'bold'
    panelAccidentes.addControl(tituloAcc)

    const accidentesTexto = new GUI.TextBlock('textoAccidentes',
      'SR: Sobrecarga de Red\n' +
      'FD: Fuga de Datos\n' +
      'AS: Ataque de Seguridad\n' +
      'FS: Fallo de Software\n' +
      'FH: Fallo de Hardware\n' +
      'SI: Sesgo de IA\n' +
      'CE: Corte de Energia\n' +
      'PM: Phishing Masivo')
    accidentesTexto.color = '#ffe0c2'
    accidentesTexto.fontSize = 18
    accidentesTexto.fontFamily = 'Comic Sans MS'
    accidentesTexto.textWrapping = true
    panelAccidentes.addControl(accidentesTexto)

    const botonOmitir = GUI.Button.CreateSimpleButton('btnOmitirAccidentes', 'Omitir')
    botonOmitir.width = '120px'
    botonOmitir.height = '40px'
    botonOmitir.top = '180px'
    botonOmitir.background = '#5a3321'
    botonOmitir.color = '#ffd8bc'
    botonOmitir.cornerRadius = 12
    botonOmitir.fontSize = 14
    botonOmitir.fontFamily = 'Comic Sans MS'
    botonOmitir.onPointerUpObservable.add(() => {
      panelAccidentes.dispose()
      this.mostrarPanelPerfilDirecto()
    })
    panelAccidentes.addControl(botonOmitir)

    console.log('[VistaPartida] Panel accidentes creado y agregado')

    setTimeout(() => {
      console.log('[VistaPartida] Cerrando panel accidentes')
      if (panelAccidentes && panelAccidentes.isVisible) {
        panelAccidentes.isVisible = false
        this.mostrarPanelPerfilDirecto()
      }
    }, 5000)
  }

  mostrarPanelPerfilDirecto() {
    console.log('[VistaPartida] mostrarPanelPerfilDirecto - Iniciando')

    const panelPerfil = new GUI.Rectangle('panelPerfilInicio')
    panelPerfil.width = '500px'
    panelPerfil.height = '400px'
    panelPerfil.thickness = 3
    panelPerfil.cornerRadius = 20
    panelPerfil.color = '#d66a1f'
    panelPerfil.background = 'rgba(28, 20, 16, 0.95)'
    panelPerfil.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    panelPerfil.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    panelPerfil.zIndex = 1000
    this.overlay.addControl(panelPerfil)

    const tituloPerf = new GUI.TextBlock('tituloPerfil', 'Tu Perfil Asignado')
    tituloPerf.top = '-150px'
    tituloPerf.height = '50px'
    tituloPerf.color = '#ffe2c8'
    tituloPerf.fontSize = 26
    tituloPerf.fontFamily = 'Comic Sans MS'
    tituloPerf.fontWeight = 'bold'
    panelPerfil.addControl(tituloPerf)

    const nombrePerf = new GUI.TextBlock('nombrePerfil', 'Analista de Sistemas')
    nombrePerf.top = '-60px'
    nombrePerf.height = '40px'
    nombrePerf.color = '#d66a1f'
    nombrePerf.fontSize = 22
    nombrePerf.fontFamily = 'Comic Sans MS'
    nombrePerf.fontWeight = 'bold'
    panelPerfil.addControl(nombrePerf)

    const horasPerf = new GUI.TextBlock('horasPerfil', 'Horas requeridas: 6')
    horasPerf.top = '-10px'
    horasPerf.height = '30px'
    horasPerf.color = '#cf8a34'
    horasPerf.fontSize = 18
    horasPerf.fontFamily = 'Comic Sans MS'
    panelPerfil.addControl(horasPerf)

    const descPerf = new GUI.TextBlock('descPerfil', 'Analiza y optimiza sistemas tecnologicos.')
    descPerf.top = '40px'
    descPerf.height = '40px'
    descPerf.color = '#f4cbaa'
    descPerf.fontSize = 16
    descPerf.fontFamily = 'Comic Sans MS'
    descPerf.textWrapping = true
    panelPerfil.addControl(descPerf)

    const catsPerf = new GUI.TextBlock('catsPerfil', 'Categorias: Trabajo, Gestion, Desarrollo')
    catsPerf.top = '100px'
    catsPerf.height = '30px'
    catsPerf.color = '#e7cfbc'
    catsPerf.fontSize = 14
    catsPerf.fontFamily = 'Comic Sans MS'
    panelPerfil.addControl(catsPerf)

    console.log('[VistaPartida] Panel perfil creado y agregado')

    setTimeout(() => {
      console.log('[VistaPartida] Cerrando panel perfil')
      if (panelPerfil && panelPerfil.isVisible) {
        panelPerfil.isVisible = false
      }
    }, 5000)
  }

  ocultar() {
    if (this.scene && this.overlay) {
      if (this.sceneAnterior) {
        this.engine.activeScene = this.sceneAnterior
      }
      this.overlay.isVisible = false
      this.visible = false
    }
  }
}
