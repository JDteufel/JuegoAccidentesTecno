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

  if (type === 'METRICAS') {
    syncToMongoDB(type, action, details)
  }
}

export async function syncAllToMongoDB() {
  const allLogs = obtenerTodosLogs()
  if (allLogs.length === 0) {
    console.log('[LogsService] No hay logs para sincronizar')
    return true
  }

  try {
    console.log(`[LogsService] Preparando envío de ${allLogs.length} eventos...`)

    const logsCopia = JSON.parse(JSON.stringify(allLogs))

    console.log('[LogsService] Contenido del historial a enviar:', logsCopia)

    await mongoDBService.logEvent('SISTEMA', 'sesion_completa', {
      totalEventos: logsCopia.length,
      historial: logsCopia,
      timestampSincronizacion: new Date().toISOString(),
      nota: 'Este registro contiene la secuencia completa de eventos de la sesión'
    })

    console.log('[LogsService] Lote de logs sincronizado con éxito en un único registro')

    limpiarLogs()

    return true
  } catch (error) {
    console.error(`[LogsService] Error al sincronizar lote de logs: ${error.message}`)
    return false
  }
}

async function syncToMongoDB(type, action, details) {
  try {
    let result
    if (type === 'METRICAS') {
      result = await mongoDBService.logMetric(type, action, details)
    } else {
      result = await mongoDBService.logEvent(type, action, details)
    }

    if (result && result.ok === false) {
      console.warn(`[LogsService] Error de servidor al sincronizar ${type}: ${result.message || 'Error desconocido'} (Status: ${result.status})`)
    }
  } catch (error) {
    console.warn(`[LogsService] Error de red al sincronizar con MongoDB: ${error.message}`)
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
