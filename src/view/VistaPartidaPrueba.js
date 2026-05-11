import * as BABYLON from '@babylonjs/core'
import * as GUI from '@babylonjs/gui'
import { GestorAjusteRatio } from './base/GestorAjusteRatio.js'

export class VistaPartidaPrueba {
  constructor(canvas, engine, sceneInicial) {
    this.canvas = canvas
    this.engine = engine
    this.sceneInicial = sceneInicial
    this.scene = null
    this.guiTexture = null
    this.overlay = null
    this.visible = false
    this.sceneAnterior = null
    this.centroTablero = new BABYLON.Vector3(-3.7, 0.2, 0)
    this.carruselAccidentes = null

    this.callbackVolver = null
    this.callbackJugarCarta = null
    this.callbackFinTurno = null
    this.callbackActivarAccidente = null
    this.callbackReiniciar = null
    this.callbackPasarTurno = null

    this.accidentes = []
    this.perfil = null
    this.cartas = []
    this.turnoActual = 1
    this.totalJugadores = 4

    this.dragState = {
      activo: false,
      carta: null,
      indice: null,
      panelOrigen: null,
      offsetX: 0,
      offsetY: 0
    }
  }

  crear() {
    this.scene = new BABYLON.Scene(this.engine)
    this.scene.clearColor = new BABYLON.Color4(0.09, 0.07, 0.06, 1)

    this.crearEscena3D()
    this.crearHUD()
  }

  crearEscena3D() {
    const camera = new BABYLON.ArcRotateCamera(
      'cameraPrueba',
      0,
      1.08,
      18,
      this.centroTablero,
      this.scene
    )
    this.cameraPrueba = camera
    camera.inputs.clear()
    camera.lowerRadiusLimit = 17
    camera.upperRadiusLimit = 19
    camera.fov = 0.6
    this.scene.ambientColor = new BABYLON.Color3(0.18, 0.12, 0.08)

    const hemisferica = new BABYLON.HemisphericLight(
      'lightPrueba1',
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    )
    hemisferica.intensity = 0.72
    hemisferica.diffuse = new BABYLON.Color3(0.95, 0.85, 0.74)
    hemisferica.groundColor = new BABYLON.Color3(0.22, 0.12, 0.07)

    const direccionCamara = this.centroTablero.subtract(camera.position).normalize()
    const luzPrincipal = new BABYLON.SpotLight(
      'lightPrueba2',
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
      'lightPrueba3',
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
      'lightPrueba4',
      this.centroTablero.add(new BABYLON.Vector3(0, 5.4, 0)),
      this.scene
    )
    luzAmbiente.diffuse = new BABYLON.Color3(0.64, 0.48, 0.34)
    luzAmbiente.intensity = 2.4

    const luzRelleno = new BABYLON.PointLight(
      'lightPrueba5',
      this.centroTablero.add(new BABYLON.Vector3(-5.5, 4.2, 4.8)),
      this.scene
    )
    luzRelleno.diffuse = new BABYLON.Color3(0.34, 0.29, 0.24)
    luzRelleno.intensity = 1.6

    this.crearTablero3D()
  }

  crearTablero3D() {
    const baseMesa = BABYLON.MeshBuilder.CreateGround(
      'baseMesaPrueba',
      { width: 18, height: 18, subdivisions: 2 },
      this.scene
    )
    baseMesa.position.x = this.centroTablero.x
    baseMesa.position.y = -0.05

    const materialMesa = new BABYLON.StandardMaterial('matMesaPrueba', this.scene)
    materialMesa.diffuseColor = new BABYLON.Color3(0.3, 0.19, 0.11)
    materialMesa.specularColor = new BABYLON.Color3(0.12, 0.08, 0.04)
    materialMesa.emissiveColor = new BABYLON.Color3(0.015, 0.008, 0.004)
    baseMesa.material = materialMesa

    const resplandorMesa = BABYLON.MeshBuilder.CreateDisc(
      'resplandorMesaPrueba',
      { radius: 8.8, tessellation: 64 },
      this.scene
    )
    resplandorMesa.rotation.x = Math.PI / 2
    resplandorMesa.position = this.centroTablero.add(new BABYLON.Vector3(0, -0.035, 0))

    const materialResplandor = new BABYLON.StandardMaterial('matResplandorPrueba', this.scene)
    materialResplandor.diffuseColor = new BABYLON.Color3(0.12, 0.07, 0.03)
    materialResplandor.emissiveColor = new BABYLON.Color3(0.03, 0.015, 0.006)
    materialResplandor.alpha = 0.38
    resplandorMesa.material = materialResplandor

    const tablero = BABYLON.MeshBuilder.CreateBox(
      'tableroCentralPrueba',
      { width: 12.4, depth: 12.4, height: 0.34 },
      this.scene
    )
    tablero.position.x = this.centroTablero.x
    tablero.position.y = 0.12

    const materialTablero = new BABYLON.StandardMaterial('matTableroPrueba', this.scene)
    materialTablero.diffuseColor = new BABYLON.Color3(0.56, 0.36, 0.2)
    materialTablero.specularColor = new BABYLON.Color3(0.22, 0.14, 0.07)
    materialTablero.emissiveColor = new BABYLON.Color3(0.03, 0.015, 0.008)
    tablero.material = materialTablero

    const tapete = BABYLON.MeshBuilder.CreateGround(
      'tapeteJuegoPrueba',
      { width: 11.3, height: 11.3, subdivisions: 2 },
      this.scene
    )
    tapete.position.x = this.centroTablero.x
    tapete.position.y = 0.3

    const materialTapete = new BABYLON.StandardMaterial('matTapetePrueba', this.scene)
    materialTapete.diffuseColor = new BABYLON.Color3(0.21, 0.31, 0.28)
    materialTapete.specularColor = new BABYLON.Color3(0.05, 0.06, 0.05)
    materialTapete.emissiveColor = new BABYLON.Color3(0.012, 0.02, 0.017)
    tapete.material = materialTapete

    const marcoInterior = BABYLON.MeshBuilder.CreateBox(
      'marcoInteriorPrueba',
      { width: 11.65, depth: 11.65, height: 0.08 },
      this.scene
    )
    marcoInterior.position = this.centroTablero.add(new BABYLON.Vector3(0, 0.34, 0))

    const materialMarcoInterior = new BABYLON.StandardMaterial('matMarcoInteriorPrueba', this.scene)
    materialMarcoInterior.diffuseColor = new BABYLON.Color3(0.34, 0.24, 0.15)
    materialMarcoInterior.specularColor = new BABYLON.Color3(0.14, 0.1, 0.06)
    materialMarcoInterior.emissiveColor = new BABYLON.Color3(0.02, 0.01, 0.005)
    marcoInterior.material = materialMarcoInterior

    this.crearLineaDecorativa({
      nombre: 'lineaVerticalCentroPrueba',
      width: 0.08,
      height: 9.2,
      posicion: this.centroTablero.add(new BABYLON.Vector3(0, 0.35, 0)),
      color: new BABYLON.Color3(0.63, 0.46, 0.24)
    })

    this.crearLineaDecorativa({
      nombre: 'lineaHorizontalCentroPrueba',
      width: 9.2,
      height: 0.08,
      posicion: this.centroTablero.add(new BABYLON.Vector3(0, 0.35, 0)),
      color: new BABYLON.Color3(0.63, 0.46, 0.24)
    })

    this.crearZonaTablero({
      nombre: 'zonaAccidentePrueba',
      width: 2.4,
      height: 2.4,
      position: this.centroTablero.add(new BABYLON.Vector3(0, 0.12, 0)),
      color: new BABYLON.Color3(0.4, 0.18, 0.12)
    })

    this.crearCarruselAccidente()
  }

