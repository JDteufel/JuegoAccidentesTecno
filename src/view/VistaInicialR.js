import { VistaPanelBase } from './base/VistaPanelBase.js'

export class VistaInicialR extends VistaPanelBase {
  constructor(gui) {
    super(gui)
    this.onCrearJuego = null
    this.onTutorial = null
    this.onReglas = null
  }

  crear() {
    const overlay = this.crearOverlay(
      'pantallaMenuInicialRegistrado',
      'rgba(12, 9, 8, 0.48)'
    )
    this.overlay = overlay

    const panelAcciones = this.crearTarjetaBase('panelAccionesMenuRegistrado')
    panelAcciones.width = '420px'
    panelAcciones.height = '410px'
    panelAcciones.left = '-34%'
    panelAcciones.top = '8%'
    panelAcciones.color = '#8a4a20'
    panelAcciones.background = 'rgba(28, 20, 18, 0.92)'
    panelAcciones.shadowBlur = 28
    overlay.addControl(panelAcciones)

    panelAcciones.addControl(
      this.crearTexto({
        nombre: 'tituloPanelAccionesRegistrado',
        texto: 'Menu de Usuario Registrado',
        tamano: 28,
        alto: '72px',
        top: '-135px',
        color: '#ffd9bd'
      })
    )

    panelAcciones.addControl(
      this.crearBoton({
        nombre: 'botonCrearJuegoRegistrado',
        texto: 'Crear juego',
        top: '-45px',
        width: '290px',
        fondo: '#d66a1f',
        color: '#fff7ef',
        callback: () => this.onCrearJuego && this.onCrearJuego()
      })
    )

    panelAcciones.addControl(
      this.crearBoton({
        nombre: 'botonTutorialRegistrado',
        texto: 'Tutorial',
        top: '30px',
        width: '290px',
        fondo: '#3c2d27',
        color: '#ffd6b7',
        callback: () => this.onTutorial && this.onTutorial()
      })
    )

    panelAcciones.addControl(
      this.crearBoton({
        nombre: 'botonReglasRegistrado',
        texto: 'Ver reglas',
        top: '105px',
        width: '290px',
        fondo: '#3c2d27',
        color: '#ffd6b7',
        callback: () => this.onReglas && this.onReglas()
      })
    )
  }

  setOnCrearJuego(callback) {
    this.onCrearJuego = callback
  }

  setOnTutorial(callback) {
    this.onTutorial = callback
  }

  setOnReglas(callback) {
    this.onReglas = callback
  }
}
