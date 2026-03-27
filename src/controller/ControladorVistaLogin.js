export class ControladorVistaLogin {
  constructor(vistaLogin, vistaInicio, vistaCrearJuego) {
    this.vistaLogin = vistaLogin
    this.vistaInicio = vistaInicio
    this.vistaCrearJuego = vistaCrearJuego
  }

  init() {
    this.vistaLogin.onVolver(() => {
      this.vistaLogin.ocultar()
      this.vistaInicio.mostrar()
    })

    this.vistaLogin.onAccion(() => {
      this.vistaLogin.ocultar()
      this.vistaCrearJuego.mostrar()
    })
  }
}
