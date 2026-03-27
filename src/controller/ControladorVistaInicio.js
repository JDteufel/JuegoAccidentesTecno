export class ControladorVistaInicio {
  constructor(vistaInicio) {
    this.vistaInicio = vistaInicio
  }

  init() {
    console.log('ControladorVistaInicio activo')

    this.vistaInicio.setOnTutorial(() => {
      console.log('CLICK EN TUTORIAL')
      this.vistaInicio.vistaTutorial.mostrar()
    })
  }
}
