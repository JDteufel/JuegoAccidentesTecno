import { PANTALLAS } from '../model/EstadoApp.js'
import { seleccionarAccidentesAleatorios } from '../model/accidentes/index.js'
import { seleccionarPerfilAleatorio } from '../model/perfiles/index.js'
import { seleccionarCartasAleatorias } from '../model/cartas/index.js'

export class ControladorVistaPartidaPrueba {
  constructor(vistaPartidaPrueba, controladorEstadoApp) {
    this.vistaPartidaPrueba = vistaPartidaPrueba
    this.controladorEstadoApp = controladorEstadoApp

    this.accidentesSeleccionados = []
    this.perfilAsignado = null
    this.cartasMano = []
    this.jugadorActual = 1
    this.totalJugadores = 4
    this.turnoActivo = false
    this.accidenteActivo = false
    this.partidaIniciada = false
  }

  init() {
    this.vistaPartidaPrueba.onVolver(() => {
      this.controladorEstadoApp.irAPantalla(PANTALLAS.INICIAL_GAMEMASTER)
    })

    this.vistaPartidaPrueba.onJugarCarta((carta) => {
      this.jugarCarta(carta)
    })

    this.vistaPartidaPrueba.onFinTurno(() => {
      this.finTurno()
    })

    this.vistaPartidaPrueba.onActivarAccidente(() => {
      this.activarAccidenteManual()
    })

    this.vistaPartidaPrueba.onReiniciar(() => {
      this.reiniciarPartida()
    })

    this.vistaPartidaPrueba.onPasarTurno(() => {
      this.pasarTurno()
    })
  }

  iniciarPartida() {
    if (this.partidaIniciada) return

    this.accidentesSeleccionados = seleccionarAccidentesAleatorios(8)

    this.perfilAsignado = seleccionarPerfilAleatorio()

    this.cartasMano = seleccionarCartasAleatorias(8, this.perfilAsignado.categoriasValidas)

    this.jugadorActual = 1
    this.turnoActivo = true
    this.partidaIniciada = true

    this.vistaPartidaPrueba.actualizarAccidentes(this.accidentesSeleccionados)
    this.vistaPartidaPrueba.actualizarPerfil(this.perfilAsignado)
    this.vistaPartidaPrueba.actualizarCartas(this.cartasMano)
    this.vistaPartidaPrueba.actualizarTurno(this.jugadorActual)

    this.vistaPartidaPrueba.mostrarMensaje('Partida de prueba iniciada. ¡Juega cartas y prueba las mecánicas!')
  }

  jugarCarta(carta) {
    if (!this.turnoActivo || this.accidenteActivo) return
    if (carta.estaDeshabilitada()) return

    if (!this.perfilAsignado.cartaEsValida(carta.categorias)) {
      this.vistaPartidaPrueba.mostrarMensaje(`La carta ${carta.titulo} no es válida para tu perfil (${this.perfilAsignado.nombre}). Categorías válidas: ${this.perfilAsignado.categoriasValidas.join(', ')}`)
      return
    }

    const indiceCarta = this.cartasMano.indexOf(carta)

    const horasAplicadas = carta.aplicarHoras(this.perfilAsignado)

    if (horasAplicadas > 0) {
      carta.deshabilitar()

      this.vistaPartidaPrueba.animarCartaJugada(indiceCarta, () => {
        this.vistaPartidaPrueba.actualizarCartas(this.cartasMano)
      })

      this.vistaPartidaPrueba.actualizarPerfil(this.perfilAsignado)
      this.vistaPartidaPrueba.actualizarProgresoPerfil()

      this.vistaPartidaPrueba.mostrarMensaje(`Carta ${carta.titulo} jugada. +${horasAplicadas} horas aplicadas.`)

      if (this.perfilAsignado.completado) {
        this.verificarVictoria()
      }
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

      this.vistaPartidaPrueba.actualizarCartas(this.cartasMano)
      this.vistaPartidaPrueba.actualizarAccidentes(this.accidentesSeleccionados)

      this.vistaPartidaPrueba.animarAccidenteActivado(accidente, () => {
        this.accidenteActivo = false
        this.siguienteTurno()
      })
    } else {
      this.accidenteActivo = false
      this.vistaPartidaPrueba.mostrarMensaje('No se activó ningún accidente este turno.')
      setTimeout(() => {
        this.siguienteTurno()
      }, 1500)
    }
  }

  activarAccidenteManual() {
    if (!this.partidaIniciada) return

    const disponibles = this.accidentesSeleccionados.filter(a => !a.activo)
    if (disponibles.length === 0) {
      this.vistaPartidaPrueba.mostrarMensaje('Todos los accidentes ya fueron activados.')
      return
    }

    const indice = Math.floor(Math.random() * disponibles.length)
    const accidente = disponibles[indice]
    accidente.activar()

    const cartasAfectadas = accidente.aplicarEfecto(this.cartasMano)

    this.vistaPartidaPrueba.actualizarCartas(this.cartasMano)
    this.vistaPartidaPrueba.actualizarAccidentes(this.accidentesSeleccionados)

    this.vistaPartidaPrueba.animarAccidenteActivado(accidente)
  }

  pasarTurno() {
    if (!this.turnoActivo) return
    this.finTurno()
  }

  siguienteTurno() {
    this.jugadorActual++
    this.turnoActivo = true
    this.vistaPartidaPrueba.actualizarTurno(this.jugadorActual)
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
      this.vistaPartidaPrueba.mostrarMensaje('¡Perfil completado! Has terminado tu trabajo. ¡Victoria!', 8000)
    }
  }

  reiniciarPartida() {
    this.accidentesSeleccionados.forEach(a => a.activo = false)
    this.accidentesSeleccionados = []
    this.perfilAsignado = null
    this.cartasMano = []
    this.jugadorActual = 1
    this.turnoActivo = false
    this.accidenteActivo = false
    this.partidaIniciada = false

    this.iniciarPartida()
    this.vistaPartidaPrueba.mostrarMensaje('Partida reiniciada con nuevos elementos.')
  }
}