  crearZonaTablero({ nombre, width, height, position, color }) {
    const zona = BABYLON.MeshBuilder.CreateGround(
      nombre,
      { width, height, subdivisions: 1 },
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
      { width, height, subdivisions: 1 },
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
      'carruselAccidentesPrueba',
      this.scene
    )
    this.carruselAccidentes.position = this.centroTablero.clone()

    const plataformaCarrusel = BABYLON.MeshBuilder.CreateCylinder(
      'plataformaCarruselPrueba',
      { diameter: 2.3, height: 0.12, tessellation: 48 },
      this.scene
    )
    plataformaCarrusel.parent = this.carruselAccidentes
    plataformaCarrusel.position = new BABYLON.Vector3(0, 0.34, 0)

    const materialPlataforma = new BABYLON.StandardMaterial(
      'matPlataformaCarruselPrueba',
      this.scene
    )
    materialPlataforma.diffuseColor = new BABYLON.Color3(0.31, 0.18, 0.12)
    materialPlataforma.specularColor = new BABYLON.Color3(0.1, 0.06, 0.04)
    materialPlataforma.emissiveColor = new BABYLON.Color3(0.014, 0.006, 0.003)
    plataformaCarrusel.material = materialPlataforma

    const selloCarrusel = BABYLON.MeshBuilder.CreateDisc(
      'selloCarruselPrueba',
      { radius: 0.92, tessellation: 48 },
      this.scene
    )
    selloCarrusel.rotation.x = Math.PI / 2
    selloCarrusel.parent = this.carruselAccidentes
    selloCarrusel.position = new BABYLON.Vector3(0, 0.405, 0)

    const materialSelloCarrusel = new BABYLON.StandardMaterial(
      'matSelloCarruselPrueba',
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
        `contenedorCarruselPrueba_${i}`,
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
      `baseCartaCarruselPrueba_${indice}`,
      { width: 1.04, height: 1.38, depth: 0.08 },
      this.scene
    )
    baseCarta.parent = contenedor
    baseCarta.position.y = 0.75

    const materialBaseCarta = new BABYLON.StandardMaterial(
      `matBaseCartaCarruselPrueba_${indice}`,
      this.scene
    )
    materialBaseCarta.diffuseColor = new BABYLON.Color3(0.2, 0.13, 0.09)
    materialBaseCarta.specularColor = new BABYLON.Color3(0.06, 0.04, 0.03)
    materialBaseCarta.emissiveColor = new BABYLON.Color3(0.008, 0.004, 0.002)
    baseCarta.material = materialBaseCarta

    const caraCarta = BABYLON.MeshBuilder.CreatePlane(
      `caraCartaCarruselPrueba_${indice}`,
      { width: 0.94, height: 1.32 },
      this.scene
    )
    caraCarta.parent = contenedor
    caraCarta.rotation.y = Math.PI
    caraCarta.position = new BABYLON.Vector3(0, 0.75, -0.043)

    const materialCaraCarta = new BABYLON.StandardMaterial(
      `matCaraCartaCarruselPrueba_${indice}`,
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
  }

  orientarCartaCarruselHaciaAfuera(contenedor) {
    const angulo = Math.atan2(contenedor.position.z, contenedor.position.x)
    contenedor.rotation.y = Math.PI / 2 - angulo
  }

  configurarAnimacionCarrusel() {
    if (!this.carruselAccidentes) return
    const velocidadRotacion = 0.00045
    this.scene.onBeforeRenderObservable.add(() => {
      if (!this.visible || !this.carruselAccidentes) return
      const delta = this.engine.getDeltaTime()
      this.carruselAccidentes.rotation.y -= delta * velocidadRotacion
    })
  }

  crearHUD() {
    this.guiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
      'guiPrueba',
      true,
      this.scene
    )
    GestorAjusteRatio.configurarGUI(this.guiTexture)

    this.overlay = new GUI.Rectangle('overlayPrueba')
    this.overlay.width = 1
    this.overlay.height = 1
    this.overlay.thickness = 0
    this.overlay.background = 'transparent'
    this.guiTexture.addControl(this.overlay)

    this.crearEncabezadoPrueba()
    this.crearBotonVolver()
    this.crearPanelCartas()
    this.crearBotonesAccion()
    this.configurarDragDrop()
  }

