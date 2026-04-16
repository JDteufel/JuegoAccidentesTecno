import { PANTALLAS } from '../model/EstadoApp.js'

export class ControladorEstadoApp {
  constructor(estadoApp, vistas) {
    this.estadoApp = estadoApp
    this.vistas = vistas
  }

  actualizarVista() {
    this.ocultarVistasPrimarias()

    switch (this.estadoApp.pantallaActual) {
      case PANTALLAS.INICIAL_PUBLICA:
        this.vistas.vistaInicial.mostrar()
        break
      case PANTALLAS.INICIAL_REGISTRADO:
        this.vistas.vistaInicialR.mostrar()
        break
      case PANTALLAS.REGISTRO:
        this.vistas.vistaRegistro.mostrar()
        break
      case PANTALLAS.INICIO_SESION:
        this.vistas.vistaInicioSesion.mostrar()
        break
      case PANTALLAS.UNIRSE_LOBBY:
        this.vistas.vistaJugar.mostrar()
        break
      case PANTALLAS.GESTION_LOBBY:
        this.vistas.vistaCrearJuego.mostrar()
        break
      case PANTALLAS.REGLAS:
        this.vistas.vistaReglas.mostrar()
        break
      case PANTALLAS.CARTAS:
        this.vistas.vistaCartas.mostrar()
        break
      case PANTALLAS.ACCIDENTES:
        this.vistas.vistaAccidentes.mostrar()
        break
      case PANTALLAS.PARTIDA:
        this.vistas.vistaPartida.mostrar()
        break
      default:
        this.vistas.vistaInicial.mostrar()
        break
    }
  }

  irAPantalla(pantalla) {
    this.estadoApp.setPantalla(pantalla)
    this.actualizarVista()
  }

  regresarPantallaAnterior() {
    this.estadoApp.regresarPantallaAnterior()
    this.actualizarVista()
  }

  ocultarVistasPrimarias() {
    this.vistas.vistaInicial.ocultar()
    this.vistas.vistaInicialR.ocultar()
    this.vistas.vistaRegistro.ocultar()
    this.vistas.vistaInicioSesion.ocultar()
    this.vistas.vistaJugar.ocultar()
    this.vistas.vistaReglas.ocultar()
    this.vistas.vistaCrearJuego.ocultar()
    this.vistas.vistaCartas.ocultar()
    this.vistas.vistaAccidentes.ocultar()
    this.vistas.vistaPartida.ocultar()
  }
}
