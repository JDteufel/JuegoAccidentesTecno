import { PANTALLAS } from '../model/EstadoApp.js'
import { seleccionarAccidentesAleatorios } from '../model/accidentes/index.js'
import { seleccionarPerfilAleatorio, seleccionarPerfilAleatorioExcluyendo } from '../model/perfiles/index.js'
import { seleccionarCartasAleatorias } from '../model/cartas/index.js'

export class ControladorVistaPartida {
  constructor(vistaPartida, controladorEstadoApp) {
    this.vistaPartida = vistaPartida
    this.controladorEstadoApp = controladorEstadoApp

    this.accidentesSeleccionados = []
    this.perfilAsignado = null
    this.cartasMano = []
    this.jugadorActual = 1
    this.totalJugadores = 4
    this.turnoActivo = false
    this.accidenteActivo = false
  }

  init() {
    this.vistaPartida.onVolver(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.GESTION_LOBBY)
    })

    this.vistaPartida.onJugarCarta((carta) => {
      this.jugarCarta(carta)
    })

    this.vistaPartida.onFinTurno(() => {
      this.finTurno()
    })

    this.vistaPartida.onPasarTurno(() => {
      this.pasarTurno()
    })

    this.vistaPartida.onIntercambioCarta((carta1, carta2) => {
      console.log(`Intercambio: ${carta1.titulo} <-> ${carta2.titulo}`)
    })
  }

  iniciarPartida() {
    this.accidentesSeleccionados = seleccionarAccidentesAleatorios(8)

    const perfilesUsados = this.obtenerPerfilesUsados()
    this.perfilAsignado = perfilesUsados.length > 0
      ? seleccionarPerfilAleatorioExcluyendo(perfilesUsados)
      : seleccionarPerfilAleatorio()

    this.controladorEstadoApp.agregarPerfilAsignado(this.perfilAsignado)

    this.cartasMano = seleccionarCartasAleatorias(3, this.perfilAsignado.categoriasValidas)

    this.jugadorActual = 1
    this.turnoActivo = true

    this.vistaPartida.configurarAccidentes(this.accidentesSeleccionados)
    this.vistaPartida.configurarPerfil(this.perfilAsignado)
    this.vistaPartida.configurarCartas(this.cartasMano)
    this.vistaPartida.jugadorActual = this.jugadorActual
    this.vistaPartida.totalJugadores = this.totalJugadores
    this.vistaPartida.actualizarEstadoTurno(this.jugadorActual, this.totalJugadores)
    this.vistaPartida.actualizarProgresoPerfil()
  }

  jugarCarta(carta) {
    if (!this.turnoActivo || this.accidenteActivo) return
    if (carta.estaDeshabilitada()) return

    const horasAplicadas = carta.aplicarHoras(this.perfilAsignado)

    if (horasAplicadas > 0) {
      carta.deshabilitar()
      this.vistaPartida.actualizarPanelCartas()
      this.vistaPartida.actualizarProgresoPerfil()

      if (this.perfilAsignado.completado) {
        this.verificarVictoria()
      }
    } else {
      this.vistaPartida.actualizarPanelCartas()
    }
  }

  finTurno() {
    if (!this.turnoActivo) return

    this.turnoActivo = false
    this.accidenteActivo = true

    const activado = this.verificarActivarAccidente()

    if (activado) {
      const accidente = activado.accidente
      const cartasAfectadas = accidente.aplicarEfecto(this.cartasMano)

      this.vistaPartida.mostrarMensajeAccidente(accidente, cartasAfectadas)
      this.vistaPartida.actualizarPanelCartas()

      setTimeout(() => {
        this.accidenteActivo = false
        this.siguienteTurno()
      }, 5000)
    } else {
      this.accidenteActivo = false
      this.siguienteTurno()
    }
  }

  pasarTurno() {
    if (!this.turnoActivo) return
    this.finTurno()
  }

  siguienteTurno() {
    this.jugadorActual++
    if (this.jugadorActual > this.totalJugadores) {
      this.jugadorActual = 1
    }

    this.turnoActivo = true
    this.vistaPartida.jugadorActual = this.jugadorActual
    this.vistaPartida.totalJugadores = this.totalJugadores
    this.vistaPartida.actualizarEstadoTurno(this.jugadorActual, this.totalJugadores)
  }

  verificarActivarAccidente() {
    const probabilidad = 0.35
    if (Math.random() > probabilidad) return null

    const disponibles = this.accidentesSeleccionados.filter(a => !a.activo)
    if (disponibles.length === 0) return null

    const indice = Math.floor(Math.random() * disponibles.length)
    const accidente = disponibles[indice]
    accidente.activar()

    return { accidente }
  }

  verificarVictoria() {
    if (this.perfilAsignado.completado) {
      this.turnoActivo = false
      this.vistaPartida.mostrarMensajeFinal('Perfil completado! Has terminado tu trabajo.')
    }
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
