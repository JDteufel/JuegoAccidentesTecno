import * as BABYLON from '@babylonjs/core'
import * as GUI from '@babylonjs/gui'
import { GestorAjusteRatio } from './base/GestorAjusteRatio.js'
import temaService from '../services/TemaService.js'

export class VistaPartida {
  constructor(canvas, engine, sceneInicial) {
    this.canvas = canvas
    this.engine = engine
    this.sceneInicial = sceneInicial
    this.scene = null
    this.guiTexture = null
    this.callbackVolver = null
    this.callbackReiniciar = null
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
    this.cartasJugadasMeshes = []
    this.ranurasCartasJugadas = []
  }

  crear() {
    this.scene = new BABYLON.Scene(this.engine)
    this.scene.clearColor = new BABYLON.Color4(0.09, 0.07, 0.06, 1)

    this.crearEscena3D()
    this.crearHUD()
  }

  _obtenerColores() {
    return temaService.obtenerColoresTema(temaService.obtenerTemaActual())
  }

  _coloresDefecto() {
    return {
      hudPanelBg: 'rgba(23, 17, 14, 0.88)',
      hudBorderColor: '#8e4d22',
      hudTextColor: '#ffe2c8',
      hudSubtextColor: '#f4cbaa',
      hudEstadoBg: ['#2d221d', '#5a2e1d', '#2d221d', '#3a2a1d'],
      hudProgresoBg: '#1a1210',
      hudProgresoColor: '#d66a1f',
      hudBotonVolverBg: '#362924',
      hudBotonReiniciarBg: '#5a3321',
      hudBotonTextColor: '#ffd8bc',
      hudCartaBg: 'rgba(28, 20, 18, 0.92)',
      hudCartaBorder: '#a85a2a',
      hudCartaVaciaBg: 'rgba(33, 23, 19, 0.4)',
      hudCartaVaciaBorder: '#4a3528',
      hudZonaIntercambioIcono: '#a88a6a',
      nombreJugadorColor: '#ffe2c8',
      panelAccidentesBorder: '#8e4d22',
      panelAccidentesBg: 'rgba(28, 20, 16, 0.97)',
      panelInicioBorder: '#8e4d22',
      panelInicioBg: 'rgba(28, 20, 16, 0.95)',
      primary: '#d66a1f',
      primaryText: '#fff7ef',
      badgeWork: '#90ee90',
      badgeBg: 'rgba(168, 90, 42, 0.4)',
      borderAlt: '#8e4d22',
      textBody: '#f4cbaa',
      topbar: 'rgba(18, 14, 13, 0.72)'
    }
  }

