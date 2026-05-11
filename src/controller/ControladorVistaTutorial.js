export class ControladorVistaTutorial {
  constructor(vistaTutorial) {
    this.vistaTutorial = vistaTutorial
  }

  init() {
    this.vistaTutorial.onCerrar(() => {
      this.vistaTutorial.ocultar()
    })
  }
}
