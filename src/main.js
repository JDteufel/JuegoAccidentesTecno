import { VistaInicial } from './view/VistaInicial.js'
import { VistaInicialR } from './view/VistaInicialR.js'
import { VistaTutorial } from './view/VistaTutorial.js'
import { VistaRegistro } from './view/VistaRegistro.js'
import { VistaInicioSesion } from './view/VistaInicioSesion.js'
import { VistaJugar } from './view/VistaJugar.js'
import { VistaReglas } from './view/VistaReglas.js'
import { VistaCrearJuego } from './view/VistaCrearJuego.js'
import { VistaGestion } from './view/VistaGestion.js'
import { VistaCartas } from './view/VistaCartas.js'
import { VistaAccidentes } from './view/VistaAccidentes.js'
import { VistaPartida } from './view/VistaPartida.js'
import { VistaPartidaPrueba } from './view/VistaPartidaPrueba.js'
import { EstadoApp } from './model/EstadoApp.js'
import { ControladorVistaInicial } from './controller/ControladorVistaInicial.js'
import { ControladorVistaInicialR } from './controller/ControladorVistaInicialR.js'
import { ControladorEstadoApp } from './controller/ControladorEstadoApp.js'
import { ControladorVistaTutorial } from './controller/ControladorVistaTutorial.js'
import { ControladorVistaRegistro } from './controller/ControladorVistaRegistro.js'
import { ControladorVistaInicioSesion } from './controller/ControladorVistaInicioSesion.js'
import { ControladorVistaJugar } from './controller/ControladorVistaJugar.js'
import { ControladorVistaReglas } from './controller/ControladorVistaReglas.js'
import { ControladorVistaCrearJuego } from './controller/ControladorVistaCrearJuego.js'
import { ControladorVistaGestion } from './controller/ControladorVistaGestion.js'
import { ControladorVistaCartas } from './controller/ControladorVistaCartas.js'
import { ControladorVistaAccidentes } from './controller/ControladorVistaAccidentes.js'
import { ControladorVistaPartida } from './controller/ControladorVistaPartida.js'
import { ControladorVistaPartidaPrueba } from './controller/ControladorVistaPartidaPrueba.js'
import { testSmartFoxPing, getSmartFoxInstance } from './services/SmartFoxService.js'
import { initLogsService } from './services/LogsService.js'

const canvas = document.getElementById('renderCanvas')

if (!canvas) {
  throw new Error('No se encontró el canvas')
}

const vistaInicial = new VistaInicial(canvas)
const TARGET_FPS = 60
vistaInicial.render(TARGET_FPS)

const vistaInicialR = new VistaInicialR()
vistaInicialR.crear()
const vistaTutorial = new VistaTutorial()
vistaTutorial.crear()
const vistaRegistro = new VistaRegistro()
vistaRegistro.crear()
const vistaInicioSesion = new VistaInicioSesion()
vistaInicioSesion.crear()
const vistaJugar = new VistaJugar()
vistaJugar.crear()
const vistaReglas = new VistaReglas()
vistaReglas.crear()
const vistaCrearJuego = new VistaCrearJuego()
vistaCrearJuego.crear()
const vistaGestion = new VistaGestion()
vistaGestion.crear()
const vistaCartas = new VistaCartas()
vistaCartas.crear()
const vistaAccidentes = new VistaAccidentes()
vistaAccidentes.crear()
const vistaPartida = new VistaPartida(canvas, vistaInicial.engine, vistaInicial.scene)
vistaPartida.crear()
const vistaPartidaPrueba = new VistaPartidaPrueba(canvas, vistaInicial.engine, vistaInicial.scene)
vistaPartidaPrueba.crear()

const estadoApp = new EstadoApp()

const controladorPartida = new ControladorVistaPartida(vistaPartida, null)
const controladorPartidaPrueba = new ControladorVistaPartidaPrueba(vistaPartidaPrueba, null)

const controladorEstadoApp = new ControladorEstadoApp(estadoApp, {
  vistaInicial,
  vistaInicialR,
  vistaRegistro,
  vistaInicioSesion,
  vistaJugar,
  vistaReglas,
  vistaCrearJuego,
  vistaGestion,
  vistaCartas,
  vistaAccidentes,
  vistaPartida,
  vistaPartidaPrueba
}, controladorPartida, controladorPartidaPrueba)

controladorPartida.controladorEstadoApp = controladorEstadoApp
controladorPartidaPrueba.controladorEstadoApp = controladorEstadoApp

const controladorVistaInicial = new ControladorVistaInicial(
  vistaInicial,
  vistaTutorial,
  controladorEstadoApp
)

const controladorVistaInicialR = new ControladorVistaInicialR(
  vistaInicialR,
  vistaTutorial,
  estadoApp,
  controladorEstadoApp
)

const controladorTutorial = new ControladorVistaTutorial(vistaTutorial)

const controladorRegistro = new ControladorVistaRegistro(vistaRegistro, estadoApp, controladorEstadoApp)

const controladorInicioSesion = new ControladorVistaInicioSesion(
  vistaInicioSesion,
  estadoApp,
  controladorEstadoApp
)

const controladorJugar = new ControladorVistaJugar(vistaJugar, estadoApp, controladorEstadoApp)

const controladorReglas = new ControladorVistaReglas(vistaReglas, controladorEstadoApp)

const controladorCrearJuego = new ControladorVistaCrearJuego(
  vistaCrearJuego,
  estadoApp,
  controladorEstadoApp
)

const controladorGestion = new ControladorVistaGestion(
  vistaGestion,
  estadoApp,
  controladorEstadoApp
)

const controladorCartas = new ControladorVistaCartas(vistaCartas, controladorEstadoApp)

const controladorAccidentes = new ControladorVistaAccidentes(vistaAccidentes, controladorEstadoApp)

controladorVistaInicial.init()
controladorVistaInicialR.init()
controladorTutorial.init()
controladorRegistro.init()
controladorInicioSesion.init()
controladorJugar.init()
controladorReglas.init()
controladorCrearJuego.init()
controladorGestion.init()
controladorCartas.init()
controladorAccidentes.init()
controladorPartida.init()
controladorPartidaPrueba.init()
controladorEstadoApp.actualizarVista()

testSmartFoxPing()
  .then((response) => {
    console.log('[SmartFox ping]', response)

    const sfs = getSmartFoxInstance()
    if (sfs) {
      initLogsService(sfs)
    }
  })
  .catch((error) => {
    console.error('[SmartFox ping error]', error)
  })
