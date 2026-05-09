import { PANTALLAS } from '../model/EstadoApp.js'
import { seleccionarAccidentesAleatorios } from '../model/accidentes/index.js'
import { seleccionarPerfilAleatorio, seleccionarPerfilAleatorioExcluyendo } from '../model/perfiles/index.js'
import { seleccionarCartasAleatorias } from '../model/cartas/index.js'
import { seleccionarActividadesAleatorias } from '../model/actividades/index.js'
import { logEvent, exportarJSON, obtenerEstadisticas } from '../services/LogsService.js'

export class ControladorVistaPartida {
  constructor(vistaPartida, controladorEstadoApp) {
    this.vistaPartida = vistaPartida
    this.controladorEstadoApp = controladorEstadoApp

    this.accidentesSeleccionados = []
    this.accidentesActivosOrden = []
    this.perfilAsignado = null
    this.cartasMano = []
    this.cartasJugadas = []
    this.actividadesDisponibles = []
    this.jugadorActual = 1
    this.totalJugadores = 4
    this.turnoActivo = false
    this.accidenteActivo = false
    this.metricasUsoCartas = {}
    this.partidaIniciada = false
    this.turnoInicio = null
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
      this.intercambiarCartas(carta1, carta2)
    })

    this.vistaPartida.onActivarActividadGrupal((actividad) => {
      this.activarActividadGrupal(actividad)
    })
  }

  iniciarPartida() {
    this.accidentesSeleccionados = seleccionarAccidentesAleatorios(8)
    this.accidentesActivosOrden = []

    const perfilesUsados = this.obtenerPerfilesUsados()
    this.perfilAsignado = perfilesUsados.length > 0
      ? seleccionarPerfilAleatorioExcluyendo(perfilesUsados)
      : seleccionarPerfilAleatorio()

    this.controladorEstadoApp.agregarPerfilAsignado(this.perfilAsignado)

    this.cartasMano = seleccionarCartasAleatorias(3, this.perfilAsignado.categoriasValidas)
    this.cartasJugadas = []

    this.actividadesDisponibles = seleccionarActividadesAleatorias(3)

    this.jugadorActual = 1
    this.turnoActivo = true
    this.partidaIniciada = true
    this.turnoInicio = new Date()
    this.metricasUsoCartas = {}

    this.vistaPartida.configurarAccidentes(this.accidentesSeleccionados)
    this.vistaPartida.configurarPerfil(this.perfilAsignado)
    this.vistaPartida.configurarCartas(this.cartasMano)
    this.vistaPartida.configurarActividades(this.actividadesDisponibles)
    this.vistaPartida.jugadorActual = this.jugadorActual
    this.vistaPartida.totalJugadores = this.totalJugadores
    this.vistaPartida.actualizarEstadoTurno(this.jugadorActual, this.totalJugadores)
    this.vistaPartida.actualizarProgresoPerfil()

    logEvent('LOGS', 'start', {
      perfil: this.perfilAsignado.nombre,
      accidentes: this.accidentesSeleccionados.map(a => a.nombre),
      cartasIniciales: this.cartasMano.map(c => c.titulo)
    })
  }

  jugarCarta(carta) {
    if (!this.turnoActivo || this.accidenteActivo) return
    if (carta.estaDeshabilitada()) return

    if (!this.metricasUsoCartas[carta.titulo]) {
      this.metricasUsoCartas[carta.titulo] = 0
    }
    this.metricasUsoCartas[carta.titulo]++

    const horasAplicadas = carta.aplicarHoras(this.perfilAsignado)

    if (horasAplicadas > 0) {
      this.cartasJugadas.push(carta)
      carta.deshabilitar()
      this.vistaPartida.actualizarPanelCartas()
      this.vistaPartida.actualizarProgresoPerfil()

      logEvent('METRICAS', 'carta_jugada', {
        carta: carta.titulo,
        horas: horasAplicadas,
        categorias: carta.categorias,
        turno: this.jugadorActual
      })

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

    logEvent('LOGS', 'turno', { jugador: this.jugadorActual })

    const activado = this.verificarActivarAccidente()

    if (activado) {
      const accidente = activado.accidente
      const cartasAfectadas = accidente.aplicarEfecto(this.cartasMano)

      this.accidentesActivosOrden.push(accidente)

      this.vistaPartida.mostrarMensajeAccidente(accidente, cartasAfectadas)
      this.vistaPartida.actualizarPanelCartas()

      logEvent('METRICAS', 'accidente_activado', {
        accidente: accidente.nombre,
        nivel: accidente.nivel,
        cartasAfectadas: cartasAfectadas.negativas?.map(c => c.titulo) || [],
        cartasBeneficiadas: cartasAfectadas.positivas?.map(c => c.titulo) || []
      })

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

  intercambiarCartas(carta1, carta2) {
    if (!this.turnoActivo || this.accidenteActivo) return
    if (carta1.horas !== carta2.horas) {
      this.vistaPartida.mostrarMensaje('Las cartas deben tener la misma cantidad de horas para intercambiar')
      return
    }

    const indice1 = this.cartasMano.indexOf(carta1)
    if (indice1 === -1) return

    this.cartasMano[indice1] = carta2

    logEvent('METRICAS', 'carta_intercambiada', {
      cartaDada: carta1.titulo,
      cartaRecibida: carta2.titulo,
      horas: carta1.horas
    })

    this.vistaPartida.actualizarPanelCartas()
    this.vistaPartida.mostrarMensaje(`Intercambiaste ${carta1.titulo} por ${carta2.titulo}`)
  }

  activarActividadGrupal(actividad) {
    if (!this.turnoActivo || this.accidenteActivo) return

    actividad.activar()

    this.cartasMano.forEach(carta => {
      if (actividad.beneficiaCategoria(carta.categorias)) {
        if (carta.estaDeshabilitada()) {
          carta.activar()
        } else if (carta.degradada) {
          carta.activar()
        }
      }
    })

    this.perfilAsignado.agregarHoras(actividad.horasBeneficio, actividad.categoriasBeneficiadas[0])

    this.desactivarAccidenteMasAntiguo()

    logEvent('METRICAS', 'actividad_grupal', {
      actividad: actividad.nombre,
      categorias: actividad.categoriasBeneficiadas,
      horasBeneficio: actividad.horasBeneficio
    })

    this.vistaPartida.actualizarPanelCartas()
    this.vistaPartida.actualizarProgresoPerfil()
    this.vistaPartida.mostrarMensajeActividadGrupal(actividad)

    if (this.perfilAsignado.completado) {
      this.verificarVictoria()
    }
  }

  desactivarAccidenteMasAntiguo() {
    if (this.accidentesActivosOrden.length === 0) return

    const accidenteMasAntiguo = this.accidentesActivosOrden.shift()
    accidenteMasAntiguo.desactivar()

    logEvent('LOGS', 'accidente_desactivado', {
      accidente: accidenteMasAntiguo.nombre,
      razon: 'actividad_grupal'
    })

    this.vistaPartida.actualizarAccidentes(this.accidentesSeleccionados)
  }

  verificarVictoria() {
    if (this.perfilAsignado.completado) {
      this.turnoActivo = false
      this.partidaIniciada = false
      this.finalizarPartida()
      this.vistaPartida.mostrarMensajeFinal('Perfil completado! Has terminado tu trabajo.')
    }
  }

  finalizarPartida() {
    const duracion = this.turnoInicio
      ? Math.round((new Date() - this.turnoInicio) / 1000)
      : 0

    logEvent('LOGS', 'end', {
      perfil: this.perfilAsignado.nombre,
      duracionSegundos: duracion,
      cartasJugadas: this.cartasJugadas.length,
      accidentesActivados: this.accidentesActivosOrden.length
    })

    logEvent('METRICAS', 'partida_duracion', {
      duracionSegundos: duracion,
      perfil: this.perfilAsignado.nombre
    })

    Object.entries(this.metricasUsoCartas).forEach(([carta, cantidad]) => {
      logEvent('METRICAS', 'carta_uso', { carta, cantidad })
    })

    const estadisticas = obtenerEstadisticas()
    logEvent('METRICAS', 'estadisticas_finales', estadisticas)

    const logJSON = exportarJSON()
    console.log('[ControladorVistaPartida] Log completo de la partida:', logJSON)

    this.vistaPartida.mostrarLogFinal(logJSON)
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