  crearEscena3D() {
    const camera = new BABYLON.ArcRotateCamera(
      'cameraPartida',
      0,
      1.08,
      22,
      this.centroTablero,
      this.scene
    )
    this.cameraPartida = camera
    camera.inputs.clear()
    camera.lowerRadiusLimit = 20
    camera.upperRadiusLimit = 24
    camera.beta = 1.15
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
        width: 14.4,
        depth: 14.4,
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
        width: 13.3,
        height: 13.3,
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
        width: 13.65,
        depth: 13.65,
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

    this.crearCarruselAccidente()
    this.crearZonaCartasJugadas()
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

  crearZonaCartasJugadas() {
    this.ranurasCartasJugadas = {
      frente: [],
      atras: [],
      derecha: [],
      izquierda: []
    }

    const columnas = 4
    const filas = 2
    const espaciadoColumna = 1.2
    const espaciadoFila = 1.6
    const distancia = 4.5

    const zonas = [
      { nombre: 'frente',    centro: this.centroTablero.clone().add(new BABYLON.Vector3(distancia, 0.45, 0)),     rotacionY: -Math.PI / 2, ejeColumna: 'z' },
      { nombre: 'atras',     centro: this.centroTablero.clone().add(new BABYLON.Vector3(-distancia, 0.45, 0)),    rotacionY: Math.PI / 2,  ejeColumna: 'z' },
      { nombre: 'derecha',   centro: this.centroTablero.clone().add(new BABYLON.Vector3(0, 0.45, -distancia)),    rotacionY: 0,            ejeColumna: 'x' },
      { nombre: 'izquierda', centro: this.centroTablero.clone().add(new BABYLON.Vector3(0, 0.45, distancia)),     rotacionY: Math.PI,      ejeColumna: 'x' }
    ]

    zonas.forEach(zona => {
      let indice = 0
      for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
          const offsetFila = (f - (filas - 1) / 2) * espaciadoFila
          const offsetColumna = (c - (columnas - 1) / 2) * espaciadoColumna

          const posicion = zona.centro.clone()
          if (zona.ejeColumna === 'z') {
            posicion.x += offsetFila
            posicion.z += offsetColumna
          } else {
            posicion.z += offsetFila
            posicion.x += offsetColumna
          }

          const contenedor = new BABYLON.TransformNode(`contenedorCartaJugada_${zona.nombre}_${indice}`, this.scene)
          contenedor.position = posicion
          contenedor.rotation.y = zona.rotacionY

          const baseTabla = BABYLON.MeshBuilder.CreateBox(`baseTablaJugada_${zona.nombre}_${indice}`, {
            width: 1.12,
            height: 0.06,
            depth: 1.46
          }, this.scene)
          baseTabla.parent = contenedor
          baseTabla.position.y = -0.02

          const materialBase = new BABYLON.StandardMaterial(`matBaseTablaJugada_${zona.nombre}_${indice}`, this.scene)
          materialBase.diffuseColor = new BABYLON.Color3(0.05, 0.05, 0.05)
          materialBase.specularColor = new BABYLON.Color3(0.02, 0.02, 0.02)
          materialBase.emissiveColor = new BABYLON.Color3(0.005, 0.005, 0.005)
          baseTabla.material = materialBase

          const caraTabla = BABYLON.MeshBuilder.CreatePlane(`caraTablaJugada_${zona.nombre}_${indice}`, {
            width: 0.94,
            height: 1.32,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
          }, this.scene)
          caraTabla.parent = contenedor
          caraTabla.rotation.x = -Math.PI / 2
          caraTabla.position = new BABYLON.Vector3(0, 0.045, 0)

          const materialCara = new BABYLON.StandardMaterial(`matCaraTablaJugada_${zona.nombre}_${indice}`, this.scene)
          materialCara.diffuseColor = new BABYLON.Color3(0.15, 0.1, 0.07)
          materialCara.specularColor = new BABYLON.Color3(0.08, 0.06, 0.04)
          materialCara.emissiveColor = new BABYLON.Color3(0.015, 0.01, 0.006)
          caraTabla.material = materialCara

          this.ranurasCartasJugadas[zona.nombre].push({
            contenedor,
            baseTabla,
            caraTabla,
            materialCara,
            ocupada: false
          })

          indice++
        }
      }
    })
  }

  agregarCartaJugadaATabler(carta, jugador) {
    console.log('agregarCartaJugadaATabler:', carta.titulo, 'jugador:', jugador)

    if (!this.scene || !this.ranurasCartasJugadas) {
      console.log('No hay scene o ranurasCartasJugadas')
      return
    }

    const ranuras = this.ranurasCartasJugadas.frente
    if (!ranuras) {
      console.log('No hay ranuras frente')
      return
    }

    const ranuraLibre = ranuras.find(r => !r.ocupada)
    if (!ranuraLibre) {
      console.log('No hay ranura libre')
      return
    }

    ranuraLibre.ocupada = true

    const imagenSrc = carta.obtenerImagen ? carta.obtenerImagen() : null
    if (imagenSrc) {
      const textura = new BABYLON.Texture(imagenSrc, this.scene, true, false, BABYLON.Texture.TRILINEAR_SAMPLINGMODE)
      textura.hasAlpha = true
      ranuraLibre.materialCara.diffuseTexture = textura
      ranuraLibre.materialCara.emissiveTexture = textura
      ranuraLibre.materialCara.diffuseColor = new BABYLON.Color3(1, 1, 1)
      ranuraLibre.materialCara.specularColor = new BABYLON.Color3(0.1, 0.08, 0.06)
      ranuraLibre.materialCara.useAlphaFromDiffuseTexture = true
    }

    this.cartasJugadasMeshes.push(ranuraLibre.caraTabla)
    console.log('Carta agregada al tablero correctamente')
  }

  limpiarTableroCartas() {
    if (!this.ranurasCartasJugadas) return

    for (const direccion of Object.keys(this.ranurasCartasJugadas)) {
      const ranuras = this.ranurasCartasJugadas[direccion]
      for (const ranura of ranuras) {
        ranura.ocupada = false
        ranura.materialCara.diffuseTexture = null
        ranura.materialCara.emissiveTexture = null
        ranura.materialCara.diffuseColor = new BABYLON.Color3(0.15, 0.1, 0.07)
        ranura.materialCara.specularColor = new BABYLON.Color3(0.08, 0.06, 0.04)
        ranura.materialCara.emissiveColor = new BABYLON.Color3(0.015, 0.01, 0.006)
      }
    }

    this.cartasJugadasMeshes = []
  }

  crearCarruselAccidente() {
    const colores = this._coloresDefecto()
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
    texturaNombre.drawText(this.nombreJugador, null, 48, colores.nombreJugadorColor, 'rgba(0,0,0,0)', true)
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
    const colores = this._coloresDefecto()
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
    codigoTexto.drawText('---', null, 40, colores.nombreJugadorColor, 'rgba(0,0,0,0)', true)
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

    const colores = this._obtenerColores()
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
    panel.color = colores.panelAccidentesBorder
    panel.background = colores.panelAccidentesBg
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
    titulo.color = colores.hudTextColor
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
    botonCerrar.background = colores.hudBotonVolverBg
    botonCerrar.color = colores.hudBotonTextColor
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
    this.crearBotonReiniciar()
    this.crearPanelCartas()
  }

  crearEncabezadoPartida() {
    const colores = this._obtenerColores()
    const panelEncabezado = new GUI.Rectangle('panelEncabezadoPartida')
    panelEncabezado.width = '860px'
    panelEncabezado.height = '124px'
    panelEncabezado.top = '18px'
    panelEncabezado.thickness = 2
    panelEncabezado.cornerRadius = 24
    panelEncabezado.color = colores.hudBorderColor
    panelEncabezado.background = colores.hudPanelBg
    panelEncabezado.shadowColor = '#00000066'
    panelEncabezado.shadowBlur = 20
    panelEncabezado.shadowOffsetY = 8
    panelEncabezado.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    panelEncabezado.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP
    this.overlay.addControl(panelEncabezado)

    const titulo = new GUI.TextBlock('tituloPartida', 'Esperando inicio de partida...')
    titulo.top = '-28px'
    titulo.height = '34px'
    titulo.color = colores.hudTextColor
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
    subtitulo.color = colores.hudSubtextColor
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
      bloque.background = colores.hudEstadoBg[indice] || colores.hudEstadoBg[0]

      const textoEstado = new GUI.TextBlock(`estadoTexto_${indice}`, texto)
      textoEstado.color = colores.hudTextColor
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
    barraContenedor.color = colores.hudBorderColor
    barraContenedor.background = colores.hudProgresoBg
    panelEncabezado.addControl(barraContenedor)

    const barra = new GUI.Rectangle('barraProgreso')
    barra.width = '0%'
    barra.height = '100%'
    barra.thickness = 0
    barra.cornerRadius = 9
    barra.background = colores.hudProgresoColor
    barra.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    barraContenedor.addControl(barra)

    const textoProgreso = new GUI.TextBlock('textoProgreso', '0/0 horas')
    textoProgreso.width = '100%'
    textoProgreso.height = '100%'
    textoProgreso.color = colores.hudTextColor
    textoProgreso.fontSize = 11
    textoProgreso.fontFamily = 'Comic Sans MS'
    textoProgreso.fontWeight = 'bold'
    barraContenedor.addControl(textoProgreso)
  }

  crearBotonVolver() {
    const colores = this._obtenerColores()
    const botonVolver = GUI.Button.CreateSimpleButton('btnVolverPartida', 'Volver')
    botonVolver.width = '150px'
    botonVolver.height = '48px'
    botonVolver.left = '20px'
    botonVolver.top = '20px'
    botonVolver.background = colores.hudBotonVolverBg
    botonVolver.color = colores.hudBotonTextColor
    botonVolver.cornerRadius = 16
    botonVolver.thickness = 2
    botonVolver.borderColor = colores.hudBorderColor
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

  crearBotonReiniciar() {
    const colores = this._obtenerColores()
    const botonReiniciar = GUI.Button.CreateSimpleButton('btnReiniciarPartida', 'Reiniciar')
    botonReiniciar.width = '150px'
    botonReiniciar.height = '48px'
    botonReiniciar.right = '20px'
    botonReiniciar.top = '20px'
    botonReiniciar.background = colores.hudBotonReiniciarBg
    botonReiniciar.color = colores.hudBotonTextColor
    botonReiniciar.cornerRadius = 16
    botonReiniciar.thickness = 2
    botonReiniciar.borderColor = colores.hudBorderColor
    botonReiniciar.fontSize = 18
    botonReiniciar.fontWeight = 'bold'
    botonReiniciar.fontFamily = 'Comic Sans MS'
    botonReiniciar.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
    botonReiniciar.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP

    botonReiniciar.onPointerUpObservable.add(() => {
      this.callbackReiniciar && this.callbackReiniciar()
    })

    this.overlay.addControl(botonReiniciar)
  }

  crearPanelCartas() {
    const colores = this._obtenerColores()
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
    contenedorIntercambio.background = colores.hudCartaBg
    contenedorIntercambio.cornerRadius = 15
    contenedorIntercambio.thickness = 3
    contenedorIntercambio.color = colores.hudCartaBorder
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
    iconoZona.color = colores.hudZonaIntercambioIcono
    iconoZona.fontSize = 32
    iconoZona.fontFamily = 'Comic Sans MS'
    iconoZona.fontWeight = 'bold'
    zonaIntercambio.addControl(iconoZona, 0, 0)

    const textoZona = new GUI.TextBlock('textoZonaIntercambio', 'Soltar para intercambiar')
    textoZona.color = colores.hudZonaIntercambioIcono
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
    panelCartas.background = colores.hudCartaBg
    panelCartas.cornerRadius = 15
    panelCartas.thickness = 3
    panelCartas.color = colores.hudCartaBorder
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
    const colores = this._obtenerColores()
    const cartaPanel = new GUI.Rectangle(`carta_${indice}`)
    cartaPanel.width = '96%'
    cartaPanel.height = '92%'
    cartaPanel.background = colores.hudCartaVaciaBg
    cartaPanel.cornerRadius = 14
    cartaPanel.thickness = 2
    cartaPanel.color = colores.hudCartaVaciaBorder
    cartaPanel.isVisible = false
    return cartaPanel
  }

  eliminarCartaDeMano(carta) {
    const gridMano = this.guiTexture.getControlByName('gridManoCartas')
    if (!gridMano) return

    const nombreBuscado = `carta_${carta.codigo}`

    const buscarYEliminar = (control) => {
      if (control.name === nombreBuscado) {
        gridMano.removeControl(control)
        control.dispose()
        return true
      }
      if (control.children) {
        for (const hijo of control.children) {
          if (buscarYEliminar(hijo)) return true
        }
      }
      return false
    }

    buscarYEliminar(gridMano)
  }

  crearCartaMano(carta, indice) {
    const imagenSrc = carta.obtenerImagen ? carta.obtenerImagen() : null
    const cartaPanel = new GUI.Image(`carta_${carta.codigo}`, imagenSrc)
    cartaPanel.width = '96%'
    cartaPanel.height = '92%'
    cartaPanel.stretch = GUI.Image.STRETCH_UNIFORM
    cartaPanel.isPointerBlocker = true

    if (carta.estaDeshabilitada()) {
      cartaPanel.alpha = 0.5
    }

    cartaPanel.onPointerDownObservable.add((coords) => {
      if (carta.estaDeshabilitada()) return
      if (this.dragState) return
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
        cartaPanel.top = '0px'
        cartaPanel.alpha = carta.estaDeshabilitada() ? 0.5 : 1
        if (this.callbackJugarCarta) {
          this.callbackJugarCarta(carta)
        }
      } else {
        cartaPanel.top = '0px'
        cartaPanel.alpha = carta.estaDeshabilitada() ? 0.5 : 1
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

    const colores = this._obtenerColores()
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
          dt.drawText(`${accidente.codigo}: ${accidente.nombre}`, null, 22, colores.nombreJugadorColor, 'rgba(0,0,0,0)', true)
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

    const cartasActivas = this.cartas.filter(c => !c.estaDeshabilitada())

    for (let i = 0; i < 8; i++) {
      if (i < cartasActivas.length) {
        const carta = cartasActivas[i]
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
      const colores = this._obtenerColores()
      this.texturaNombreJugador.drawText(nombre, null, 48, colores.nombreJugadorColor, 'rgba(0,0,0,0)', true)
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

    const colores = this._obtenerColores()

    const panelInicio = new GUI.Rectangle('panelInicio')
    panelInicio.width = '1600px'
    panelInicio.height = '820px'
    panelInicio.thickness = 3
    panelInicio.cornerRadius = 20
    panelInicio.color = colores.panelInicioBorder
    panelInicio.background = colores.panelInicioBg
    panelInicio.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    panelInicio.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    panelInicio.zIndex = 1000
    this.overlay.addControl(panelInicio)

    const tituloAcc = new GUI.TextBlock('tituloAccidentes', 'Accidentes en Mesa')
    tituloAcc.top = '-380px'
    tituloAcc.left = '-200px'
    tituloAcc.height = '50px'
    tituloAcc.color = colores.hudTextColor
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
    tituloPerfil.color = colores.hudTextColor
    tituloPerfil.fontSize = 28
    tituloPerfil.fontFamily = 'Comic Sans MS'
    tituloPerfil.fontWeight = 'bold'
    panelInicio.addControl(tituloPerfil)

    const nombrePerf = new GUI.TextBlock('nombrePerfil', perfilReal.nombre)
    nombrePerf.top = '-240px'
    nombrePerf.left = '560px'
    nombrePerf.height = '40px'
    nombrePerf.color = colores.primary
    nombrePerf.fontSize = 22
    nombrePerf.fontFamily = 'Comic Sans MS'
    nombrePerf.fontWeight = 'bold'
    panelInicio.addControl(nombrePerf)

    const horasPerf = new GUI.TextBlock('horasPerfil', `Horas requeridas: ${perfilReal.horasRequeridas}`)
    horasPerf.top = '-190px'
    horasPerf.left = '560px'
    horasPerf.height = '30px'
    horasPerf.color = colores.hudProgresoColor
    horasPerf.fontSize = 18
    horasPerf.fontFamily = 'Comic Sans MS'
    panelInicio.addControl(horasPerf)

    const descPerf = new GUI.TextBlock('descPerfil', perfilReal.descripcion)
    descPerf.top = '-90px'
    descPerf.left = '560px'
    descPerf.height = '120px'
    descPerf.width = '400px'
    descPerf.color = colores.hudSubtextColor
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
    catsPerf.color = colores.textBody
    catsPerf.fontSize = 14
    catsPerf.fontFamily = 'Comic Sans MS'
    catsPerf.textWrapping = true
    panelInicio.addControl(catsPerf)

    const botonCerrar = GUI.Button.CreateSimpleButton('btnCerrarInicio', 'Cerrar')
    botonCerrar.width = '180px'
    botonCerrar.height = '44px'
    botonCerrar.top = '370px'
    botonCerrar.background = colores.primary
    botonCerrar.color = colores.primaryText
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

    const colores = this._obtenerColores()
    const progreso = this.perfil.getProgreso()
    const porcentaje = Math.round(progreso * 100)

    const barra = this.guiTexture.getControlByName('barraProgreso')
    if (barra) {
      barra.width = `${porcentaje}%`
      if (progreso >= 1) {
        barra.background = colores.badgeWork
      } else if (progreso >= 0.5) {
        barra.background = colores.primary
      } else {
        barra.background = colores.borderAlt
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

    const colores = this._obtenerColores()

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
    panel.color = colores.hudBorderColor
    panel.background = colores.panelAccidentesBg
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    overlay.addControl(panel)

    const titulo = new GUI.TextBlock('tituloIntercambio', 'Intercambiar Cartas')
    titulo.top = '-130px'
    titulo.height = '40px'
    titulo.color = colores.hudTextColor
    titulo.fontSize = 24
    titulo.fontFamily = 'Comic Sans MS'
    titulo.fontWeight = 'bold'
    panel.addControl(titulo)

    const subtitulo = new GUI.TextBlock('subtituloIntercambio', 'Selecciona una carta para intercambiar (mismas horas)')
    subtitulo.top = '-90px'
    subtitulo.height = '24px'
    subtitulo.color = colores.hudZonaIntercambioIcono
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
      btnCarta.background = carta.estaDeshabilitada() ? colores.hudEstadoBg[0] : colores.hudBotonReiniciarBg
      btnCarta.color = carta.estaDeshabilitada() ? '#666' : colores.hudTextColor
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
    btnCerrar.background = colores.hudBotonVolverBg
    btnCerrar.color = colores.hudBotonTextColor
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

    const colores = this._obtenerColores()

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
    panel.color = colores.hudBorderColor
    panel.background = colores.panelAccidentesBg
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    overlay2.addControl(panel)

    const titulo = new GUI.TextBlock('tituloIntercambio2', `Intercambiar ${cartaSeleccionada.titulo}`)
    titulo.top = '-110px'
    titulo.height = '40px'
    titulo.color = colores.hudTextColor
    titulo.fontSize = 22
    titulo.fontFamily = 'Comic Sans MS'
    titulo.fontWeight = 'bold'
    panel.addControl(titulo)

    const subtitulo = new GUI.TextBlock('subtituloIntercambio2', `Selecciona carta de ${cartaSeleccionada.horas}h para intercambiar`)
    subtitulo.top = '-75px'
    subtitulo.height = '24px'
    subtitulo.color = colores.hudZonaIntercambioIcono
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
      btnCarta.background = colores.hudBotonReiniciarBg
      btnCarta.color = colores.hudTextColor
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
    btnCerrar.background = colores.hudBotonVolverBg
    btnCerrar.color = colores.hudBotonTextColor
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
    const colores = this._obtenerColores()
    const mensaje = new GUI.TextBlock('mensajeFlotante', texto)
    mensaje.width = '400px'
    mensaje.height = '50px'
    mensaje.bottom = '260px'
    mensaje.color = colores.hudTextColor
    mensaje.fontSize = 16
    mensaje.fontFamily = 'Comic Sans MS'
    mensaje.fontWeight = 'bold'
    mensaje.background = colores.hudCartaBg
    mensaje.cornerRadius = 12
    mensaje.thickness = 2
    mensaje.borderColor = colores.hudBorderColor
    this.overlay.addControl(mensaje)

    setTimeout(() => {
      mensaje.dispose()
    }, 3000)
  }

  onJugarCarta(callback) {
    this.callbackJugarCarta = callback
  }

  onReiniciar(callback) {
    this.callbackReiniciar = callback
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

  mostrarResumenFinal(resumen, logJSON) {
    const colores = this._obtenerColores()

    const fondo = new GUI.Rectangle('fondoResumenFinal')
    fondo.width = 1
    fondo.height = 1
    fondo.thickness = 0
    fondo.background = 'rgba(0, 0, 0, 0.85)'
    fondo.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    fondo.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    fondo.zIndex = 3000
    fondo.isPointerBlocker = true
    this.overlay.addControl(fondo)

    const panelPrincipal = new GUI.Rectangle('panelResumenFinal')
    panelPrincipal.width = '1400px'
    panelPrincipal.height = '800px'
    panelPrincipal.thickness = 3
    panelPrincipal.cornerRadius = 24
    panelPrincipal.color = colores.hudBorderColor
    panelPrincipal.background = colores.panelInicioBg
    panelPrincipal.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    panelPrincipal.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    panelPrincipal.zIndex = 3001
    panelPrincipal.shadowColor = '#00000088'
    panelPrincipal.shadowBlur = 30
    panelPrincipal.shadowOffsetY = 10
    fondo.addControl(panelPrincipal)

    const titulo = new GUI.TextBlock('tituloResumen', 'Partida Finalizada')
    titulo.top = '-370px'
    titulo.height = '50px'
    titulo.color = colores.primary
    titulo.fontSize = 34
    titulo.fontFamily = 'Comic Sans MS'
    titulo.fontWeight = 'bold'
    panelPrincipal.addControl(titulo)

    const subtitulo = new GUI.TextBlock('subtituloResumen', resumen.perfil)
    subtitulo.top = '-320px'
    subtitulo.height = '36px'
    subtitulo.color = colores.hudTextColor
    subtitulo.fontSize = 24
    subtitulo.fontFamily = 'Comic Sans MS'
    subtitulo.fontWeight = 'bold'
    panelPrincipal.addControl(subtitulo)

    const descPerfil = new GUI.TextBlock('descPerfilResumen', resumen.descripcion)
    descPerfil.top = '-280px'
    descPerfil.height = '30px'
    descPerfil.width = '800px'
    descPerfil.color = colores.hudSubtextColor
    descPerfil.fontSize = 16
    descPerfil.fontFamily = 'Comic Sans MS'
    descPerfil.textWrapping = true
    panelPrincipal.addControl(descPerfil)

    const barraContenedor = new GUI.Rectangle('barraProgresoResumen')
    barraContenedor.width = '600px'
    barraContenedor.height = '28px'
    barraContenedor.top = '-235px'
    barraContenedor.thickness = 2
    barraContenedor.cornerRadius = 14
    barraContenedor.color = colores.hudBorderColor
    barraContenedor.background = colores.hudProgresoBg
    panelPrincipal.addControl(barraContenedor)

    const barra = new GUI.Rectangle('barraResumen')
    barra.width = `${resumen.porcentajeCompletado}%`
    barra.height = '100%'
    barra.thickness = 0
    barra.cornerRadius = 12
    barra.background = resumen.porcentajeCompletado >= 100 ? colores.badgeWork : colores.hudProgresoColor
    barra.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    barraContenedor.addControl(barra)

    const textoBarra = new GUI.TextBlock('textoBarraResumen', `${resumen.porcentajeCompletado}% completado`)
    textoBarra.width = '100%'
    textoBarra.height = '100%'
    textoBarra.color = colores.hudTextColor
    textoBarra.fontSize = 14
    textoBarra.fontFamily = 'Comic Sans MS'
    textoBarra.fontWeight = 'bold'
    barraContenedor.addControl(textoBarra)

    const gridDatos = new GUI.Grid('gridDatosResumen')
    gridDatos.width = '700px'
    gridDatos.height = '120px'
    gridDatos.top = '-185px'
    gridDatos.paddingLeft = '10px'
    gridDatos.paddingRight = '10px'
    gridDatos.paddingTop = '8px'
    gridDatos.paddingBottom = '8px'
    for (let i = 0; i < 2; i++) {
      gridDatos.addRowDefinition(56)
    }
    for (let i = 0; i < 4; i++) {
      gridDatos.addColumnDefinition(0.25)
    }
    panelPrincipal.addControl(gridDatos)

    resumen.datos.slice(0, 8).forEach((dato, indice) => {
      const fila = Math.floor(indice / 4)
      const columna = indice % 4

      const celda = new GUI.Rectangle(`celdaDato_${indice}`)
      celda.thickness = 1
      celda.cornerRadius = 10
      celda.color = colores.hudBorderColor
      celda.background = colores.hudEstadoBg[indice % colores.hudEstadoBg.length]
      gridDatos.addControl(celda, fila, columna)

      const etiqueta = new GUI.TextBlock(`etiquetaDato_${indice}`, dato.etiqueta)
      etiqueta.top = '-10px'
      etiqueta.height = '18px'
      etiqueta.color = colores.hudSubtextColor
      etiqueta.fontSize = 11
      etiqueta.fontFamily = 'Comic Sans MS'
      celda.addControl(etiqueta)

      const valor = new GUI.TextBlock(`valorDato_${indice}`, dato.valor)
      valor.top = '12px'
      valor.height = '22px'
      valor.color = colores.hudTextColor
      valor.fontSize = 14
      valor.fontFamily = 'Comic Sans MS'
      valor.fontWeight = 'bold'
      celda.addControl(valor)
    })

    const scrollViewer = new GUI.ScrollViewer('scrollMensajesResumen')
    scrollViewer.width = '1200px'
    scrollViewer.height = '260px'
    scrollViewer.top = '-40px'
    scrollViewer.thickness = 2
    scrollViewer.color = colores.hudBorderColor
    scrollViewer.background = colores.topbar
    scrollViewer.cornerRadius = 14
    panelPrincipal.addControl(scrollViewer)

    let yPos = 10
    resumen.mensajes.forEach((mensaje, indice) => {
      const bloque = new GUI.Rectangle(`bloqueMensaje_${indice}`)
      bloque.width = '1160px'
      bloque.height = 'auto'
      bloque.top = `${yPos}px`
      bloque.thickness = 0
      bloque.background = 'transparent'
      bloque.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
      bloque.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP
      scrollViewer.addControl(bloque)

      const icono = new GUI.TextBlock(`iconoMensaje_${indice}`, '▸')
      icono.width = '24px'
      icono.height = 'auto'
      icono.color = colores.primary
      icono.fontSize = 16
      icono.fontFamily = 'Comic Sans MS'
      icono.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
      icono.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP
      bloque.addControl(icono)

      const texto = new GUI.TextBlock(`textoMensaje_${indice}`, mensaje)
      texto.width = '1120px'
      texto.height = 'auto'
      texto.left = '28px'
      texto.color = colores.textBody
      texto.fontSize = 15
      texto.fontFamily = 'Comic Sans MS'
      texto.textWrapping = true
      texto.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
      texto.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP
      bloque.addControl(texto)

      const alturaEstimada = Math.ceil(texto.text.length / 70) * 20 + 20
      bloque.height = `${Math.max(alturaEstimada, 50)}px`
      yPos += alturaEstimada + 12
    })

    scrollViewer.height = `${Math.min(yPos + 20, 260)}px`

    const btnVerLog = GUI.Button.CreateSimpleButton('btnVerLogCompleto', 'Ver registro completo de la partida')
    btnVerLog.width = '320px'
    btnVerLog.height = '48px'
    btnVerLog.top = '260px'
    btnVerLog.left = '-200px'
    btnVerLog.background = colores.hudBotonVolverBg
    btnVerLog.color = colores.hudBotonTextColor
    btnVerLog.cornerRadius = 14
    btnVerLog.thickness = 2
    btnVerLog.borderColor = colores.hudBorderColor
    btnVerLog.fontSize = 16
    btnVerLog.fontFamily = 'Comic Sans MS'
    btnVerLog.fontWeight = 'bold'
    btnVerLog.onPointerUpObservable.add(() => {
      this.mostrarLogCompleto(logJSON)
    })
    panelPrincipal.addControl(btnVerLog)

    const btnCerrar = GUI.Button.CreateSimpleButton('btnCerrarResumen', 'Responder encuesta')
    btnCerrar.width = '260px'
    btnCerrar.height = '48px'
    btnCerrar.top = '260px'
    btnCerrar.left = '200px'
    btnCerrar.background = colores.primary
    btnCerrar.color = colores.primaryText
    btnCerrar.cornerRadius = 14
    btnCerrar.fontSize = 16
    btnCerrar.fontFamily = 'Comic Sans MS'
    btnCerrar.fontWeight = 'bold'
    btnCerrar.onPointerUpObservable.add(() => {
      fondo.dispose()
      if (this.callbackVolver) {
        this.callbackVolver()
      }
    })
    panelPrincipal.addControl(btnCerrar)
  }

  mostrarLogCompleto(logJSON) {
    const colores = this._obtenerColores()
    const jsonString = typeof logJSON === 'string' ? logJSON : JSON.stringify(logJSON, null, 2)

    const fondo = new GUI.Rectangle('fondoLogCompleto')
    fondo.width = 1
    fondo.height = 1
    fondo.thickness = 0
    fondo.background = 'rgba(0, 0, 0, 0.9)'
    fondo.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    fondo.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    fondo.zIndex = 3100
    fondo.isPointerBlocker = true
    this.overlay.addControl(fondo)

    const panel = new GUI.Rectangle('panelLogCompleto')
    panel.width = '1500px'
    panel.height = '850px'
    panel.thickness = 3
    panel.cornerRadius = 20
    panel.color = colores.hudBorderColor
    panel.background = colores.panelInicioBg
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    panel.zIndex = 3101
    fondo.addControl(panel)

    const titulo = new GUI.TextBlock('tituloLogCompleto', 'Registro Completo de la Partida')
    titulo.top = '-395px'
    titulo.height = '44px'
    titulo.color = colores.primary
    titulo.fontSize = 28
    titulo.fontFamily = 'Comic Sans MS'
    titulo.fontWeight = 'bold'
    panel.addControl(titulo)

    const scrollViewer = new GUI.ScrollViewer('scrollLogCompleto')
    scrollViewer.width = '1420px'
    scrollViewer.height = '720px'
    scrollViewer.top = '-320px'
    scrollViewer.thickness = 2
    scrollViewer.color = colores.hudBorderColor
    scrollViewer.background = 'rgba(18, 14, 13, 0.85)'
    scrollViewer.cornerRadius = 12
    panel.addControl(scrollViewer)

    const textoLog = new GUI.TextBlock('textoLogCompleto', jsonString)
    textoLog.width = '1380px'
    textoLog.height = 'auto'
    textoLog.color = colores.textBody
    textoLog.fontSize = 13
    textoLog.fontFamily = 'monospace'
    textoLog.textWrapping = true
    textoLog.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    textoLog.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP
    scrollViewer.addControl(textoLog)

    const btnCopiar = GUI.Button.CreateSimpleButton('btnCopiarLog', 'Copiar al portapapeles')
    btnCopiar.width = '240px'
    btnCopiar.height = '42px'
    btnCopiar.top = '280px'
    btnCopiar.left = '-160px'
    btnCopiar.background = colores.hudBotonVolverBg
    btnCopiar.color = colores.hudBotonTextColor
    btnCopiar.cornerRadius = 12
    btnCopiar.fontSize = 14
    btnCopiar.fontFamily = 'Comic Sans MS'
    btnCopiar.fontWeight = 'bold'
    btnCopiar.onPointerUpObservable.add(() => {
      navigator.clipboard.writeText(jsonString).then(() => {
        btnCopiar.color = colores.badgeWork
        btnCopiar.text = 'Copiado!'
        setTimeout(() => {
          btnCopiar.color = colores.hudBotonTextColor
          btnCopiar.text = 'Copiar al portapapeles'
        }, 2000)
      }).catch(() => {})
    })
    panel.addControl(btnCopiar)

    const btnCerrarLog = GUI.Button.CreateSimpleButton('btnCerrarLogCompleto', 'Volver al resumen')
    btnCerrarLog.width = '200px'
    btnCerrarLog.height = '42px'
    btnCerrarLog.top = '280px'
    btnCerrarLog.left = '160px'
    btnCerrarLog.background = colores.primary
    btnCerrarLog.color = colores.primaryText
    btnCerrarLog.cornerRadius = 12
    btnCerrarLog.fontSize = 14
    btnCerrarLog.fontFamily = 'Comic Sans MS'
    btnCerrarLog.fontWeight = 'bold'
    btnCerrarLog.onPointerUpObservable.add(() => {
      fondo.dispose()
    })
    panel.addControl(btnCerrarLog)
  }

  aplicarTema(temaId) {
    const colores = temaService.obtenerColoresTema(temaId)

    if (this.scene) {
      this.scene.clearColor = colores.sceneBg
      this.scene.ambientColor = colores.ambientColor

      const hemisferica = this.scene.getLightByName('light1')
      if (hemisferica) {
        hemisferica.diffuse = colores.hemisfericaDiffuse
        hemisferica.groundColor = colores.hemisfericaGround
      }

      const luzPrincipal = this.scene.getLightByName('light2')
      if (luzPrincipal) {
        luzPrincipal.diffuse = colores.spotPrincipalDiffuse
        luzPrincipal.specular = colores.spotPrincipalSpecular
      }

      const luzContraste = this.scene.getLightByName('light3')
      if (luzContraste) {
        luzContraste.diffuse = colores.spotContrasteDiffuse
        luzContraste.specular = colores.spotContrasteSpecular
      }

      const luzAmbiente = this.scene.getLightByName('light4')
      if (luzAmbiente) {
        luzAmbiente.diffuse = colores.luzAmbienteDiffuse
      }

      const luzRelleno = this.scene.getLightByName('light5')
      if (luzRelleno) {
        luzRelleno.diffuse = colores.luzRellenoDiffuse
      }

      const materiales3D = [
        { nombre: 'matMesa', diffuse: colores.matMesa, specular: colores.matMesaSpecular, emissive: colores.matMesaEmissive },
        { nombre: 'matResplandorMesa', diffuse: colores.matResplandor, emissive: colores.matResplandorEmissive },
        { nombre: 'matTablero', diffuse: colores.matTablero, specular: colores.matTableroSpecular, emissive: colores.matTableroEmissive },
        { nombre: 'matTapete', diffuse: colores.matTapete, specular: colores.matTapeteSpecular, emissive: colores.matTapeteEmissive },
        { nombre: 'matMarcoInteriorTablero', diffuse: colores.matMarco, specular: colores.matMarcoSpecular, emissive: colores.matMarcoEmissive },
        { nombre: 'matPlataformaCarruselAccidente', diffuse: colores.matCarruselPlataforma, specular: new BABYLON.Color3(0.1, 0.06, 0.04), emissive: colores.matMesaEmissive },
        { nombre: 'matSelloCarruselAccidente', diffuse: colores.matCarruselSello, emissive: colores.matCarruselSelloEmissive }
      ]

      materiales3D.forEach(mat => {
        const material = this.scene.getMaterialByName(mat.nombre)
        if (material) {
          material.diffuseColor = mat.diffuse
          if (mat.specular) material.specularColor = mat.specular
          if (mat.emissive) material.emissiveColor = mat.emissive
        }
      })

      for (let i = 0; i < 8; i++) {
        const matCara = this.scene.getMaterialByName(`matCaraCartaCarrusel_${i}`)
        if (matCara) {
          const colorIdx = i % colores.matCartaCara.length
          const colorCarta = colores.matCartaCara[colorIdx]
          matCara.diffuseColor = colorCarta
          matCara.emissiveColor = colorCarta.scale(0.05)
        }
      }

      const lineaVertical = this.scene.getMaterialByName('mat_lineaVerticalCentro')
      if (lineaVertical) {
        lineaVertical.diffuseColor = colores.matLinea
        lineaVertical.emissiveColor = colores.matLineaEmissive
      }
      const lineaHorizontal = this.scene.getMaterialByName('mat_lineaHorizontalCentro')
      if (lineaHorizontal) {
        lineaHorizontal.diffuseColor = colores.matLinea
        lineaHorizontal.emissiveColor = colores.matLineaEmissive
      }
      ['lineaNorte', 'lineaSur', 'lineaOeste', 'lineaEste'].forEach(nombre => {
        const mat = this.scene.getMaterialByName(`mat_${nombre}`)
        if (mat) {
          mat.diffuseColor = colores.matLineaSecundaria
          mat.emissiveColor = colores.matLineaSecundaria.scale(0.1)
        }
      })

      const zonaAcc = this.scene.getMaterialByName('mat_zonaAccidente')
      if (zonaAcc) {
        zonaAcc.diffuseColor = colores.matZonaAccidente
        zonaAcc.emissiveColor = colores.matZonaAccidente.scale(0.16)
      }
    }

    if (this.guiTexture) {
      const panelEncabezado = this.guiTexture.getControlByName('panelEncabezadoPartida')
      if (panelEncabezado) {
        panelEncabezado.background = colores.hudPanelBg
        panelEncabezado.color = colores.hudBorderColor
      }

      const tituloPartida = this.guiTexture.getControlByName('tituloPartida')
      if (tituloPartida) tituloPartida.color = colores.hudTextColor

      const subtitulo = this.guiTexture.getControlByName('subtituloPartida')
      if (subtitulo) subtitulo.color = colores.hudSubtextColor

      for (let i = 0; i < 4; i++) {
        const estado = this.guiTexture.getControlByName(`estado_${i}`)
        if (estado) {
          estado.background = colores.hudEstadoBg[i] || colores.hudEstadoBg[0]
          const texto = estado.children[0]
          if (texto) texto.color = colores.hudTextColor
        }
      }

      const barraContenedor = this.guiTexture.getControlByName('barraProgresoContenedor')
      if (barraContenedor) {
        barraContenedor.background = colores.hudProgresoBg
        barraContenedor.color = colores.hudBorderColor
      }

      const barra = this.guiTexture.getControlByName('barraProgreso')
      if (barra) {
        barra.background = colores.hudProgresoColor
      }

      const textoProgreso = this.guiTexture.getControlByName('textoProgreso')
      if (textoProgreso) textoProgreso.color = colores.hudTextColor

      const btnVolver = this.guiTexture.getControlByName('btnVolverPartida')
      if (btnVolver) {
        btnVolver.background = colores.hudBotonVolverBg
        btnVolver.color = colores.hudBotonTextColor
        btnVolver.borderColor = colores.hudBorderColor
      }

      const btnReiniciar = this.guiTexture.getControlByName('btnReiniciarPartida')
      if (btnReiniciar) {
        btnReiniciar.background = colores.hudBotonReiniciarBg
        btnReiniciar.color = colores.hudBotonTextColor
        btnReiniciar.borderColor = colores.hudBorderColor
      }

      const contenedorIntercambio = this.guiTexture.getControlByName('contenedorZonaIntercambio')
      if (contenedorIntercambio) {
        contenedorIntercambio.background = colores.hudCartaBg
        contenedorIntercambio.color = colores.hudCartaBorder
      }

      const iconoZona = this.guiTexture.getControlByName('iconoZonaIntercambio')
      if (iconoZona) iconoZona.color = colores.hudZonaIntercambioIcono

      const textoZona = this.guiTexture.getControlByName('textoZonaIntercambio')
      if (textoZona) textoZona.color = colores.hudZonaIntercambioIcono

      const panelCartas = this.guiTexture.getControlByName('panelCartas')
      if (panelCartas) {
        panelCartas.background = colores.hudCartaBg
        panelCartas.color = colores.hudCartaBorder
      }
    }

    if (this.texturaNombreJugador) {
      this.texturaNombreJugador.drawText(this.nombreJugador, null, 48, colores.nombreJugadorColor, 'rgba(0,0,0,0)', true)
    }
  }
}
