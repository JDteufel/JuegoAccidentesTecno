export class ControladorVistaInicioSesion {
  constructor(vistaInicioSesion, vistaInicio, vistaCrearJuego) {
    this.vistaInicioSesion = vistaInicioSesion
    this.vistaInicio = vistaInicio
    this.vistaCrearJuego = vistaCrearJuego
  }

  init() {
    this.vistaInicioSesion.alVolver(() => {
      this.vistaInicioSesion.ocultar()
      this.vistaInicio.mostrar()
    })

    this.vistaInicioSesion.alAccion(() => {
      this.vistaInicioSesion.ocultar()
      this.vistaCrearJuego.mostrar()
    })
  }
}
