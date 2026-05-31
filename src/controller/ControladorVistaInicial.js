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
    this.vistaInicial.onTutorial(() => {
      this.vistaTutorial.mostrar()
    })

    this.vistaInicial.onRegistro(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.REGISTRO)
    })

    this.vistaInicial.onInicioSesion(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.INICIO_SESION)
    })

    this.vistaInicial.onJugar(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.UNIRSE_LOBBY)
    })

    this.vistaInicial.onReglas(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.REGLAS)
    })

    this.vistaInicial.onConfiguracion(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.CONFIGURACION)
    })

    this.vistaInicial.onEncuesta(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.ENCUESTA)
    })
  }
}
