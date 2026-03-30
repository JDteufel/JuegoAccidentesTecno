export class ControladorVistaInicio {
  constructor(
    vistaInicio,
    vistaTutorial,
    vistaRegistro,
    vistaInicioSesion,
    vistaJugar,
    vistaReglas,
    vistaCrearJuego
  ) {
    this.vistaInicio = vistaInicio
    this.vistaTutorial = vistaTutorial
    this.vistaRegistro = vistaRegistro
    this.vistaInicioSesion = vistaInicioSesion
    this.vistaJugar = vistaJugar
    this.vistaReglas = vistaReglas
    this.vistaCrearJuego = vistaCrearJuego
  }

  init() {
    this.vistaInicio.setOnTutorial(() => {
      this.vistaTutorial.mostrar()
    })

    this.vistaInicio.setOnRegistro(() => {
      this.vistaInicio.ocultar()
      this.vistaRegistro.mostrar()
    })

    this.vistaInicio.setOnInicioSesion(() => {
      this.vistaInicio.ocultar()
      this.vistaInicioSesion.mostrar()
    })

    this.vistaInicio.setOnJugar(() => {
      this.vistaInicio.ocultar()
      this.vistaJugar.mostrar()
    })

    this.vistaInicio.setOnReglas(() => {
      this.vistaInicio.ocultar()
      this.vistaReglas.mostrar()
    })

    this.vistaInicio.setOnCrearJuego(() => {
      this.vistaInicio.ocultar()
      this.vistaCrearJuego.mostrar()
    })
  }
}

