import { VistaInicio } from './view/VistaInicio.js'
import { ControladorVistaInicio } from './controller/ControladorVistaInicio.js'
import { ControladorVistaTutorial } from './controller/ControladorVistaTutorial.js'

const canvas = document.getElementById('renderCanvas')

if (!canvas) {
  throw new Error('No se encontro el canvas')
}

const vistaInicio = new VistaInicio(canvas)
vistaInicio.render()

const controladorVistaInicio = new ControladorVistaInicio(vistaInicio)
const controladorTutorial = new ControladorVistaTutorial(
  vistaInicio.vistaTutorial,
  vistaInicio
)

controladorVistaInicio.init()
controladorTutorial.init()
