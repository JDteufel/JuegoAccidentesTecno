export class ControladorVistaJugar {
  constructor(vistaJugar, vistaInicio, vistaCrearJuego) {
    this.vistaJugar = vistaJugar
    this.vistaInicio = vistaInicio
    this.vistaCrearJuego = vistaCrearJuego
  }

  init() {
    this.vistaJugar.onVolver(() => {
      this.vistaJugar.ocultar()
      this.vistaInicio.mostrar()
    })

    this.vistaJugar.onAccion(() => {
      this.vistaJugar.ocultar()
      this.vistaCrearJuego.mostrar()
    })
  }
}
