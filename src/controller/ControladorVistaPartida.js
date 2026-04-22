import { PANTALLAS } from '../model/EstadoApp.js'
import { seleccionarAccidentesAleatorios } from '../model/Accidente.js'
import { seleccionarPerfilAleatorio, seleccionarPerfilAleatorioExcluyendo } from '../model/Perfil.js'
import { seleccionarCartasAleatorias } from '../model/Carta.js'

export class ControladorVistaPartida {
  constructor(vistaPartida, controladorEstadoApp) {
    this.vistaPartida = vistaPartida
    this.controladorEstadoApp = controladorEstadoApp

    this.accidentesSeleccionados = []
    this.perfilAsignado = null
    this.cartasMano = []
  }

  init() {
    this.vistaPartida.onVolver(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.GESTION_LOBBY)
    })
  }

  iniciarPartida() {
    this.accidentesSeleccionados = seleccionarAccidentesAleatorios(8)

    const perfilesUsados = this.obtenerPerfilesUsados()
    this.perfilAsignado = perfilesUsados.length > 0
      ? seleccionarPerfilAleatorioExcluyendo(perfilesUsados)
      : seleccionarPerfilAleatorio()

    this.controladorEstadoApp.agregarPerfilAsignado(this.perfilAsignado)

    this.cartasMano = seleccionarCartasAleatorias(5, this.perfilAsignado.categoriasValidas)

    this.vistaPartida.configurarAccidentes(this.accidentesSeleccionados)
    this.vistaPartida.configurarPerfil(this.perfilAsignado)
    this.vistaPartida.configurarCartas(this.cartasMano)
  }

  obtenerPerfilesUsados() {
    return this.controladorEstadoApp.obtenerPerfilesAsignados()
  }

  getPerfilAsignado() {
    return this.perfilAsignado
  }

  getAccidentesSeleccionados() {
    return this.accidentesSeleccionados
  }

  getCartasMano() {
    return this.cartasMano
  }
}
