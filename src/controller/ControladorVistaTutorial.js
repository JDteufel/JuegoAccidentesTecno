export class ControladorVistaTutorial {
  constructor(vistaTutorial) {
    this.vistaTutorial = vistaTutorial
  }

  init() {
    this.vistaTutorial.alCerrar(() => {
      this.vistaTutorial.ocultar()
    })
  }
}

