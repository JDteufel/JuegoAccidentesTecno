/*
 * JuegoExtension.js - Refactorizada
 * 
 * Extension de SmartFoxServer para el juego de accidentes tecnológicos.
 * Esta extensión ahora actúa como adaptador entre cliente-servidor,
 * delegando la lógica a servicios en src/services.
 * 
 * NOTA: La lógica de negocio ha sido movida a:
 * - src/services/MongoDBService.js (comunicación con REST Bridge)
 * - src/services/UsuariosService.js (gestión de usuarios)
 * - src/services/LogsService.js (gestión de logs)
 * - src/services/LobbiesService.js (gestión de lobbies)
 */

var ZONE_NAME = 'JuegoAccidentesTecno'
var extensionState = {
  initializedAt: null,
  commandsProcessed: 0
}

// Mapeo de comandos a sus handlers
var commandHandlers = {
  ping: handlePing,
  createLobby: handleCreateLobby,
  joinLobby: handleJoinLobby,
  getLobbyState: handleGetLobbyState,
  leaveLobby: handleLeaveLobby,
  getLogs: handleGetLogs,
  clearLogs: handleClearLogs,
  log: handleLog,
  register: handleRegister,
  login: handleLogin,
  getAllLobbies: handleGetAllLobbies
}

/**
 * Inicialización de la extensión
 */
function init() {
  extensionState.initializedAt = new Date().toISOString()
  extensionState.commandsProcessed = 0
  
  trace('[JuegoExtension] Inicializada en ' + extensionState.initializedAt)
  trace('[JuegoExtension] Zona: ' + ZONE_NAME)
  trace('[JuegoExtension] NOTE: Lógica centralizada en src/services/')
}

/**
 * Destrucción de la extensión
 */
function destroy() {
  trace('[JuegoExtension] Extensión destruida')
}

/**
 * Punto de entrada principal para todos los comandos
 */
function handleRequest(commandName, rawParams, sender) {
  var handler = commandHandlers[commandName]
  var params = parseParams(rawParams)
  var senderName = getSenderName(sender)

  extensionState.commandsProcessed++

  trace('[JuegoExtension] cmd=' + commandName + ' | sender=' + senderName)

  if (!handler) {
    return sendError(sender, 'Comando no soportado: ' + commandName)
  }

  try {
    return handler(params, sender, senderName)
  } catch (error) {
    trace('[JuegoExtension] ERROR: ' + error)
    return sendError(sender, 'Error procesando comando: ' + error)
  }
}

// ============================================
// HANDLERS DE COMANDOS
// ============================================

function handlePing(params, sender, senderName) {
  return sendResponse('pong', {
    ok: true,
    zone: ZONE_NAME,
    initializedAt: extensionState.initializedAt,
    commandsProcessed: extensionState.commandsProcessed,
    note: 'Lógica centralizada en src/services'
  }, sender)
}

function handleRegister(params, sender, senderName) {
  var username = getString(params, 'username')
  var password = getString(params, 'password')

  // NOTA: La validación y registro ocurre en UsuariosService
  trace('[JuegoExtension] Registro solicitado: ' + username)

  // El cliente debe hacer llamadas HTTP directas a MongoDBService o UsuariosService
  return sendResponse('registerForwarded', {
    ok: true,
    message: 'Use el cliente para llamar a UsuariosService.registrar()'
  }, sender)
}

function handleLogin(params, sender, senderName) {
  var username = getString(params, 'username')
  var password = getString(params, 'password')

  trace('[JuegoExtension] Login solicitado: ' + username)

  // El cliente debe hacer llamadas HTTP directas a UsuariosService
  return sendResponse('loginForwarded', {
    ok: true,
    message: 'Use el cliente para llamar a UsuariosService.login()'
  }, sender)
}

function handleCreateLobby(params, sender, senderName) {
  var hostName = getString(params, 'hostName')

  trace('[JuegoExtension] Crear lobby - Host: ' + hostName)

  // El cliente debe hacer llamadas HTTP directas a LobbiesService
  return sendResponse('createLobbyForwarded', {
    ok: true,
    message: 'Use el cliente para llamar a LobbiesService.crearLobby()'
  }, sender)
}

