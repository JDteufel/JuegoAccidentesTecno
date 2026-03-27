export class ControladorVistaReglas {
  constructor(vistaReglas, vistaInicio) {
    this.vistaReglas = vistaReglas
    this.vistaInicio = vistaInicio
  }

  init() {
    this.vistaReglas.onVolver(() => {
      this.vistaReglas.ocultar()
      this.vistaInicio.mostrar()
    })
  }
}
