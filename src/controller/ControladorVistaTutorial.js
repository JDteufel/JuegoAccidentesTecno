export class ControladorVistaTutorial {
  constructor(vistaTutorial, vistaInicio) {
    this.vistaTutorial = vistaTutorial
    this.vistaInicio = vistaInicio
  }

  init() {
    this.vistaTutorial.onCerrar(() => {
      this.vistaTutorial.ocultar()
    })
  }
}
