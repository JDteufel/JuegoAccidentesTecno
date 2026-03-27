import { VistaInicio } from './view/VistaInicio.js'
import { ControladorVistaInicio } from './controller/ControladorVistaInicio.js'
import { ControladorVistaTutorial } from './controller/ControladorVistaTutorial.js'
import { ControladorVistaRegistro } from './controller/ControladorVistaRegistro.js'
import { ControladorVistaLogin } from './controller/ControladorVistaLogin.js'
import { ControladorVistaJugar } from './controller/ControladorVistaJugar.js'
import { ControladorVistaReglas } from './controller/ControladorVistaReglas.js'
import { ControladorVistaCrearJuego } from './controller/ControladorVistaCrearJuego.js'

const canvas = document.getElementById('renderCanvas')

if (!canvas) {
  throw new Error('No se encontró el canvas')
}

const vistaInicio = new VistaInicio(canvas)
vistaInicio.render()

const controladorVistaInicio = new ControladorVistaInicio(vistaInicio)
const controladorTutorial = new ControladorVistaTutorial(
  vistaInicio.vistaTutorial,
  vistaInicio
)
const controladorRegistro = new ControladorVistaRegistro(
  vistaInicio.vistaRegistro,
  vistaInicio,
  vistaInicio.vistaCrearJuego
)
const controladorLogin = new ControladorVistaLogin(
  vistaInicio.vistaLogin,
  vistaInicio,
  vistaInicio.vistaCrearJuego
)
const controladorJugar = new ControladorVistaJugar(
  vistaInicio.vistaJugar,
  vistaInicio,
  vistaInicio.vistaCrearJuego
)
const controladorReglas = new ControladorVistaReglas(
  vistaInicio.vistaReglas,
  vistaInicio
)
const controladorCrearJuego = new ControladorVistaCrearJuego(
  vistaInicio.vistaCrearJuego,
  vistaInicio
)

controladorVistaInicio.init()
controladorTutorial.init()
controladorRegistro.init()
controladorLogin.init()
controladorJugar.init()
controladorReglas.init()
controladorCrearJuego.init()
