import { PANTALLAS } from '../model/EstadoApp.js'

export class ControladorVistaInicial {
  constructor(
    vistaInicial,
    vistaTutorial,
    controladorEstadoApp
  ) {
    this.vistaInicial = vistaInicial
    this.vistaTutorial = vistaTutorial
    this.controladorEstadoApp = controladorEstadoApp
  }

  init() {
    this.vistaInicial.setOnTutorial(() => {
      this.vistaTutorial.mostrar()
    })

    this.vistaInicial.setOnRegistro(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.REGISTRO)
    })

    this.vistaInicial.setOnInicioSesion(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.INICIO_SESION)
    })

    this.vistaInicial.setOnJugar(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.UNIRSE_LOBBY)
    })

    this.vistaInicial.setOnReglas(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.REGLAS)
    })
  }
}
