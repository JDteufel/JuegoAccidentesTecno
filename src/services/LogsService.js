import mongoDBService from './MongoDBService.js'

let smartFoxInstance = null

const logsLocales = {
  USUARIO: [],
  METRICAS: [],
  LOGS: []
}

export function initLogsService(sfs) {
  smartFoxInstance = sfs
  console.log('[LogsService] Inicializado con SmartFox')
}

export function logEvent(type, action, details = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    type: type,
    action: action,
    details: details
  }

  if (!logsLocales[type]) {
    logsLocales[type] = []
  }

  logsLocales[type].push(logEntry)
  console.log(`[LOG][${type}] ${action}`, details)

  if (smartFoxInstance) {
    try {
      const SFS2X = window.SFS2X
      const params = new SFS2X.SFSObject()
      params.putUtfString('type', type)
      params.putUtfString('action', action)
      params.putUtfString('details', JSON.stringify(details))

      smartFoxInstance.send(
        new SFS2X.ExtensionRequest('log', params)
      )
    } catch (error) {
      console.warn('[LogsService] Error enviando log a SmartFox:', error)
    }
  }

  syncToMongoDB(type, action, details)
}

async function syncToMongoDB(type, action, details) {
  try {
    await mongoDBService.logEvent(type, action, details)
  } catch (error) {
    console.warn(`[LogsService] Error al sincronizar con MongoDB: ${error.message}`)
  }
}

export function obtenerLogs(category = null) {
  if (category) {
    return logsLocales[category] || []
  }
  return logsLocales
}

export function obtenerTodosLogs() {
  const todosLogs = []
  const categories = Object.keys(logsLocales)

  categories.forEach(category => {
    todosLogs.push(...logsLocales[category])
  })

  return todosLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

export function limpiarLogs(category = null) {
  if (category) {
    if (logsLocales[category]) {
      const count = logsLocales[category].length
      logsLocales[category] = []
      console.log(`[LogsService] ${count} logs limpiados en categoría ${category}`)
    }
  } else {
    const categories = Object.keys(logsLocales)
    let totalBorrados = 0

    categories.forEach(cat => {
      totalBorrados += logsLocales[cat].length
      logsLocales[cat] = []
    })

    console.log(`[LogsService] ${totalBorrados} logs limpiados en total`)
  }
}

export function exportarJSON(category = null) {
  const logs = category ? 
    (logsLocales[category] || []) : 
    obtenerTodosLogs()

  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    category: category || 'ALL',
    totalEvents: logs.length,
    events: logs
  }, null, 2)
}

export function obtenerEstadisticas() {
  const stats = {}
  const categories = Object.keys(logsLocales)

  categories.forEach(category => {
    stats[category] = logsLocales[category].length
  })

  return {
    totalLogs: obtenerTodosLogs().length,
    porCategoria: stats,
    timestamp: new Date().toISOString()
  }
}

export const TiposEvento = {
  Lobby: 'lobby',
  Partida: 'partida',
  Jugador: 'jugador',
  Carta: 'carta',
  Accidente: 'accidente',
  Sistema: 'sistema',
  Usuario: 'usuario',
  Sesion: 'sesion',
  Error: 'error'
}

export const AccionesEvento = {
  UsuarioRegistro: 'registro',
  UsuarioInicioSesion: 'inicio_sesion',
  UsuarioCierreSesion: 'cierre_sesion',
  SesionConexion: 'conexion',
  SesionDesconexion: 'desconexion',
  LobbyCrear: 'crear',
  LobbyUnir: 'unir',
  LobbySalir: 'salir',
  LobbyCerrar: 'cerrar',
  PartidaInicio: 'inicio',
  PartidaFin: 'fin',
  PartidaTurno: 'turno',
  PartidaCartaJugada: 'carta_jugada',
  PartidaCartaIntercambiada: 'carta_intercambiada',
  PartidaAccidenteActivado: 'accidente_activado',
  PartidaActividadGrupal: 'actividad_grupal',
  PartidaPerfilCompletado: 'perfil_completado',
  MetricaCartaUso: 'carta_uso',
  MetricaTurnoDuracion: 'turno_duracion',
  MetricaPartidaDuracion: 'partida_duracion',
  Error: 'error'
}
