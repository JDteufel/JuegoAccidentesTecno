import { PANTALLAS } from '../model/EstadoApp.js'
import { seleccionarAccidentesAleatorios } from '../model/accidentes/index.js'
import { seleccionarPerfilAleatorio } from '../model/perfiles/index.js'
import { seleccionarCartasAleatorias } from '../model/cartas/index.js'
import { seleccionarActividadesAleatorias } from '../model/actividades/index.js'
import { logEvent, exportarJSON, obtenerEstadisticas } from '../services/LogsService.js'

export class ControladorVistaPartidaPrueba {
  constructor(vistaPartidaPrueba, controladorEstadoApp) {
    this.vistaPartidaPrueba = vistaPartidaPrueba
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
    this.partidaIniciada = false
    this.metricasUsoCartas = {}
    this.turnoInicio = null
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

    this.vistaPartidaPrueba.onIntercambioCarta((carta1, carta2) => {
      this.intercambiarCartas(carta1, carta2)
    })

    this.vistaPartidaPrueba.onActivarActividadGrupal((actividad) => {
      this.activarActividadGrupal(actividad)
    })
  }

  iniciarPartida(nombreJugador) {
    if (this.partidaIniciada) return

    this.accidentesSeleccionados = seleccionarAccidentesAleatorios(8)
    this.accidentesActivosOrden = []

    this.perfilAsignado = seleccionarPerfilAleatorio()

    this.cartasMano = seleccionarCartasAleatorias(8, this.perfilAsignado.categoriasValidas)
    this.cartasJugadas = []

    this.actividadesDisponibles = seleccionarActividadesAleatorias(3)

    this.jugadorActual = 1
    this.turnoActivo = true
    this.partidaIniciada = true
    this.turnoInicio = new Date()
    this.metricasUsoCartas = {}

    this.vistaPartidaPrueba.actualizarAccidentes(this.accidentesSeleccionados)
    this.vistaPartidaPrueba.actualizarPerfil(this.perfilAsignado)
    this.vistaPartidaPrueba.actualizarCartas(this.cartasMano)
    this.vistaPartidaPrueba.actualizarActividades(this.actividadesDisponibles)
    this.vistaPartidaPrueba.configurarNombreJugador(nombreJugador || 'GameMaster')
    this.vistaPartidaPrueba.actualizarTurno(this.jugadorActual)

    logEvent('LOGS', 'start', {
      modo: 'prueba',
      perfil: this.perfilAsignado.nombre,
      accidentes: this.accidentesSeleccionados.map(a => a.nombre)
    })

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

    if (!this.metricasUsoCartas[carta.titulo]) {
      this.metricasUsoCartas[carta.titulo] = 0
    }
    this.metricasUsoCartas[carta.titulo]++

    const horasAplicadas = carta.aplicarHoras(this.perfilAsignado)

    if (horasAplicadas > 0) {
      this.cartasJugadas.push(carta)
      carta.deshabilitar()

      this.vistaPartidaPrueba.animarCartaJugada(indiceCarta, () => {
        this.vistaPartidaPrueba.actualizarCartas(this.cartasMano)
      })

      this.vistaPartidaPrueba.actualizarPerfil(this.perfilAsignado)
      this.vistaPartidaPrueba.actualizarProgresoPerfil()

      logEvent('METRICAS', 'carta_jugada', {
        carta: carta.titulo,
        horas: horasAplicadas,
        categorias: carta.categorias,
        turno: this.jugadorActual
      })

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

    logEvent('LOGS', 'turno', { jugador: this.jugadorActual })

    const activado = this.verificarActivarAccidente()

    if (activado) {
      const accidente = activado.accidente
      const cartasAfectadas = accidente.aplicarEfecto(this.cartasMano)

      this.accidentesActivosOrden.push(accidente)

      this.vistaPartidaPrueba.actualizarCartas(this.cartasMano)
      this.vistaPartidaPrueba.actualizarAccidentes(this.accidentesSeleccionados)

      logEvent('METRICAS', 'accidente_activado', {
        accidente: accidente.nombre,
        nivel: accidente.nivel,
        cartasAfectadas: cartasAfectadas.negativas?.map(c => c.titulo) || [],
        cartasBeneficiadas: cartasAfectadas.positivas?.map(c => c.titulo) || []
      })

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

    this.accidentesActivosOrden.push(accidente)

    const cartasAfectadas = accidente.aplicarEfecto(this.cartasMano)

    this.vistaPartidaPrueba.actualizarCartas(this.cartasMano)
    this.vistaPartidaPrueba.actualizarAccidentes(this.accidentesSeleccionados)

    logEvent('METRICAS', 'accidente_activado', {
      accidente: accidente.nombre,
      nivel: accidente.nivel,
      manual: true,
      cartasAfectadas: cartasAfectadas.negativas?.map(c => c.titulo) || [],
      cartasBeneficiadas: cartasAfectadas.positivas?.map(c => c.titulo) || []
    })

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
      this.partidaIniciada = false
      this.finalizarPartida()
      this.vistaPartidaPrueba.mostrarMensaje('¡Perfil completado! Has terminado tu trabajo. ¡Victoria!', 8000)
    }
  }

  finalizarPartida() {
    const duracion = this.turnoInicio
      ? Math.round((new Date() - this.turnoInicio) / 1000)
      : 0

    logEvent('LOGS', 'end', {
      modo: 'prueba',
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
    console.log('[ControladorVistaPartidaPrueba] Log completo de la partida:', logJSON)

    this.vistaPartidaPrueba.mostrarLogFinal(logJSON)
  }

  intercambiarCartas(carta1, carta2) {
    if (!this.turnoActivo || this.accidenteActivo) return
    if (carta1.horas !== carta2.horas) {
      this.vistaPartidaPrueba.mostrarMensaje('Las cartas deben tener la misma cantidad de horas para intercambiar')
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

    this.vistaPartidaPrueba.actualizarCartas(this.cartasMano)
    this.vistaPartidaPrueba.mostrarMensaje(`Intercambiaste ${carta1.titulo} por ${carta2.titulo}`)
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

    this.vistaPartidaPrueba.actualizarCartas(this.cartasMano)
    this.vistaPartidaPrueba.actualizarProgresoPerfil()
    this.vistaPartidaPrueba.mostrarMensajeActividadGrupal(actividad)

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

    this.vistaPartidaPrueba.actualizarAccidentes(this.accidentesSeleccionados)
  }

  reiniciarPartida() {
    this.accidentesSeleccionados.forEach(a => a.activo = false)
    this.accidentesSeleccionados = []
    this.accidentesActivosOrden = []
    this.perfilAsignado = null
    this.cartasMano = []
    this.cartasJugadas = []
    this.actividadesDisponibles = []
    this.jugadorActual = 1
    this.turnoActivo = false
    this.accidenteActivo = false
    this.partidaIniciada = false
    this.metricasUsoCartas = {}
    this.turnoInicio = null

    this.iniciarPartida()
    this.vistaPartidaPrueba.mostrarMensaje('Partida reiniciada con nuevos elementos.')
  }
}
