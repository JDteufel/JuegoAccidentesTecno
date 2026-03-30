import { VistaInicio } from './view/VistaInicio.js'
import { VistaTutorial } from './view/VistaTutorial.js'
import { VistaRegistro } from './view/VistaRegistro.js'
import { VistaInicioSesion } from './view/VistaInicioSesion.js'
import { VistaJugar } from './view/VistaJugar.js'
import { VistaReglas } from './view/VistaReglas.js'
import { VistaCrearJuego } from './view/VistaCrearJuego.js'
import { ControladorVistaInicio } from './controller/ControladorVistaInicio.js'
import { ControladorVistaTutorial } from './controller/ControladorVistaTutorial.js'
import { ControladorVistaRegistro } from './controller/ControladorVistaRegistro.js'
import { ControladorVistaInicioSesion } from './controller/ControladorVistaInicioSesion.js'
import { ControladorVistaJugar } from './controller/ControladorVistaJugar.js'
import { ControladorVistaReglas } from './controller/ControladorVistaReglas.js'
import { ControladorVistaCrearJuego } from './controller/ControladorVistaCrearJuego.js'

const canvas = document.getElementById('renderCanvas')

if (!canvas) {
  throw new Error('No se encontró el canvas')
}

const vistaInicio = new VistaInicio(canvas)
const TARGET_FPS = 60
vistaInicio.render(TARGET_FPS)

const vistaTutorial = new VistaTutorial(vistaInicio.gui)
vistaTutorial.crear()
const vistaRegistro = new VistaRegistro(vistaInicio.gui)
vistaRegistro.crear()
const vistaInicioSesion = new VistaInicioSesion(vistaInicio.gui)
vistaInicioSesion.crear()
const vistaJugar = new VistaJugar(vistaInicio.gui)
vistaJugar.crear()
const vistaReglas = new VistaReglas(vistaInicio.gui)
vistaReglas.crear()
const vistaCrearJuego = new VistaCrearJuego(vistaInicio.gui)
vistaCrearJuego.crear()

const controladorVistaInicio = new ControladorVistaInicio(
  vistaInicio,
  vistaTutorial,
  vistaRegistro,
  vistaInicioSesion,
  vistaJugar,
  vistaReglas,
  vistaCrearJuego
)

const controladorTutorial = new ControladorVistaTutorial(vistaTutorial)

const controladorRegistro = new ControladorVistaRegistro(
  vistaRegistro,
  vistaInicio,
  vistaCrearJuego
)

const controladorInicioSesion = new ControladorVistaInicioSesion(
  vistaInicioSesion,
  vistaInicio,
  vistaCrearJuego
)

const controladorJugar = new ControladorVistaJugar(
  vistaJugar,
  vistaInicio,
  vistaCrearJuego
)

const controladorReglas = new ControladorVistaReglas(vistaReglas, vistaInicio)

const controladorCrearJuego = new ControladorVistaCrearJuego(
  vistaCrearJuego,
  vistaInicio
)

controladorVistaInicio.init()
controladorTutorial.init()
controladorRegistro.init()
controladorInicioSesion.init()
controladorJugar.init()
controladorReglas.init()
controladorCrearJuego.init()

