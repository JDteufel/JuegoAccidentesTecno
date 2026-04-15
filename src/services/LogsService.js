/**
 * LogsService - Maneja el registro de eventos en el servidor
 *
 * Este servicio permite a los controladores registrar eventos que se envían
 * a SmartFoxServer para análisis de datos.
 */

let smartFoxInstance = null

/**
 * Inicializa el servicio con la instancia de SmartFox
 * @param {Object} sfs - Instancia de SmartFoxServer
 */
export function initLogsService(sfs) {
  smartFoxInstance = sfs
}

/**
 * Registra un evento en el servidor
 * @param {string} type - Tipo de evento (LOBBY, PARTIDA, JUGADOR, ACCIDENTE, etc.)
 * @param {string} action - Acción específica (create_lobby, play_card, etc.)
 * @param {Object} details - Detalles adicionales del evento
 */
export function logEvent(type, action, details = {}) {
  if (!smartFoxInstance) {
    console.warn('[LogsService] SmartFox no inicializado')
    return
  }

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
    console.error('[LogsService] Error enviando log:', error)
  }
}

// ============================================
// Categorías de eventos predefinidas
// ============================================

export const EVENT_TYPES = {
  // Servidor
  SISTEMA: 'SISTEMA',
  USUARIO: 'USUARIO',
  SESION: 'SESION',
  ERROR: 'ERROR',
  // Juego (por definir)
  // LOBBY: 'LOBBY',
  // PARTIDA: 'PARTIDA',
  // CARTA: 'CARTA',
  // ACCIDENTE: 'ACCIDENTE'
}

export const EVENT_ACTIONS = {
  // Usuario
  USUARIO_REGISTRO: 'registro',
  USUARIO_LOGIN: 'login',
  USUARIO_LOGOUT: 'logout',

  // Sesión
  SESION_CONEXION: 'conexion',
  SESION_DESCONEXION: 'desconexion',

  // Lobby (por definir)
  // LOBBY_CREATE: 'create_lobby',
  // LOBBY_JOIN: 'join_lobby',
  // LOBBY_LEAVE: 'leave_lobby',

  // Errores
  ERROR: 'error'
}
