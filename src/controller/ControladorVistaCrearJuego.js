export class ControladorVistaCrearJuego {
  constructor(vistaCrearJuego, vistaInicio) {
    this.vistaCrearJuego = vistaCrearJuego
    this.vistaInicio = vistaInicio
  }

  init() {
    this.vistaCrearJuego.onVolver(() => {
      this.vistaCrearJuego.ocultar()
      this.vistaInicio.mostrar()
    })
  }
}
