import { PANTALLAS } from '../model/EstadoApp.js'

export class ControladorVistaInicialR {
  constructor(
    vistaInicialR,
    vistaTutorial,
    controladorEstadoApp
  ) {
    this.vistaInicialR = vistaInicialR
    this.vistaTutorial = vistaTutorial
    this.controladorEstadoApp = controladorEstadoApp
  }

  init() {
    this.vistaInicialR.setOnTutorial(() => {
      this.vistaTutorial.mostrar()
    })

    this.vistaInicialR.setOnReglas(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.REGLAS)
    })

    this.vistaInicialR.setOnCrearJuego(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.GESTION_LOBBY)
    })
  }
}
