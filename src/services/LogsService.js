/**
 * LogsService (Mejorado)
 * 
 * Servicio centralizado para gestionar logs del juego.
 * Mantiene caché local, sincroniza con SmartFox y MongoDB.
 * 
 * Categorías: USUARIO, SESION, ERROR, SISTEMA, LOBBY, PARTIDA
 * Patrón: Singleton + Repository
 */

import mongoDBService from './MongoDBService.js'

let smartFoxInstance = null

// Caché local de logs
const logsLocales = {
  USUARIO: [],
  SESION: [],
  ERROR: [],
  SISTEMA: [],
  LOBBY: [],
  PARTIDA: []
}

/**
 * Inicializa el servicio con la instancia de SmartFox
 * @param {Object} sfs - Instancia de SmartFoxServer
 */
export function initLogsService(sfs) {
  smartFoxInstance = sfs
  console.log('[LogsService] Inicializado con SmartFox')
}

/**
 * Registra un evento en el servidor y MongoDB
 * @param {string} type - Tipo de evento (LOBBY, PARTIDA, JUGADOR, ACCIDENTE, etc.)
 * @param {string} action - Acción específica (create_lobby, play_card, etc.)
 * @param {Object} details - Detalles adicionales del evento
 */
export function logEvent(type, action, details = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    type: type,
    action: action,
    details: details
  }

  // Inicializar categoría si no existe
  if (!logsLocales[type]) {
    logsLocales[type] = []
  }

  // Guardar en caché local
  logsLocales[type].push(logEntry)
  console.log(`[LOG][${type}] ${action}`, details)

  // Enviar a SmartFox si está disponible
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

  // Sincronizar con MongoDB
  syncToMongoDB(type, action, details)
}

/**
 * Sincroniza un evento con MongoDB
 */
async function syncToMongoDB(type, action, details) {
  try {
    await mongoDBService.logEvent(type, action, details)
  } catch (error) {
    console.warn(`[LogsService] Error al sincronizar con MongoDB: ${error.message}`)
  }
}

// ============================================
// API Pública del Servicio
// ============================================

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
  // ============================================
// Constantes para tipos y acciones de eventos
// ============================================

export const EVENT_TYPES = {
  LOBBY: 'LOBBY',
  PARTIDA: 'PARTIDA',
  JUGADOR: 'JUGADOR',
  CARTA: 'CARTA',
  ACCIDENTE: 'ACCIDENTE',
  SISTEMA: 'SISTEMA',
  USUARIO: 'USUARIO',
  SESION: 'SESION',
  ERROR: 'ERROR'
}

export const EVENT_ACTIONS = {
  // Usuario
  USUARIO_REGISTRO: 'registro',
  USUARIO_LOGIN: 'login',
  USUARIO_LOGOUT: 'logout',

  // Sesión
  SESION_CONEXION: 'conexion',
  SESION_DESCONEXION: 'desconexion',

  // Lobby
  LOBBY_CREATE: 'create',
  LOBBY_JOIN: 'join',
  LOBBY_LEAVE: 'leave',
  LOBBY_CLOSE: 'close',

  // Errores
  ERROR: 'error'
}
