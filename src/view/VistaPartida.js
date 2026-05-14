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
    this.panelAccidentesVisible = false

    this.nombreJugador = 'Jugador'
    this.accidentes = []
    this.perfil = null
    this.cartas = []
    this.cartasData = []
    this.dragState = null
    this.jugadorActual = 1
    this.totalJugadores = 4
    this.zonaDropIntercambio = null
    this.zonaDropTablero = null
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

    const textoNombre = BABYLON.MeshBuilder.CreatePlane(
      'textoNombreJugador',
      {
        width: 1.2,
        height: 0.35,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
      },
      this.scene
    )
    textoNombre.rotation.x = Math.PI / 2
    textoNombre.parent = this.carruselAccidentes
    textoNombre.position = new BABYLON.Vector3(0, 0.41, 0)

    const materialTextoNombre = new BABYLON.StandardMaterial(
      'matTextoNombreJugador',
      this.scene
    )
    materialTextoNombre.diffuseColor = new BABYLON.Color3(1, 1, 1)
    materialTextoNombre.emissiveColor = new BABYLON.Color3(1, 1, 1)
    materialTextoNombre.alpha = 1
    textoNombre.material = materialTextoNombre

    const texturaNombre = new BABYLON.DynamicTexture(
      'texturaNombreJugador',
      { width: 512, height: 128 },
      this.scene
    )
    texturaNombre.drawText(this.nombreJugador, null, 48, '#ffe2c8', 'rgba(0,0,0,0)', true)
    materialTextoNombre.diffuseTexture = texturaNombre
    materialTextoNombre.emissiveTexture = texturaNombre
    materialTextoNombre.useAlphaFromDiffuseTexture = true
    this.texturaNombreJugador = texturaNombre

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
    this.configurarClickCarrusel()
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
        height: 1.32,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
      },
      this.scene
    )
    caraCarta.parent = contenedor
    caraCarta.rotation.y = Math.PI
    caraCarta.rotation.z = Math.PI
    caraCarta.position = new BABYLON.Vector3(0, 0.75, 0.043)

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

    const textoCarta = BABYLON.MeshBuilder.CreatePlane(
      `textoCartaCarrusel_${indice}`,
      {
        width: 0.84,
        height: 0.22,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
      },
      this.scene
    )
    textoCarta.parent = contenedor
    textoCarta.rotation.y = Math.PI
    textoCarta.rotation.z = Math.PI
    textoCarta.position = new BABYLON.Vector3(0, 0.32, 0.044)

    const materialTextoCarta = new BABYLON.StandardMaterial(
      `matTextoCartaCarrusel_${indice}`,
      this.scene
    )
    materialTextoCarta.diffuseColor = new BABYLON.Color3(0.15, 0.1, 0.07)
    materialTextoCarta.emissiveColor = new BABYLON.Color3(0.02, 0.01, 0.005)
    textoCarta.material = materialTextoCarta

    const codigoTexto = new BABYLON.DynamicTexture(
      `codigoTextoCarrusel_${indice}`,
      { width: 256, height: 64 },
      this.scene
    )
    codigoTexto.drawText('---', null, 40, '#ffe2c8', 'rgba(0,0,0,0)', true)
    materialTextoCarta.diffuseTexture = codigoTexto
    materialTextoCarta.useAlphaFromDiffuseTexture = false
  }

  configurarClickCarrusel() {
    if (!this.carruselAccidentes) return

    this.scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type !== BABYLON.PointerEventTypes.POINTERDOWN) return

      if (this.panelAccidentesVisible) {
        this.ocultarPanelAccidentes()
        return
      }

      const pickInfo = pointerInfo.pickInfo
      if (!pickInfo || !pickInfo.hit) return

      const mesh = pickInfo.pickedMesh
      if (!mesh) return

      const nombre = mesh.name || ''
      const esCarrusel = nombre.includes('Carrusel') || nombre.includes('carrusel')

      if (esCarrusel) {
        this.mostrarPanelAccidentes()
      }
    })
  }

  mostrarPanelAccidentes() {
    if (!this.accidentes || this.accidentes.length === 0) return

    this.panelAccidentesVisible = true

    const fondo = new GUI.Rectangle('fondoPanelAccidentes')
    fondo.name = 'fondoPanelAccidentes'
    fondo.width = 1
    fondo.height = 1
    fondo.thickness = 0
    fondo.background = 'rgba(0, 0, 0, 0.7)'
    fondo.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    fondo.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    fondo.zIndex = 2000
    this.overlay.addControl(fondo)

    const panel = new GUI.Rectangle('panelAccidentes')
    panel.width = '1200px'
    panel.height = '640px'
    panel.thickness = 3
    panel.cornerRadius = 20
    panel.color = '#8e4d22'
    panel.background = 'rgba(28, 20, 16, 0.97)'
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    panel.zIndex = 2001
    fondo.addControl(panel)

    panel.onPointerDownObservable.add(() => {
      return
    })

    const titulo = new GUI.TextBlock('tituloPanelAccidentes', 'Accidentes en Mesa')
    titulo.top = '-300px'
    titulo.height = '50px'
    titulo.color = '#ffe2c8'
    titulo.fontSize = 28
    titulo.fontFamily = 'Comic Sans MS'
    titulo.fontWeight = 'bold'
    panel.addControl(titulo)

    const gridAccidentes = new GUI.Grid('gridPanelAccidentes')
    gridAccidentes.width = '1160px'
    gridAccidentes.height = '540px'
    gridAccidentes.top = '0px'
    gridAccidentes.paddingLeft = '8px'
    gridAccidentes.paddingRight = '8px'
    gridAccidentes.paddingTop = '4px'
    gridAccidentes.paddingBottom = '4px'
    for (let i = 0; i < 2; i++) {
      gridAccidentes.addRowDefinition(270)
    }
    for (let i = 0; i < 4; i++) {
      gridAccidentes.addColumnDefinition(0.25)
    }
    panel.addControl(gridAccidentes)

    this.accidentes.slice(0, 8).forEach((accidente, indice) => {
      const fila = Math.floor(indice / 4)
      const columna = indice % 4

      const nivelColor = accidente.nivel >= 3 ? '#cc3333' : accidente.nivel === 2 ? '#e67e22' : '#e6a817'

      const imagenSrc = accidente.obtenerImagen ? accidente.obtenerImagen() : null
      if (imagenSrc) {
        const imagen = new GUI.Image(`accidenteImgPanel_${indice}`, imagenSrc)
        imagen.width = '270px'
        imagen.height = '270px'
        imagen.stretch = GUI.Image.STRETCH_UNIFORM
        imagen.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
        imagen.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
        imagen.thickness = 2
        imagen.color = nivelColor
        gridAccidentes.addControl(imagen, fila, columna)
      }
    })

    const botonCerrar = GUI.Button.CreateSimpleButton('btnCerrarAccidentes', 'Cerrar')
    botonCerrar.width = '120px'
    botonCerrar.height = '40px'
    botonCerrar.top = '295px'
    botonCerrar.background = '#5a3321'
    botonCerrar.color = '#ffd8bc'
    botonCerrar.cornerRadius = 12
    botonCerrar.fontSize = 14
    botonCerrar.fontFamily = 'Comic Sans MS'
    botonCerrar.onPointerUpObservable.add(() => {
      fondo.dispose()
    })
    panel.addControl(botonCerrar)
  }

  ocultarPanelAccidentes() {
    this.panelAccidentesVisible = false

    const fondo = this.overlay.getControlByName('fondoPanelAccidentes')
    if (fondo) {
      fondo.dispose()
    }
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
    this.overlay.isPointerBlocker = false
    this.guiTexture.addControl(this.overlay)

    this.crearEncabezadoPartida()
    this.crearBotonVolver()
    this.crearPanelCartas()
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
    panelEstado.addColumnDefinition(0.25)
    panelEstado.addColumnDefinition(0.25)
    panelEstado.addColumnDefinition(0.25)
    panelEstado.addColumnDefinition(0.25)
    panelEncabezado.addControl(panelEstado)

    const estados = [
      'Perfil: Sin asignar',
      'Accidentes: 0 en mesa',
      'Objetivo: 0 horas',
      'Turno 1/4'
    ]

    estados.forEach((texto, indice) => {
      const bloque = new GUI.Rectangle(`estado_${indice}`)
      bloque.height = '32px'
      bloque.thickness = 0
      bloque.cornerRadius = 12
      bloque.background = indice === 1 ? '#5a2e1d' : indice === 3 ? '#3a2a1d' : '#2d221d'

      const textoEstado = new GUI.TextBlock(`estadoTexto_${indice}`, texto)
      textoEstado.color = '#ffe8d3'
      textoEstado.fontSize = 14
      textoEstado.fontFamily = 'Comic Sans MS'
      bloque.addControl(textoEstado)

      panelEstado.addControl(bloque, 0, indice)
    })

    const barraContenedor = new GUI.Rectangle('barraProgresoContenedor')
    barraContenedor.width = '92%'
    barraContenedor.height = '18px'
    barraContenedor.top = '76px'
    barraContenedor.thickness = 1
    barraContenedor.cornerRadius = 9
    barraContenedor.color = '#5a3a28'
    barraContenedor.background = '#1a1210'
    panelEncabezado.addControl(barraContenedor)

    const barra = new GUI.Rectangle('barraProgreso')
    barra.width = '0%'
    barra.height = '100%'
    barra.thickness = 0
    barra.cornerRadius = 9
    barra.background = '#d66a1f'
    barra.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    barraContenedor.addControl(barra)

    const textoProgreso = new GUI.TextBlock('textoProgreso', '0/0 horas')
    textoProgreso.width = '100%'
    textoProgreso.height = '100%'
    textoProgreso.color = '#ffe2c8'
    textoProgreso.fontSize = 11
    textoProgreso.fontFamily = 'Comic Sans MS'
    textoProgreso.fontWeight = 'bold'
    barraContenedor.addControl(textoProgreso)
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
    const panelContenedor = new GUI.Rectangle('panelContenedorCartas')
    panelContenedor.width = '95%'
    panelContenedor.height = '255px'
    panelContenedor.bottom = '15px'
    panelContenedor.left = '130px'
    panelContenedor.background = 'transparent'
    panelContenedor.thickness = 0
    panelContenedor.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    panelContenedor.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
    panelContenedor.zIndex = 100
    this.overlay.addControl(panelContenedor)

    const contenedorIntercambio = new GUI.Rectangle('contenedorZonaIntercambio')
    contenedorIntercambio.width = '160px'
    contenedorIntercambio.height = '100%'
    contenedorIntercambio.left = '8px'
    contenedorIntercambio.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    contenedorIntercambio.background = 'rgba(28, 20, 18, 0.92)'
    contenedorIntercambio.cornerRadius = 15
    contenedorIntercambio.thickness = 3
    contenedorIntercambio.color = '#a85a2a'
    contenedorIntercambio.shadowColor = '#00000066'
    contenedorIntercambio.shadowBlur = 20
    contenedorIntercambio.shadowOffsetY = 8
    contenedorIntercambio.isPointerBlocker = false
    panelContenedor.addControl(contenedorIntercambio)

    const zonaIntercambio = new GUI.Grid('gridZonaIntercambio')
    zonaIntercambio.width = '100%'
    zonaIntercambio.height = '100%'
    zonaIntercambio.background = 'transparent'
    zonaIntercambio.cornerRadius = 0
    zonaIntercambio.thickness = 0
    zonaIntercambio.color = 'transparent'
    zonaIntercambio.isPointerBlocker = false
    for (let i = 0; i < 2; i++) {
      zonaIntercambio.addRowDefinition(0.5)
    }
    zonaIntercambio.addColumnDefinition(1)
    contenedorIntercambio.addControl(zonaIntercambio)

    const iconoZona = new GUI.TextBlock('iconoZonaIntercambio', '⇄')
    iconoZona.color = '#a88a6a'
    iconoZona.fontSize = 32
    iconoZona.fontFamily = 'Comic Sans MS'
    iconoZona.fontWeight = 'bold'
    zonaIntercambio.addControl(iconoZona, 0, 0)

    const textoZona = new GUI.TextBlock('textoZonaIntercambio', 'Soltar para intercambiar')
    textoZona.color = '#a88a6a'
    textoZona.fontSize = 11
    textoZona.fontFamily = 'Comic Sans MS'
    textoZona.textWrapping = true
    zonaIntercambio.addControl(textoZona, 1, 0)

    this.zonaDropIntercambio = zonaIntercambio

    const panelCartas = new GUI.Rectangle('panelCartas')
    panelCartas.width = '1200px'
    panelCartas.height = '100%'
    panelCartas.left = '170px'
    panelCartas.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    panelCartas.background = 'rgba(28, 20, 18, 0.92)'
    panelCartas.cornerRadius = 15
    panelCartas.thickness = 3
    panelCartas.color = '#a85a2a'
    panelCartas.isPointerBlocker = false
    panelContenedor.addControl(panelCartas)

    const containerCartas = new GUI.Rectangle('containerCartas')
    containerCartas.width = '97%'
    containerCartas.height = '230px'
    containerCartas.top = '10px'
    containerCartas.background = 'transparent'
    containerCartas.thickness = 0
    containerCartas.paddingRight = '40px'
    panelCartas.addControl(containerCartas)

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

    for (let i = 0; i < 8; i++) {
      const cartaVacia = this.crearCartaManoVacia(i)
      gridMano.addControl(cartaVacia, 0, i)
    }
  }

  crearCartaManoVacia(indice) {
    const cartaPanel = new GUI.Rectangle(`carta_${indice}`)
    cartaPanel.width = '96%'
    cartaPanel.height = '92%'
    cartaPanel.background = 'rgba(33, 23, 19, 0.4)'
    cartaPanel.cornerRadius = 14
    cartaPanel.thickness = 2
    cartaPanel.color = '#4a3528'
    cartaPanel.isVisible = false
    return cartaPanel
  }

  crearCartaMano(carta, indice) {
    const imagenSrc = carta.obtenerImagen ? carta.obtenerImagen() : null
    const cartaPanel = new GUI.Image(`carta_${indice}`, imagenSrc)
    cartaPanel.width = '96%'
    cartaPanel.height = '92%'
    cartaPanel.stretch = GUI.Image.STRETCH_UNIFORM
    cartaPanel.isPointerBlocker = true

    if (carta.estaDeshabilitada()) {
      cartaPanel.alpha = 0.5
    }

    cartaPanel.onPointerDownObservable.add((coords) => {
      if (carta.estaDeshabilitada()) return
      this.dragState = {
        indice,
        carta,
        inicioY: coords.y,
        inicioX: coords.x,
        moviendo: false
      }
    })

    cartaPanel.onPointerUpObservable.add((coords) => {
      if (!this.dragState || this.dragState.indice !== indice) return
      const deltaY = this.dragState.inicioY - coords.y
      if (this.dragState.moviendo && deltaY > 60) {
        if (this.callbackJugarCarta) {
          this.callbackJugarCarta(carta)
        }
      }
      this.dragState = null
    })

    cartaPanel.onPointerMoveObservable.add((coords) => {
      if (!this.dragState || this.dragState.indice !== indice) return
      const deltaY = this.dragState.inicioY - coords.y
      const deltaX = Math.abs(this.dragState.inicioX - coords.x)
      if (deltaY > 10 || deltaX > 10) {
        this.dragState.moviendo = true
      }
      if (this.dragState.moviendo && deltaY > 0) {
        cartaPanel.top = `${-Math.min(deltaY, 80)}px`
        cartaPanel.alpha = Math.max(0.5, 1 - deltaY / 200)
      }
    })

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
      const textoCarta = this.scene.getMeshByName(`textoCartaCarrusel_${i}`)

      if (i < cantidad && this.accidentes[i]) {
        const accidente = this.accidentes[i]
        const color = this.obtenerColorAccidente(accidente)

        const imagenSrc = accidente.obtenerImagen ? accidente.obtenerImagen() : null
        if (imagenSrc && caraCarta && caraCarta.material) {
          const textura = new BABYLON.Texture(imagenSrc, this.scene, true, false, BABYLON.Texture.TRILINEAR_SAMPLINGMODE)
          textura.hasAlpha = true
          textura.uScale = -1
          caraCarta.material.diffuseTexture = textura
          caraCarta.material.emissiveTexture = textura
          caraCarta.material.diffuseColor = new BABYLON.Color3(1, 1, 1)
          caraCarta.material.specularColor = new BABYLON.Color3(0.1, 0.08, 0.06)
          caraCarta.material.useAlphaFromDiffuseTexture = true
        } else if (caraCarta && caraCarta.material) {
          caraCarta.material.diffuseColor = color
          caraCarta.material.emissiveColor = color.scale(0.08)
          caraCarta.material.diffuseTexture = null
          caraCarta.material.emissiveTexture = null
        }

        if (textoCarta && textoCarta.material && textoCarta.material.diffuseTexture) {
          const dt = textoCarta.material.diffuseTexture
          dt.clear()
          dt.drawText(`${accidente.codigo}: ${accidente.nombre}`, null, 22, '#ffe2c8', 'rgba(0,0,0,0)', true)
          dt.update(false)
        }
      } else {
        const caraCarta = this.scene.getMeshByName(`caraCartaCarrusel_${i}`)
        if (caraCarta && caraCarta.material) {
          caraCarta.material.diffuseColor = new BABYLON.Color3(0.2, 0.13, 0.09)
          caraCarta.material.emissiveColor = new BABYLON.Color3(0.008, 0.004, 0.002)
          caraCarta.material.diffuseTexture = null
          caraCarta.material.emissiveTexture = null
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
      tituloPartida.text = `Perfil: ${this.perfil.nombre}`
    }

    const subtitulo = this.guiTexture.getControlByName('subtituloPartida')
    if (subtitulo) {
      subtitulo.text = this.perfil.descripcion
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

    while (gridMano.children.length > 0) {
      gridMano.removeControl(gridMano.children[0])
    }

    for (let i = 0; i < 8; i++) {
      if (i < this.cartas.length) {
        const carta = this.cartas[i]
        const cartaPanel = this.crearCartaMano(carta, i)
        gridMano.addControl(cartaPanel, 0, i)
      } else {
        const cartaVacia = this.crearCartaManoVacia(i)
        cartaVacia.isVisible = true
        gridMano.addControl(cartaVacia, 0, i)
      }
    }
  }

  configurarNombreJugador(nombre) {
    this.nombreJugador = nombre
    if (this.texturaNombreJugador) {
      this.texturaNombreJugador.drawText(nombre, null, 48, '#ffe2c8', 'rgba(0,0,0,0)', true)
    }
  }

  mostrar() {
    if (this.scene && this.overlay) {
      if (!this.sceneAnterior && this.engine.activeScene) {
        this.sceneAnterior = this.engine.activeScene
      }
      this.engine.activeScene = this.scene
      this.overlay.isVisible = true
      this.visible = true

      const esMovil = window.innerWidth <= 768 || ('ontouchstart' in window && window.innerWidth < 1024)
      const esPortrait = window.innerHeight > window.innerWidth

      if (esMovil && esPortrait) {
        this.hardwareScalingAnterior = this.engine.getHardwareScalingLevel()
        this.engine.setHardwareScalingLevel(1 / window.devicePixelRatio)

        const anchoReal = window.innerWidth
        const altoReal = window.innerHeight

        this.canvas.style.width = `${altoReal}px`
        this.canvas.style.height = `${anchoReal}px`
        this.canvas.style.transform = `rotate(90deg) translate(${(altoReal - anchoReal) / 2}px, ${(altoReal - anchoReal) / 2}px)`
        this.canvas.style.transformOrigin = 'center center'
        this.canvas.style.position = 'fixed'
        this.canvas.style.top = '0'
        this.canvas.style.left = '0'
        this.canvas.style.zIndex = '1000'

        this.engine.resize()
      }

      this.actualizarCarruselAccidentes()
      this.actualizarHUDPerfil()
      this.actualizarPanelCartas()
      this.actualizarProgresoPerfil()
      this.actualizarEstadoTurno(this.jugadorActual || 1, this.totalJugadores || 4)

      if (this.accidentes && this.accidentes.length > 0 && this.perfil) {
        this.mostrarPanelesInicioDirecto()
      }
    }
  }

  ocultar() {
    if (this.scene && this.overlay) {
      if (this.sceneAnterior) {
        this.engine.activeScene = this.sceneAnterior
      }
      this.overlay.isVisible = false
      this.visible = false

      const esMovil = window.innerWidth <= 768 || ('ontouchstart' in window && window.innerWidth < 1024)
      const esPortrait = window.innerHeight > window.innerWidth

      if (esMovil && esPortrait && this.hardwareScalingAnterior !== undefined) {
        this.engine.setHardwareScalingLevel(this.hardwareScalingAnterior)

        this.canvas.style.width = '100%'
        this.canvas.style.height = '100%'
        this.canvas.style.transform = ''
        this.canvas.style.position = ''
        this.canvas.style.top = ''
        this.canvas.style.left = ''
        this.canvas.style.zIndex = ''

        this.engine.resize()
        this.hardwareScalingAnterior = undefined
      }
    }
  }

  mostrarPanelesInicioDirecto() {
    console.log('[VistaPartida] mostrarPanelesInicioDirecto - Iniciando')

    if (!this.overlay) {
      console.log('[VistaPartida] ERROR: overlay no existe')
      return
    }

    const panelInicio = new GUI.Rectangle('panelInicio')
    panelInicio.width = '1600px'
    panelInicio.height = '820px'
    panelInicio.thickness = 3
    panelInicio.cornerRadius = 20
    panelInicio.color = '#8e4d22'
    panelInicio.background = 'rgba(28, 20, 16, 0.95)'
    panelInicio.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    panelInicio.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    panelInicio.zIndex = 1000
    this.overlay.addControl(panelInicio)

    const tituloAcc = new GUI.TextBlock('tituloAccidentes', 'Accidentes en Mesa')
    tituloAcc.top = '-380px'
    tituloAcc.left = '-200px'
    tituloAcc.height = '50px'
    tituloAcc.color = '#ffe2c8'
    tituloAcc.fontSize = 28
    tituloAcc.fontFamily = 'Comic Sans MS'
    tituloAcc.fontWeight = 'bold'
    panelInicio.addControl(tituloAcc)

    const gridAccidentes = new GUI.Grid('gridAccidentesInicio')
    gridAccidentes.width = '1160px'
    gridAccidentes.height = '680px'
    gridAccidentes.top = '0px'
    gridAccidentes.left = '-220px'
    gridAccidentes.paddingLeft = '8px'
    gridAccidentes.paddingRight = '8px'
    gridAccidentes.paddingTop = '4px'
    gridAccidentes.paddingBottom = '4px'
    for (let i = 0; i < 2; i++) {
      gridAccidentes.addRowDefinition(340)
    }
    for (let i = 0; i < 4; i++) {
      gridAccidentes.addColumnDefinition(0.25)
    }
    panelInicio.addControl(gridAccidentes)

    const accidentesMostrar = this.accidentes && this.accidentes.length > 0
      ? this.accidentes.slice(0, 8)
      : []

    accidentesMostrar.forEach((accidente, indice) => {
      const fila = Math.floor(indice / 4)
      const columna = indice % 4

      const nivelColor = accidente.nivel >= 3 ? '#cc3333' : accidente.nivel === 2 ? '#e67e22' : '#e6a817'

      const imagenSrc = accidente.obtenerImagen ? accidente.obtenerImagen() : null
      if (imagenSrc) {
        const imagen = new GUI.Image(`accidenteImgInicio_${indice}`, imagenSrc)
        imagen.width = '270px'
        imagen.height = '330px'
        imagen.stretch = GUI.Image.STRETCH_UNIFORM
        imagen.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
        imagen.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
        imagen.thickness = 2
        imagen.color = nivelColor
        gridAccidentes.addControl(imagen, fila, columna)
      }
    })

    const perfilReal = this.perfil || {
      nombre: 'Sin asignar',
      horasRequeridas: 0,
      categoriasValidas: [],
      descripcion: 'Perfil no disponible'
    }

    const tituloPerfil = new GUI.TextBlock('tituloPerfil', 'Tu Perfil Asignado')
    tituloPerfil.top = '-380px'
    tituloPerfil.left = '560px'
    tituloPerfil.height = '50px'
    tituloPerfil.color = '#ffe2c8'
    tituloPerfil.fontSize = 28
    tituloPerfil.fontFamily = 'Comic Sans MS'
    tituloPerfil.fontWeight = 'bold'
    panelInicio.addControl(tituloPerfil)

    const nombrePerf = new GUI.TextBlock('nombrePerfil', perfilReal.nombre)
    nombrePerf.top = '-240px'
    nombrePerf.left = '560px'
    nombrePerf.height = '40px'
    nombrePerf.color = '#d66a1f'
    nombrePerf.fontSize = 22
    nombrePerf.fontFamily = 'Comic Sans MS'
    nombrePerf.fontWeight = 'bold'
    panelInicio.addControl(nombrePerf)

    const horasPerf = new GUI.TextBlock('horasPerfil', `Horas requeridas: ${perfilReal.horasRequeridas}`)
    horasPerf.top = '-190px'
    horasPerf.left = '560px'
    horasPerf.height = '30px'
    horasPerf.color = '#cf8a34'
    horasPerf.fontSize = 18
    horasPerf.fontFamily = 'Comic Sans MS'
    panelInicio.addControl(horasPerf)

    const descPerf = new GUI.TextBlock('descPerfil', perfilReal.descripcion)
    descPerf.top = '-90px'
    descPerf.left = '560px'
    descPerf.height = '120px'
    descPerf.width = '400px'
    descPerf.color = '#f4cbaa'
    descPerf.fontSize = 22
    descPerf.fontFamily = 'Comic Sans MS'
    descPerf.textWrapping = true
    panelInicio.addControl(descPerf)

    const catsTexto = perfilReal.categoriasValidas && perfilReal.categoriasValidas.length > 0
      ? `Categorias: ${perfilReal.categoriasValidas.join(', ')}`
      : 'Sin categorias asignadas'
    const catsPerf = new GUI.TextBlock('catsPerfil', catsTexto)
    catsPerf.top = '10px'
    catsPerf.left = '560px'
    catsPerf.height = '30px'
    catsPerf.width = '400px'
    catsPerf.color = '#e7cfbc'
    catsPerf.fontSize = 14
    catsPerf.fontFamily = 'Comic Sans MS'
    catsPerf.textWrapping = true
    panelInicio.addControl(catsPerf)

    const botonCerrar = GUI.Button.CreateSimpleButton('btnCerrarInicio', 'Cerrar')
    botonCerrar.width = '180px'
    botonCerrar.height = '44px'
    botonCerrar.top = '370px'
    botonCerrar.background = '#d66a1f'
    botonCerrar.color = '#fff7ef'
    botonCerrar.cornerRadius = 14
    botonCerrar.fontSize = 16
    botonCerrar.fontFamily = 'Comic Sans MS'
    botonCerrar.fontWeight = 'bold'
    botonCerrar.onPointerUpObservable.add(() => {
      panelInicio.dispose()
    })
    panelInicio.addControl(botonCerrar)

    console.log('[VistaPartida] Panel inicio creado y agregado')

    setTimeout(() => {
      console.log('[VistaPartida] Cerrando panel inicio')
      if (panelInicio && panelInicio.isVisible) {
        panelInicio.dispose()
      }
    }, 13000)
  }

  obtenerImagenCarta(carta) {
    if (typeof carta.obtenerImagen === 'function') {
      return carta.obtenerImagen()
    }
    return null
  }

  mostrarMensajeAccidente(accidente, cartasAfectadas) {
    const panel = this.guiTexture.getControlByName('panelMensajeAccidente')
    if (!panel) return

    const texto = panel.getControlByName('textoAccidente')
    if (texto) {
      texto.text = accidente.obtenerMensaje()
    }

    const nombres = panel.getControlByName('cartasAfectadas')
    if (nombres) {
      nombres.text = cartasAfectadas.length > 0
        ? `Cartas afectadas: ${cartasAfectadas.map(c => c.titulo).join(', ')}`
        : 'No se vieron afectadas cartas de este jugador.'
    }

    panel.isVisible = true
    setTimeout(() => { panel.isVisible = false }, 5000)
  }

  actualizarProgresoPerfil() {
    if (!this.perfil) return

    const progreso = this.perfil.getProgreso()
    const porcentaje = Math.round(progreso * 100)

    const barra = this.guiTexture.getControlByName('barraProgreso')
    if (barra) {
      barra.width = `${porcentaje}%`
      if (progreso >= 1) {
        barra.background = '#4caf50'
      } else if (progreso >= 0.5) {
        barra.background = '#d66a1f'
      } else {
        barra.background = '#a85a2a'
      }
    }

    const texto = this.guiTexture.getControlByName('textoProgreso')
    if (texto) {
      texto.text = `${this.perfil.horasCompletadas}/${this.perfil.horasRequeridas} horas (${porcentaje}%)`
    }
  }

  actualizarEstadoTurno(jugadorActual, totalJugadores) {
    const estado3 = this.guiTexture.getControlByName('estado_3')
    if (estado3) {
      const texto = estado3.children[0]
      if (texto) {
        texto.text = `Turno ${jugadorActual}/${totalJugadores}`
      }
    }
  }

  mostrarModalIntercambio() {
    if (!this.cartas || this.cartas.length === 0) return

    const overlay = new GUI.Rectangle('overlayIntercambio')
    overlay.width = 1
    overlay.height = 1
    overlay.thickness = 0
    overlay.background = 'rgba(0,0,0,0.6)'
    overlay.zIndex = 500
    this.overlay.addControl(overlay)

    const panel = new GUI.Rectangle('panelIntercambio')
    panel.width = '500px'
    panel.height = '350px'
    panel.thickness = 3
    panel.cornerRadius = 20
    panel.color = '#8e4d22'
    panel.background = 'rgba(28, 20, 16, 0.98)'
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    overlay.addControl(panel)

    const titulo = new GUI.TextBlock('tituloIntercambio', 'Intercambiar Cartas')
    titulo.top = '-130px'
    titulo.height = '40px'
    titulo.color = '#ffe2c8'
    titulo.fontSize = 24
    titulo.fontFamily = 'Comic Sans MS'
    titulo.fontWeight = 'bold'
    panel.addControl(titulo)

    const subtitulo = new GUI.TextBlock('subtituloIntercambio', 'Selecciona una carta para intercambiar (mismas horas)')
    subtitulo.top = '-90px'
    subtitulo.height = '24px'
    subtitulo.color = '#a88a6a'
    subtitulo.fontSize = 13
    subtitulo.fontFamily = 'Comic Sans MS'
    panel.addControl(subtitulo)

    const grid = new GUI.Grid('gridIntercambio')
    grid.width = '460px'
    grid.height = '200px'
    grid.top = '-40px'
    for (let i = 0; i < 2; i++) {
      grid.addRowDefinition(90)
    }
    for (let i = 0; i < 3; i++) {
      grid.addColumnDefinition(1 / 3)
    }
    panel.addControl(grid)

    this.cartas.forEach((carta, indice) => {
      if (indice >= 6) return
      const fila = Math.floor(indice / 3)
      const col = indice % 3

      const btnCarta = GUI.Button.CreateSimpleButton(`btnIntercambio_${indice}`, `${carta.titulo} (${carta.horas}h)`)
      btnCarta.width = '140px'
      btnCarta.height = '70px'
      btnCarta.background = carta.estaDeshabilitada() ? '#3a2a1d' : '#5a3321'
      btnCarta.color = carta.estaDeshabilitada() ? '#666' : '#ffe0c2'
      btnCarta.cornerRadius = 10
      btnCarta.fontSize = 13
      btnCarta.fontFamily = 'Comic Sans MS'
      btnCarta.isEnabled = !carta.estaDeshabilitada()
      btnCarta.onPointerUpObservable.add(() => {
        this.seleccionarCartaParaIntercambio(carta, overlay)
      })
      grid.addControl(btnCarta, fila, col)
    })

    const btnCerrar = GUI.Button.CreateSimpleButton('btnCerrarIntercambio', 'Cancelar')
    btnCerrar.width = '120px'
    btnCerrar.height = '36px'
    btnCerrar.top = '130px'
    btnCerrar.background = '#362924'
    btnCerrar.color = '#ffd8bc'
    btnCerrar.cornerRadius = 10
    btnCerrar.fontSize = 14
    btnCerrar.fontFamily = 'Comic Sans MS'
    btnCerrar.onPointerUpObservable.add(() => {
      overlay.dispose()
    })
    panel.addControl(btnCerrar)
  }

  seleccionarCartaParaIntercambio(cartaSeleccionada, overlay) {
    overlay.dispose()

    const horasIguales = this.cartas.filter(c =>
      c.horas === cartaSeleccionada.horas &&
      c !== cartaSeleccionada &&
      !c.estaDeshabilitada() &&
      !cartaSeleccionada.estaDeshabilitada()
    )

    if (horasIguales.length === 0) {
      this.mostrarMensajeFlotante(`No hay cartas con ${cartaSeleccionada.horas}h para intercambiar`)
      return
    }

    const overlay2 = new GUI.Rectangle('overlayIntercambio2')
    overlay2.width = 1
    overlay2.height = 1
    overlay2.thickness = 0
    overlay2.background = 'rgba(0,0,0,0.6)'
    overlay2.zIndex = 500
    this.overlay.addControl(overlay2)

    const panel = new GUI.Rectangle('panelIntercambio2')
    panel.width = '450px'
    panel.height = '300px'
    panel.thickness = 3
    panel.cornerRadius = 20
    panel.color = '#8e4d22'
    panel.background = 'rgba(28, 20, 16, 0.98)'
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    overlay2.addControl(panel)

    const titulo = new GUI.TextBlock('tituloIntercambio2', `Intercambiar ${cartaSeleccionada.titulo}`)
    titulo.top = '-110px'
    titulo.height = '40px'
    titulo.color = '#ffe2c8'
    titulo.fontSize = 22
    titulo.fontFamily = 'Comic Sans MS'
    titulo.fontWeight = 'bold'
    panel.addControl(titulo)

    const subtitulo = new GUI.TextBlock('subtituloIntercambio2', `Selecciona carta de ${cartaSeleccionada.horas}h para intercambiar`)
    subtitulo.top = '-75px'
    subtitulo.height = '24px'
    subtitulo.color = '#a88a6a'
    subtitulo.fontSize = 13
    subtitulo.fontFamily = 'Comic Sans MS'
    panel.addControl(subtitulo)

    const grid = new GUI.Grid('gridIntercambio2')
    grid.width = '400px'
    grid.height = '150px'
    grid.top = '-20px'
    grid.addRowDefinition(70)
    grid.addRowDefinition(70)
    for (let i = 0; i < 3; i++) {
      grid.addColumnDefinition(1 / 3)
    }
    panel.addControl(grid)

    horasIguales.forEach((carta, indice) => {
      if (indice >= 6) return
      const fila = Math.floor(indice / 3)
      const col = indice % 3

      const btnCarta = GUI.Button.CreateSimpleButton(`btnIntercambio2_${indice}`, `${carta.titulo} (${carta.horas}h)`)
      btnCarta.width = '120px'
      btnCarta.height = '55px'
      btnCarta.background = '#5a3321'
      btnCarta.color = '#ffe0c2'
      btnCarta.cornerRadius = 10
      btnCarta.fontSize = 12
      btnCarta.fontFamily = 'Comic Sans MS'
      btnCarta.onPointerUpObservable.add(() => {
        this.ejecutarIntercambio(cartaSeleccionada, carta)
        overlay2.dispose()
      })
      grid.addControl(btnCarta, fila, col)
    })

    const btnCerrar = GUI.Button.CreateSimpleButton('btnCerrarIntercambio2', 'Cancelar')
    btnCerrar.width = '120px'
    btnCerrar.height = '36px'
    btnCerrar.top = '110px'
    btnCerrar.background = '#362924'
    btnCerrar.color = '#ffd8bc'
    btnCerrar.cornerRadius = 10
    btnCerrar.fontSize = 14
    btnCerrar.fontFamily = 'Comic Sans MS'
    btnCerrar.onPointerUpObservable.add(() => {
      overlay2.dispose()
    })
    panel.addControl(btnCerrar)
  }

  ejecutarIntercambio(carta1, carta2) {
    const indice1 = this.cartas.indexOf(carta1)
    const indice2 = this.cartas.indexOf(carta2)

    if (indice1 === -1 || indice2 === -1) return

    this.cartas[indice1] = carta2
    this.cartas[indice2] = carta1

    this.actualizarPanelCartas()
    this.mostrarMensajeFlotante(`Intercambiaste ${carta1.titulo} por ${carta2.titulo}`)

    if (this.callbackIntercambioCarta) {
      this.callbackIntercambioCarta(carta1, carta2)
    }
  }

  mostrarMensajeFlotante(texto) {
    const mensaje = new GUI.TextBlock('mensajeFlotante', texto)
    mensaje.width = '400px'
    mensaje.height = '50px'
    mensaje.bottom = '260px'
    mensaje.color = '#ffe2c8'
    mensaje.fontSize = 16
    mensaje.fontFamily = 'Comic Sans MS'
    mensaje.fontWeight = 'bold'
    mensaje.background = 'rgba(28, 20, 16, 0.9)'
    mensaje.cornerRadius = 12
    mensaje.thickness = 2
    mensaje.color = '#ffe2c8'
    mensaje.borderColor = '#8e4d22'
    this.overlay.addControl(mensaje)

    setTimeout(() => {
      mensaje.dispose()
    }, 3000)
  }

  onJugarCarta(callback) {
    this.callbackJugarCarta = callback
  }

  onFinTurno(callback) {
    this.callbackFinTurno = callback
  }

  onPasarTurno(callback) {
    this.callbackPasarTurno = callback
  }

  onIntercambioCarta(callback) {
    this.callbackIntercambioCarta = callback
  }

  onActivarActividadGrupal(callback) {
    this.callbackActividadGrupal = callback
  }

  configurarActividades(actividades) {
    this.actividades = actividades
  }

  mostrarMensajeActividadGrupal(actividad) {
    this.mostrarMensajeFlotante(`Actividad grupal: ${actividad.nombre} - ${actividad.descripcion}`)
  }

  mostrarLogFinal(logJSON) {
    const panel = new GUI.Rectangle('panelLogFinal')
    panel.width = '700px'
    panel.height = '500px'
    panel.thickness = 3
    panel.cornerRadius = 20
    panel.color = '#8e4d22'
    panel.background = 'rgba(28, 20, 16, 0.98)'
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    panel.zIndex = 2000
    this.overlay.addControl(panel)

    const titulo = new GUI.TextBlock('tituloLogFinal', 'Log de la Partida')
    titulo.top = '-200px'
    titulo.height = '50px'
    titulo.color = '#ffe2c8'
    titulo.fontSize = 26
    titulo.fontFamily = 'Comic Sans MS'
    titulo.fontWeight = 'bold'
    panel.addControl(titulo)

    const scrollViewer = new GUI.ScrollViewer('scrollLog')
    scrollViewer.width = '640px'
    scrollViewer.height = '340px'
    scrollViewer.top = '-130px'
    scrollViewer.thickness = 2
    scrollViewer.color = '#8e4d22'
    scrollViewer.background = 'rgba(18, 14, 13, 0.9)'
    scrollViewer.cornerRadius = 10
    panel.addControl(scrollViewer)

    const textoLog = new GUI.TextBlock('textoLogFinal', logJSON)
    textoLog.width = '620px'
    textoLog.height = '800px'
    textoLog.color = '#e7cfbc'
    textoLog.fontSize = 11
    textoLog.fontFamily = 'monospace'
    textoLog.textWrapping = true
    textoLog.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    textoLog.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP
    scrollViewer.addControl(textoLog)

    const btnCerrar = GUI.Button.CreateSimpleButton('btnCerrarLog', 'Cerrar')
    btnCerrar.width = '150px'
    btnCerrar.height = '44px'
    btnCerrar.top = '200px'
    btnCerrar.background = '#d66a1f'
    btnCerrar.color = '#fff7ef'
    btnCerrar.cornerRadius = 14
    btnCerrar.fontSize = 16
    btnCerrar.fontFamily = 'Comic Sans MS'
    btnCerrar.fontWeight = 'bold'
    btnCerrar.onPointerUpObservable.add(() => {
      panel.dispose()
    })
    panel.addControl(btnCerrar)
  }
}