  crearEncabezadoPrueba() {
    const panelEncabezado = new GUI.Rectangle('panelEncabezadoPrueba')
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

    const titulo = new GUI.TextBlock('tituloPrueba', 'Modo Prueba - Gamemaster')
    titulo.top = '-28px'
    titulo.height = '34px'
    titulo.color = '#ffe2c8'
    titulo.fontSize = 28
    titulo.fontFamily = 'Comic Sans MS'
    titulo.fontWeight = 'bold'
    panelEncabezado.addControl(titulo)

    const subtitulo = new GUI.TextBlock('subtituloPrueba', 'Perfil: Sin asignar')
    subtitulo.top = '2px'
    subtitulo.height = '28px'
    subtitulo.color = '#f4cbaa'
    subtitulo.fontSize = 16
    subtitulo.fontFamily = 'Comic Sans MS'
    panelEncabezado.addControl(subtitulo)

    const panelEstado = new GUI.Grid('gridEstadoPrueba')
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
      'Turno: 1'
    ]

    estados.forEach((texto, indice) => {
      const bloque = new GUI.Rectangle(`estadoPrueba_${indice}`)
      bloque.height = '32px'
      bloque.thickness = 0
      bloque.cornerRadius = 12
      bloque.background = indice === 1 ? '#5a2e1d' : indice === 3 ? '#3a2a1d' : '#2d221d'

      const textoEstado = new GUI.TextBlock(`estadoPruebaTexto_${indice}`, texto)
      textoEstado.color = '#ffe8d3'
      textoEstado.fontSize = 14
      textoEstado.fontFamily = 'Comic Sans MS'
      bloque.addControl(textoEstado)

      panelEstado.addControl(bloque, 0, indice)
    })

    const barraProgreso = new GUI.Rectangle('barraProgresoPrueba')
    barraProgreso.width = '0%'
    barraProgreso.height = '18px'
    barraProgreso.top = '76px'
    barraProgreso.thickness = 1
    barraProgreso.cornerRadius = 9
    barraProgreso.color = '#5a3a28'
    barraProgreso.background = '#1a1210'
    panelEncabezado.addControl(barraProgreso)

    const barra = new GUI.Rectangle('barraProgresoInterna')
    barra.width = '0%'
    barra.height = '100%'
    barra.thickness = 0
    barra.cornerRadius = 9
    barra.background = '#d66a1f'
    barra.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    barraProgreso.addControl(barra)

