export class ControladorVistaInicio {
  constructor(vistaInicio) {
    this.vistaInicio = vistaInicio
  }

  init() {
    this.vistaInicio.setOnTutorial(() => {
      this.vistaInicio.vistaTutorial.mostrar()
    })

    this.vistaInicio.setOnRegistro(() => {
      this.vistaInicio.ocultar()
      this.vistaInicio.vistaRegistro.mostrar()
    })

    this.vistaInicio.setOnLogin(() => {
      this.vistaInicio.ocultar()
      this.vistaInicio.vistaLogin.mostrar()
    })

    this.vistaInicio.setOnJugar(() => {
      this.vistaInicio.ocultar()
      this.vistaInicio.vistaJugar.mostrar()
    })

    this.vistaInicio.setOnReglas(() => {
      this.vistaInicio.ocultar()
      this.vistaInicio.vistaReglas.mostrar()
    })

    this.vistaInicio.setOnCrearJuego(() => {
      this.vistaInicio.ocultar()
      this.vistaInicio.vistaCrearJuego.mostrar()
    })
  }
}