function handleJoinLobby(params, sender, senderName) {
  var lobbyCode = getString(params, 'lobbyCode')
  var guestName = getString(params, 'guestName')

  trace('[JuegoExtension] Unir a lobby - Code: ' + lobbyCode + ' | Jugador: ' + guestName)

  // El cliente debe hacer llamadas HTTP directas a LobbiesService
  return sendResponse('joinLobbyForwarded', {
    ok: true,
    message: 'Use el cliente para llamar a LobbiesService.unirseALobby()'
  }, sender)
}

function handleGetLobbyState(params, sender, senderName) {
  var lobbyCode = getString(params, 'lobbyCode')

  trace('[JuegoExtension] Obtener estado - Lobby: ' + lobbyCode)

  return sendResponse('getLobbyStateForwarded', {
    ok: true,
    message: 'Use el cliente para llamar a LobbiesService.obtenerEstadoLobby()'
  }, sender)
}

function handleLeaveLobby(params, sender, senderName) {
  var lobbyCode = getString(params, 'lobbyCode')

  trace('[JuegoExtension] Salir de lobby - Code: ' + lobbyCode)

  return sendResponse('leaveLobbyForwarded', {
    ok: true,
    message: 'Use el cliente para llamar a LobbiesService.salirDelLobby()'
  }, sender)
}

function handleGetAllLobbies(params, sender, senderName) {
  trace('[JuegoExtension] Obtener todos los lobbies')

  return sendResponse('getAllLobbiesForwarded', {
    ok: true,
    message: 'Use el cliente para llamar a LobbiesService.obtenerTodosLosLobbies()'
  }, sender)
}

function handleGetLogs(params, sender, senderName) {
  var category = getString(params, 'category')

  trace('[JuegoExtension] Obtener logs - Categoría: ' + (category || 'ALL'))

  return sendResponse('getLogsForwarded', {
    ok: true,
    message: 'Use el cliente para llamar a LogsService.obtenerLogs()'
  }, sender)
}

function handleClearLogs(params, sender, senderName) {
  var category = getString(params, 'category')

  trace('[JuegoExtension] Limpiar logs - Categoría: ' + (category || 'ALL'))

  return sendResponse('clearLogsForwarded', {
    ok: true,
    message: 'Use el cliente para llamar a LogsService.limpiarLogs()'
  }, sender)
}

function handleLog(params, sender, senderName) {
  var type = getString(params, 'type')
  var action = getString(params, 'action')
  var details = params['details'] || {}

  trace('[LOG][' + type + '] ' + action)

  return sendResponse('logRecorded', {
    ok: true,
    message: 'Log registrado'
  }, sender)
}

// ============================================
// UTILIDADES
// ============================================

function parseParams(rawParams) {
  if (!rawParams) return {}
  
  if (typeof rawParams.toJson === 'function') {
    try {
      return JSON.parse(rawParams.toJson())
    } catch (e) {
      return {}
    }
  }

  return typeof rawParams === 'object' ? rawParams : {}
}

function getString(params, fieldName) {
  if (!params || !fieldName) return ''
  
  var value = params[fieldName]
  if (typeof value === 'string') {
    return value.trim()
  }
  
  return ''
}

function getSenderName(sender) {
  if (!sender) return 'unknown'
  
  if (typeof sender.name === 'string' && sender.name.length > 0) {
    return sender.name
  }

  if (typeof sender.getName === 'function') {
    return sender.getName()
  }

  return 'unknown'
}

function sendResponse(commandName, payload, recipient) {
  trace('[JuegoExtension] response=' + commandName + ' to=' + getSenderName(recipient))

  if (recipient && typeof recipient.send === 'function') {
    try {
      var params = new Packages.com.smartfoxserver.v2.util.SFSObject()
      params.putUtfString('cmd', commandName)
      params.putUtfString('data', JSON.stringify(payload))
      recipient.send(Packages.com.smartfoxserver.v2.SFSEvent.EXTENSION_RESPONSE, params)
    } catch (e) {
      trace('[JuegoExtension] Error sending response: ' + e)
    }
  }
}

function sendError(recipient, message) {
  return sendResponse('requestError', {
    ok: false,
    message: message
  }, recipient)
}
