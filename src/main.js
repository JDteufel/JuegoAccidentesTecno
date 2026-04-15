import { VistaInicial } from './view/VistaInicial.js'
import { VistaInicialR } from './view/VistaInicialR.js'
import { VistaTutorial } from './view/VistaTutorial.js'
import { VistaRegistro } from './view/VistaRegistro.js'
import { VistaInicioSesion } from './view/VistaInicioSesion.js'
import { VistaJugar } from './view/VistaJugar.js'
import { VistaReglas } from './view/VistaReglas.js'
import { VistaCrearJuego } from './view/VistaCrearJuego.js'
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
import { testSmartFoxPing, getSmartFoxInstance } from './services/SmartFoxService.js'
import { initLogsService } from './services/LogsService.js'

const canvas = document.getElementById('renderCanvas')

if (!canvas) {
  throw new Error('No se encontró el canvas')
}

const vistaInicial = new VistaInicial(canvas)
const TARGET_FPS = 60
vistaInicial.render(TARGET_FPS)

const vistaInicialR = new VistaInicialR(vistaInicial.gui)
vistaInicialR.crear()
const vistaTutorial = new VistaTutorial(vistaInicial.gui)
vistaTutorial.crear()
const vistaRegistro = new VistaRegistro(vistaInicial.gui)
vistaRegistro.crear()
const vistaInicioSesion = new VistaInicioSesion(vistaInicial.gui)
vistaInicioSesion.crear()
const vistaJugar = new VistaJugar(vistaInicial.gui)
vistaJugar.crear()
const vistaReglas = new VistaReglas(vistaInicial.gui)
vistaReglas.crear()
const vistaCrearJuego = new VistaCrearJuego(vistaInicial.gui)
vistaCrearJuego.crear()

const estadoApp = new EstadoApp()
const controladorEstadoApp = new ControladorEstadoApp(estadoApp, {
  vistaInicial,
  vistaInicialR,
  vistaRegistro,
  vistaInicioSesion,
  vistaJugar,
  vistaReglas,
  vistaCrearJuego
})

const controladorVistaInicial = new ControladorVistaInicial(
  vistaInicial,
  vistaTutorial,
  controladorEstadoApp
)

const controladorVistaInicialR = new ControladorVistaInicialR(
  vistaInicialR,
  vistaTutorial,
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

controladorVistaInicial.init()
controladorVistaInicialR.init()
controladorTutorial.init()
controladorRegistro.init()
controladorInicioSesion.init()
controladorJugar.init()
controladorReglas.init()
controladorCrearJuego.init()
controladorEstadoApp.actualizarVista()

testSmartFoxPing()
  .then((response) => {
    console.log('[SmartFox ping]', response)
    // Inicializar LoggingService con la instancia de SmartFox
    const sfs = getSmartFoxInstance()
    if (sfs) {
      initLogsService(sfs)
    }
  })
  .catch((error) => {
    console.error('[SmartFox ping error]', error)
  })