    const textoProgreso = new GUI.TextBlock('textoProgresoPrueba', '0/0 horas')
    textoProgreso.width = '100%'
    textoProgreso.height = '100%'
    textoProgreso.color = '#ffe2c8'
    textoProgreso.fontSize = 11
    textoProgreso.fontFamily = 'Comic Sans MS'
    textoProgreso.fontWeight = 'bold'
    barraProgreso.addControl(textoProgreso)
  }

  crearBotonVolver() {
    const botonVolver = GUI.Button.CreateSimpleButton('btnVolverPrueba', 'Volver')
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
    const panelInferior = new GUI.Rectangle('panelCartasPrueba')
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

    const textoZona = new GUI.TextBlock('textoZonaDropPrueba', 'Arrastra una carta aquí para jugarla')
    textoZona.top = '-15px'
    textoZona.height = '20px'
    textoZona.color = '#a85a2a'
    textoZona.fontSize = 12
    textoZona.fontFamily = 'Comic Sans MS'
    textoZona.fontStyle = 'italic'
    panelInferior.addControl(textoZona)

    const containerCartas = new GUI.Rectangle('containerCartasPrueba')
    containerCartas.width = '97%'
    containerCartas.height = '170px'
    containerCartas.top = '18px'
    containerCartas.background = 'transparent'
    containerCartas.thickness = 0
    panelInferior.addControl(containerCartas)

    const gridMano = new GUI.Grid('gridManoCartasPrueba')
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

    const textoVacio = new GUI.TextBlock('textoVacioCartasPrueba', 'Sin cartas en mano')
    textoVacio.color = '#f4cbaa'
    textoVacio.fontSize = 16
    textoVacio.fontFamily = 'Comic Sans MS'
    gridMano.addControl(textoVacio, 0, 0)
  }

  crearBotonesAccion() {
    const panelBotones = new GUI.StackPanel('panelBotonesPrueba')
    panelBotones.width = '120px'
    panelBotones.height = '400px'
    panelBotones.right = '20px'
    panelBotones.isVertical = true
    panelBotones.spacing = 15
    panelBotones.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    panelBotones.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
    this.overlay.addControl(panelBotones)

    const btnFinTurno = GUI.Button.CreateSimpleButton('btnFinTurnoPrueba', 'Fin Turno')
    btnFinTurno.width = '100px'
    btnFinTurno.height = '80px'
    btnFinTurno.cornerRadius = 40
    btnFinTurno.background = '#d66a1f'
    btnFinTurno.color = '#fff7ef'
    btnFinTurno.fontSize = 14
    btnFinTurno.fontWeight = 'bold'
    btnFinTurno.fontFamily = 'Comic Sans MS'
    btnFinTurno.thickness = 2
    btnFinTurno.borderColor = '#a85a2a'
    btnFinTurno.onPointerUpObservable.add(() => {
      this.callbackFinTurno && this.callbackFinTurno()
    })
    panelBotones.addControl(btnFinTurno)

    const btnAccidente = GUI.Button.CreateSimpleButton('btnAccidentePrueba', 'Accidente')
    btnAccidente.width = '100px'
    btnAccidente.height = '80px'
    btnAccidente.cornerRadius = 40
    btnAccidente.background = '#a84f16'
    btnAccidente.color = '#fff1e3'
    btnAccidente.fontSize = 14
    btnAccidente.fontWeight = 'bold'
    btnAccidente.fontFamily = 'Comic Sans MS'
    btnAccidente.thickness = 2
    btnAccidente.borderColor = '#8e4d22'
    btnAccidente.onPointerUpObservable.add(() => {
      this.callbackActivarAccidente && this.callbackActivarAccidente()
    })
    panelBotones.addControl(btnAccidente)

    const btnPasar = GUI.Button.CreateSimpleButton('btnPasarPrueba', 'Pasar')
    btnPasar.width = '100px'
    btnPasar.height = '80px'
    btnPasar.cornerRadius = 40
    btnPasar.background = '#3c2d27'
    btnPasar.color = '#ffd6b7'
    btnPasar.fontSize = 14
    btnPasar.fontWeight = 'bold'
    btnPasar.fontFamily = 'Comic Sans MS'
    btnPasar.thickness = 2
    btnPasar.borderColor = '#8e4d22'
    btnPasar.onPointerUpObservable.add(() => {
      this.callbackPasarTurno && this.callbackPasarTurno()
    })
    panelBotones.addControl(btnPasar)

    const btnReiniciar = GUI.Button.CreateSimpleButton('btnReiniciarPrueba', 'Reiniciar')
    btnReiniciar.width = '100px'
    btnReiniciar.height = '80px'
    btnReiniciar.cornerRadius = 40
    btnReiniciar.background = '#5a3321'
    btnReiniciar.color = '#ffd8bc'
    btnReiniciar.fontSize = 14
    btnReiniciar.fontWeight = 'bold'
    btnReiniciar.fontFamily = 'Comic Sans MS'
    btnReiniciar.thickness = 2
    btnReiniciar.borderColor = '#8e4d22'
    btnReiniciar.onPointerUpObservable.add(() => {
      this.callbackReiniciar && this.callbackReiniciar()
    })
    panelBotones.addControl(btnReiniciar)
  }

  crearCartaManoGUI(carta, indice) {
    const cartaPanel = new GUI.Rectangle(`cartaPrueba_${indice}`)
    cartaPanel.width = '98%'
    cartaPanel.height = '90%'
    cartaPanel.background = '#211713'
    cartaPanel.cornerRadius = 14
    cartaPanel.thickness = 2
    cartaPanel.color = carta.estaDeshabilitada() ? '#666666' : '#d3a06a'
    cartaPanel.shadowColor = '#00000055'
    cartaPanel.shadowBlur = 8
    cartaPanel.shadowOffsetY = 3
    cartaPanel.isPointerBlocker = !carta.estaDeshabilitada()

    const bandaSuperior = new GUI.Rectangle(`cartaBandaPrueba_${indice}`)
    bandaSuperior.width = '18px'
    bandaSuperior.height = '100%'
    bandaSuperior.thickness = 0
    bandaSuperior.background = carta.color
    bandaSuperior.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    cartaPanel.addControl(bandaSuperior)

    const placaCodigo = new GUI.Ellipse(`placaCodigoPrueba_${indice}`)
    placaCodigo.width = '34px'
    placaCodigo.height = '34px'
    placaCodigo.left = '-46px'
    placaCodigo.top = '0px'
    placaCodigo.thickness = 2
    placaCodigo.color = '#f6d9b8'
    placaCodigo.background = '#5a3321'
    cartaPanel.addControl(placaCodigo)

    const codigo = new GUI.TextBlock(`codigoPrueba_${indice}`, carta.codigo)
    codigo.color = '#fff0df'
    codigo.fontSize = 16
    codigo.fontFamily = 'Comic Sans MS'
    codigo.fontWeight = 'bold'
    placaCodigo.addControl(codigo)

    const categoria = new GUI.TextBlock(`categoriaPrueba_${indice}`, carta.categorias.map(c => c.toUpperCase()).join(', '))
    categoria.top = '-22px'
    categoria.left = '68px'
    categoria.width = '96px'
    categoria.height = '18px'
    categoria.color = '#fff4ea'
    categoria.fontSize = 9
    categoria.fontFamily = 'Comic Sans MS'
    categoria.fontWeight = 'bold'
    categoria.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    cartaPanel.addControl(categoria)

    const imagenSrc = carta.obtenerImagen ? carta.obtenerImagen() : null
    if (imagenSrc) {
      const ilustracion = new GUI.Image(`ilustracionPrueba_${indice}`, imagenSrc)
      ilustracion.width = '60px'
      ilustracion.height = '84px'
      ilustracion.left = '2px'
      ilustracion.top = '10px'
      ilustracion.stretch = GUI.Image.STRETCH_UNIFORM
      cartaPanel.addControl(ilustracion)
    }

    const nombre = new GUI.TextBlock(`nombrePrueba_${indice}`, carta.titulo)
    nombre.top = '2px'
    nombre.left = '68px'
    nombre.width = '96px'
    nombre.height = '24px'
    nombre.color = '#ffe0c2'
    nombre.fontSize = 13
    nombre.fontFamily = 'Comic Sans MS'
    nombre.fontWeight = 'bold'
    nombre.textWrapping = true
    nombre.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    cartaPanel.addControl(nombre)

    const descripcion = new GUI.TextBlock(`detallePrueba_${indice}`, carta.detalle)
    descripcion.top = '24px'
    descripcion.left = '68px'
    descripcion.width = '96px'
    descripcion.height = '30px'
    descripcion.color = '#e7cfbc'
    descripcion.fontSize = 8.5
    descripcion.fontFamily = 'Comic Sans MS'
    descripcion.textWrapping = true
    descripcion.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    cartaPanel.addControl(descripcion)

    const pieCarta = new GUI.Rectangle(`pieCartaPrueba_${indice}`)
    pieCarta.width = '104px'
    pieCarta.height = '8px'
    pieCarta.top = '30px'
    pieCarta.left = '64px'
    pieCarta.thickness = 0
    pieCarta.cornerRadius = 4
    pieCarta.background = carta.color
    cartaPanel.addControl(pieCarta)

    cartaPanel.carta = carta
    cartaPanel.indice = indice

    cartaPanel.onPointerDownObservable.add(() => {
      if (carta.estaDeshabilitada()) return
      cartaPanel.zIndex = 500
    })

    cartaPanel.onPointerUpObservable.add(() => {
      if (carta.estaDeshabilitada()) return
      cartaPanel.zIndex = 100
      if (this.callbackJugarCarta) {
        this.callbackJugarCarta(carta)
      }
    })

    return cartaPanel
  }

  configurarDragDrop() {
    // El drag-drop se maneja a nivel de cada carta en crearCartaManoGUI
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

    for (let i = 0; i < grid.rowCount; i++) {
      for (let j = 0; j < grid.columnCount; j++) {
        const control = grid.getControlAt(i, j)
        if (control) grid.removeControl(control)
      }
    }

    if (!this.accidentes || this.accidentes.length === 0) return

    this.accidentes.forEach((accidente, indice) => {
      if (indice >= 8) return
      const fila = Math.floor(indice / 2)
      const columna = indice % 2

      const tarjeta = new GUI.Rectangle(`accidentePrueba_${indice}`)
      tarjeta.width = '240px'
      tarjeta.height = '70px'
      tarjeta.thickness = 2
      tarjeta.cornerRadius = 10
      tarjeta.color = '#a85a2a'

      const nivel = accidente.nivel || 1
      const coloresNivel = ['#4a2e1a', '#5a3520', '#6b4025', '#7d4a2a']
      tarjeta.background = coloresNivel[(nivel - 1) % coloresNivel.length]

      const texto = new GUI.TextBlock(`accidentePruebaTexto_${indice}`, `${accidente.codigo}: ${accidente.nombre}`)
      texto.color = '#ffe0c2'
      texto.fontSize = 14
      texto.fontFamily = 'Comic Sans MS'
      texto.fontWeight = 'bold'
      texto.textWrapping = true
      tarjeta.addControl(texto)

      grid.addControl(tarjeta, fila, columna)
    })

    panel.isVisible = true
  }

  mostrarPanelPerfilInicio() {
    if (!this.panelPerfilInicio || !this.perfil) return
    const { panel, grid, titulo } = this.panelPerfilInicio

    titulo.text = `Perfil: ${this.perfil.nombre}`

    for (let i = 0; i < grid.rowCount; i++) {
      for (let j = 0; j < grid.columnCount; j++) {
        const control = grid.getControlAt(i, j)
        if (control) grid.removeControl(control)
      }
    }

    const nombrePerfil = new GUI.Rectangle('perfilPrueba_0')
    nombrePerfil.width = '240px'
    nombrePerfil.height = '70px'
    nombrePerfil.thickness = 2
    nombrePerfil.cornerRadius = 10
    nombrePerfil.color = '#d66a1f'
    nombrePerfil.background = '#3d2a1d'
    const textoNombre = new GUI.TextBlock('perfilPruebaNombre', this.perfil.nombre)
    textoNombre.color = '#ffe2c8'
    textoNombre.fontSize = 16
    textoNombre.fontFamily = 'Comic Sans MS'
    textoNombre.fontWeight = 'bold'
    nombrePerfil.addControl(textoNombre)
    grid.addControl(nombrePerfil, 0, 0)

    const horasReq = new GUI.Rectangle('perfilPrueba_1')
    horasReq.width = '240px'
    horasReq.height = '70px'
    horasReq.thickness = 2
    horasReq.cornerRadius = 10
    horasReq.color = '#cf8a34'
    horasReq.background = '#3d2a1d'
    const textoHoras = new GUI.TextBlock('perfilPruebaHoras', `Horas requeridas: ${this.perfil.horasRequeridas}`)
    textoHoras.color = '#ffe0c2'
    textoHoras.fontSize = 14
    textoHoras.fontFamily = 'Comic Sans MS'
    horasReq.addControl(textoHoras)
    grid.addControl(horasReq, 1, 0)

    const descripcion = new GUI.Rectangle('perfilPrueba_2')
    descripcion.width = '490px'
    descripcion.height = '70px'
    descripcion.thickness = 2
    descripcion.cornerRadius = 10
    descripcion.color = '#845a3a'
    descripcion.background = '#2d221d'
    descripcion.columnSpan = 2
    const textoDesc = new GUI.TextBlock('perfilPruebaDesc', this.perfil.descripcion)
    textoDesc.color = '#f4cbaa'
    textoDesc.fontSize = 13
    textoDesc.fontFamily = 'Comic Sans MS'
    textoDesc.textWrapping = true
    descripcion.addControl(textoDesc)
    grid.addControl(descripcion, 2, 0)

    const categorias = this.perfil.categoriasValidas.join(', ')
    const catsPanel = new GUI.Rectangle('perfilPrueba_3')
    catsPanel.width = '490px'
    catsPanel.height = '70px'
    catsPanel.thickness = 2
    catsPanel.cornerRadius = 10
    catsPanel.color = '#6b4c3a'
    catsPanel.background = '#2d221d'
    catsPanel.columnSpan = 2
    const textoCats = new GUI.TextBlock('perfilPruebaCats', `Categorias validas: ${categorias}`)
    textoCats.color = '#e7cfbc'
    textoCats.fontSize = 12
    textoCats.fontFamily = 'Comic Sans MS'
    textoCats.textWrapping = true
    catsPanel.addControl(textoCats)
    grid.addControl(catsPanel, 3, 0)

    panel.isVisible = true
  }

  mostrarSecuenciaInicio() {
    if (!this.overlay) return

    const accidentesTexto = this.accidentes
      ? this.accidentes.map(a => `${a.codigo}: ${a.nombre} (Nivel ${a.nivel})`).join('\n')
      : 'Sin accidentes'

    const panelAccidentes = new GUI.Rectangle('panelAccidentesInicioPrueba')
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

    const tituloAcc = new GUI.TextBlock('tituloAccidentesPrueba', 'Accidentes en Mesa')
    tituloAcc.top = '-200px'
    tituloAcc.height = '50px'
    tituloAcc.color = '#ffe2c8'
    tituloAcc.fontSize = 26
    tituloAcc.fontFamily = 'Comic Sans MS'
    tituloAcc.fontWeight = 'bold'
    panelAccidentes.addControl(tituloAcc)

    const textoAcc = new GUI.TextBlock('textoAccidentesPrueba', accidentesTexto)
    textoAcc.color = '#ffe0c2'
    textoAcc.fontSize = 18
    textoAcc.fontFamily = 'Comic Sans MS'
    textoAcc.textWrapping = true
    panelAccidentes.addControl(textoAcc)

    const btnOmitirAcc = GUI.Button.CreateSimpleButton('btnOmitirAccidentesPrueba', 'Omitir')
    btnOmitirAcc.width = '120px'
    btnOmitirAcc.height = '40px'
    btnOmitirAcc.top = '180px'
    btnOmitirAcc.background = '#5a3321'
    btnOmitirAcc.color = '#ffd8bc'
    btnOmitirAcc.cornerRadius = 12
    btnOmitirAcc.fontSize = 14
    btnOmitirAcc.fontFamily = 'Comic Sans MS'
    btnOmitirAcc.onPointerUpObservable.add(() => {
      panelAccidentes.dispose()
      this.mostrarPanelPerfilDirecto()
    })
    panelAccidentes.addControl(btnOmitirAcc)

    setTimeout(() => {
      if (panelAccidentes && panelAccidentes.isVisible) {
        panelAccidentes.dispose()
        this.mostrarPanelPerfilDirecto()
      }
    }, 5000)
  }

  mostrarPanelPerfilDirecto() {
    if (!this.overlay || !this.perfil) return

    const panelPerfil = new GUI.Rectangle('panelPerfilInicioPrueba')
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

    const tituloPerf = new GUI.TextBlock('tituloPerfilPrueba', 'Tu Perfil Asignado')
    tituloPerf.top = '-150px'
    tituloPerf.height = '50px'
    tituloPerf.color = '#ffe2c8'
    tituloPerf.fontSize = 26
    tituloPerf.fontFamily = 'Comic Sans MS'
    tituloPerf.fontWeight = 'bold'
    panelPerfil.addControl(tituloPerf)

    const nombrePerf = new GUI.TextBlock('nombrePerfilPrueba', this.perfil.nombre)
    nombrePerf.top = '-60px'
    nombrePerf.height = '40px'
    nombrePerf.color = '#d66a1f'
    nombrePerf.fontSize = 22
    nombrePerf.fontFamily = 'Comic Sans MS'
    nombrePerf.fontWeight = 'bold'
    panelPerfil.addControl(nombrePerf)

    const horasPerf = new GUI.TextBlock('horasPerfilPrueba', `Horas requeridas: ${this.perfil.horasRequeridas}`)
    horasPerf.top = '-10px'
    horasPerf.height = '30px'
    horasPerf.color = '#cf8a34'
    horasPerf.fontSize = 18
    horasPerf.fontFamily = 'Comic Sans MS'
    panelPerfil.addControl(horasPerf)

    const descPerf = new GUI.TextBlock('descPerfilPrueba', this.perfil.descripcion)
    descPerf.top = '40px'
    descPerf.height = '40px'
    descPerf.color = '#f4cbaa'
    descPerf.fontSize = 16
    descPerf.fontFamily = 'Comic Sans MS'
    descPerf.textWrapping = true
    panelPerfil.addControl(descPerf)

    const catsPerf = new GUI.TextBlock('catsPerfilPrueba', `Categorias: ${this.perfil.categoriasValidas.join(', ')}`)
    catsPerf.top = '100px'
    catsPerf.height = '30px'
    catsPerf.color = '#e7cfbc'
    catsPerf.fontSize = 14
    catsPerf.fontFamily = 'Comic Sans MS'
    panelPerfil.addControl(catsPerf)

    const btnOmitirPerf = GUI.Button.CreateSimpleButton('btnOmitirPerfilPrueba', 'Omitir')
    btnOmitirPerf.width = '120px'
    btnOmitirPerf.height = '40px'
    btnOmitirPerf.top = '150px'
    btnOmitirPerf.background = '#5a3321'
    btnOmitirPerf.color = '#ffd8bc'
    btnOmitirPerf.cornerRadius = 12
    btnOmitirPerf.fontSize = 14
    btnOmitirPerf.fontFamily = 'Comic Sans MS'
    btnOmitirPerf.onPointerUpObservable.add(() => {
      panelPerfil.dispose()
    })
    panelPerfil.addControl(btnOmitirPerf)

    setTimeout(() => {
      if (panelPerfil && panelPerfil.isVisible) {
        panelPerfil.dispose()
      }
    }, 5000)
  }

  actualizarPerfil(perfil) {
    this.perfil = perfil
    if (!perfil) return

    const titulo = this.guiTexture.getControlByName('tituloPrueba')
    if (titulo) titulo.text = `Modo Prueba - ${perfil.nombre}`

    const subtitulo = this.guiTexture.getControlByName('subtituloPrueba')
    if (subtitulo) subtitulo.text = `Perfil: ${perfil.nombre}`

    const estado0 = this.guiTexture.getControlByName('estadoPruebaTexto_0')
    if (estado0) estado0.text = `Perfil: ${perfil.nombre}`

    const estado2 = this.guiTexture.getControlByName('estadoPruebaTexto_2')
    if (estado2) estado2.text = `Objetivo: ${perfil.horasRequeridas} horas`

    this.actualizarProgresoPerfil()
  }

  actualizarAccidentes(accidentes) {
    this.accidentes = accidentes
    if (!accidentes || accidentes.length === 0) return

    const estado1 = this.guiTexture.getControlByName('estadoPruebaTexto_1')
    if (estado1) estado1.text = `Accidentes: ${accidentes.length} en mesa`

    this.actualizarCarruselAccidentes()
  }

  actualizarCarruselAccidentes() {
    if (!this.accidentes || this.accidentes.length === 0) return

    const cantidad = Math.min(this.accidentes.length, 8)
    for (let i = 0; i < 8; i++) {
      const caraCarta = this.scene.getMeshByName(`caraCartaCarruselPrueba_${i}`)

      if (i < cantidad && this.accidentes[i]) {
        const accidente = this.accidentes[i]
        const color = this.obtenerColorAccidente(accidente)

        if (caraCarta && caraCarta.material) {
          caraCarta.material.diffuseColor = color
          caraCarta.material.emissiveColor = color.scale(0.08)
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

  actualizarCartas(cartas) {
    this.cartas = cartas
    const gridMano = this.guiTexture.getControlByName('gridManoCartasPrueba')
    if (!gridMano) return

    while (gridMano.children.length > 0) {
      gridMano.removeControl(gridMano.children[0])
    }

    if (!cartas || cartas.length === 0) {
      const textoVacio = new GUI.TextBlock('textoVacioCartasPrueba', 'Sin cartas en mano')
      textoVacio.color = '#f4cbaa'
      textoVacio.fontSize = 16
      textoVacio.fontFamily = 'Comic Sans MS'
      gridMano.addControl(textoVacio, 0, 0)
      return
    }

    cartas.forEach((carta, indice) => {
      if (indice < 8) {
        gridMano.addControl(this.crearCartaManoGUI(carta, indice), 0, indice)
      }
    })
  }

  actualizarProgresoPerfil() {
    if (!this.perfil) return

    const progreso = this.perfil.getProgreso()
    const porcentaje = Math.round(progreso * 100)

    const barra = this.guiTexture.getControlByName('barraProgresoInterna')
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

    const texto = this.guiTexture.getControlByName('textoProgresoPrueba')
    if (texto) {
      texto.text = `${this.perfil.horasCompletadas}/${this.perfil.horasRequeridas} horas (${porcentaje}%)`
    }
  }

  actualizarTurno(turno) {
    this.turnoActual = turno
    const estado3 = this.guiTexture.getControlByName('estadoPrueba_3')
    if (estado3) {
      const texto = estado3.children[0]
      if (texto) {
        texto.text = `Turno: ${turno}`
      }
    }
  }

  actualizarHUDPerfil() {
    this.actualizarPerfil(this.perfil)
  }

  actualizarPanelCartas() {
    this.actualizarCartas(this.cartas)
  }

  animarCartaJugada(indice, callback) {
    const cartaPanel = this.guiTexture.getControlByName(`cartaPrueba_${indice}`)
    if (!cartaPanel) {
      callback && callback()
      return
    }

    cartaPanel.zIndex = 500

    const animacion = new BABYLON.Animation(
      'animacionCartaPrueba',
      'alpha',
      60,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    )
    animacion.setKeys([
      { frame: 0, value: 1 },
      { frame: 30, value: 0 }
    ])
    cartaPanel.animations = [animacion]

    this.scene.beginAnimation(cartaPanel, 0, 30, false, 1, () => {
      cartaPanel.dispose()
      callback && callback()
    })
  }

  animarAccidenteActivado(accidente, callback) {
    const panelAccidente = new GUI.Rectangle('panelAccidenteActivadoPrueba')
    panelAccidente.width = '400px'
    panelAccidente.height = '200px'
    panelAccidente.thickness = 3
    panelAccidente.cornerRadius = 20
    panelAccidente.color = '#a85a2a'
    panelAccidente.background = 'rgba(28, 20, 18, 0.95)'
    panelAccidente.shadowColor = '#000000'
    panelAccidente.shadowBlur = 30
    panelAccidente.shadowOffsetY = 10
    panelAccidente.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    panelAccidente.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    panelAccidente.zIndex = 1000
    panelAccidente.alpha = 0
    this.overlay.addControl(panelAccidente)

    const titulo = new GUI.TextBlock('tituloAccidenteActivadoPrueba', `¡${accidente.nombre}!`)
    titulo.top = '-50px'
    titulo.height = '40px'
    titulo.color = '#ff6b6b'
    titulo.fontSize = 24
    titulo.fontFamily = 'Comic Sans MS'
    titulo.fontWeight = 'bold'
    panelAccidente.addControl(titulo)

    const descripcion = new GUI.TextBlock('descripcionAccidenteActivadoPrueba', accidente.descripcion)
    descripcion.top = '10px'
    descripcion.height = '60px'
    descripcion.color = '#f4cbaa'
    descripcion.fontSize = 14
    descripcion.fontFamily = 'Comic Sans MS'
    descripcion.textWrapping = true
    panelAccidente.addControl(descripcion)

    const nivel = new GUI.TextBlock('nivelAccidenteActivadoPrueba', `Nivel ${accidente.nivel}`)
    nivel.top = '60px'
    nivel.height = '30px'
    nivel.color = '#cf8a34'
    nivel.fontSize = 16
    nivel.fontFamily = 'Comic Sans MS'
    nivel.fontWeight = 'bold'
    panelAccidente.addControl(nivel)

    const animacionEntrada = new BABYLON.Animation(
      'animacionEntradaAccidentePrueba',
      'alpha',
      60,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    )
    animacionEntrada.setKeys([
      { frame: 0, value: 0 },
      { frame: 15, value: 1 }
    ])
    panelAccidente.animations = [animacionEntrada]

    this.scene.beginAnimation(panelAccidente, 0, 15, false, 1, () => {
      setTimeout(() => {
        const animacionSalida = new BABYLON.Animation(
          'animacionSalidaAccidentePrueba',
          'alpha',
          60,
          BABYLON.Animation.ANIMATIONTYPE_FLOAT,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        )
        animacionSalida.setKeys([
          { frame: 0, value: 1 },
          { frame: 20, value: 0 }
        ])
        panelAccidente.animations = [animacionSalida]
        this.scene.beginAnimation(panelAccidente, 0, 20, false, 1, () => {
          panelAccidente.dispose()
          callback && callback()
        })
      }, 2000)
    })
  }

  mostrarMensaje(mensaje, duracion = 3000) {
    const panel = new GUI.Rectangle('panelMensajePrueba')
    panel.width = '500px'
    panel.height = '80px'
    panel.thickness = 2
    panel.cornerRadius = 16
    panel.color = '#8e4d22'
    panel.background = 'rgba(28, 20, 18, 0.95)'
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP
    panel.top = '150px'
    panel.zIndex = 900
    panel.alpha = 0
    this.overlay.addControl(panel)

    const texto = new GUI.TextBlock('textoMensajePrueba', mensaje)
    texto.color = '#ffe2c8'
    texto.fontSize = 16
    texto.fontFamily = 'Comic Sans MS'
    texto.textWrapping = true
    panel.addControl(texto)

    const animacionEntrada = new BABYLON.Animation(
      'animacionEntradaMensajePrueba',
      'alpha',
      60,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    )
    animacionEntrada.setKeys([
      { frame: 0, value: 0 },
      { frame: 10, value: 1 }
    ])
    panel.animations = [animacionEntrada]

    this.scene.beginAnimation(panel, 0, 10, false, 1, () => {
      setTimeout(() => {
        const animacionSalida = new BABYLON.Animation(
          'animacionSalidaMensajePrueba',
          'alpha',
          60,
          BABYLON.Animation.ANIMATIONTYPE_FLOAT,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        )
        animacionSalida.setKeys([
          { frame: 0, value: 1 },
          { frame: 15, value: 0 }
        ])
        panel.animations = [animacionSalida]
        this.scene.beginAnimation(panel, 0, 15, false, 1, () => {
          panel.dispose()
        })
      }, duracion)
    })
  }

  onVolver(callback) {
    this.callbackVolver = callback
  }

  onJugarCarta(callback) {
    this.callbackJugarCarta = callback
  }

  onFinTurno(callback) {
    this.callbackFinTurno = callback
  }

  onActivarAccidente(callback) {
    this.callbackActivarAccidente = callback
  }

  onReiniciar(callback) {
    this.callbackReiniciar = callback
  }

  onPasarTurno(callback) {
    this.callbackPasarTurno = callback
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

      this.mostrarSecuenciaInicio()
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

  onIntercambioCarta(callback) {
    this.callbackIntercambioCarta = callback
  }

  onActivarActividadGrupal(callback) {
    this.callbackActividadGrupal = callback
  }

  actualizarActividades(actividades) {
    this.actividades = actividades
  }

  mostrarMensajeActividadGrupal(actividad) {
    this.mostrarMensaje(`Actividad grupal: ${actividad.nombre} - ${actividad.descripcion}`, 4000)
  }

  mostrarLogFinal(logJSON) {
    console.log('[VistaPartidaPrueba] Log completo de la partida:', logJSON)
    this.mostrarMensaje('Partida finalizada. Revisa la consola para el log completo.', 6000)
  }
}
