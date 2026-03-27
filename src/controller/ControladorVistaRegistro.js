export class ControladorVistaRegistro {
  constructor(vistaRegistro, vistaInicio, vistaCrearJuego) {
    this.vistaRegistro = vistaRegistro
    this.vistaInicio = vistaInicio
    this.vistaCrearJuego = vistaCrearJuego
  }

  init() {
    this.vistaRegistro.onVolver(() => {
      this.vistaRegistro.ocultar()
      this.vistaInicio.mostrar()
    })

    this.vistaRegistro.onAccion(() => {
      this.vistaRegistro.ocultar()
      this.vistaCrearJuego.mostrar()
    })
  }
}
