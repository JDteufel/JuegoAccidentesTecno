/*
 * Extension base de zone para SmartFoxServer.
 *
 * Este archivo mantiene la logica de dominio desacoplada de la API exacta de
 * SmartFox. Cuando probemos la extension contra la instalacion real solo
 * tendremos que ajustar el adaptador de entrada/salida.
 */

var ZONE_NAME = 'JuegoAccidentesTecno'
var MAX_PLAYERS_PER_LOBBY = 16
var LOBBY_CODE_LENGTH = 6
var LOBBY_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

var zoneState = createInitialState()

var commandHandlers = {
  ping: handlePing,
  createLobby: handleCreateLobby,
  joinLobby: handleJoinLobby,
  getLobbyState: handleGetLobbyState,
  leaveLobby: handleLeaveLobby
}

function init() {
  zoneState = createInitialState()
  zoneState.initializedAt = new Date().toISOString()
  trace(
    '[JuegoExtension] Zone extension inicializada en ' +
      zoneState.initializedAt
  )
}

function destroy() {
  zoneState = createInitialState()
  trace('[JuegoExtension] Zone extension destruida')
}

/*
 * Punto de entrada generico para comandos de extension.
 *
 * Ajusta la firma si tu runtime de SmartFoxServer expone otro nombre o una
 * cantidad distinta de argumentos para las peticiones de cliente.
 */
function handleRequest(commandName, rawParams, sender) {
  var handler = commandHandlers[commandName]
  var params = readParams(rawParams)

  if (!handler) {
    return sendError(sender, 'Comando no soportado: ' + commandName)
  }

  trace(
    '[JuegoExtension] request=' +
      commandName +
      ' sender=' +
      readSenderName(sender) +
      ' params=' +
      stringify(params)
  )

  return handler(params, sender)
}

function handlePing(_params, sender) {
  return sendResponse('pong', {
    ok: true,
    zone: ZONE_NAME,
    initializedAt: zoneState.initializedAt,
    lobbyCount: countKeys(zoneState.lobbiesByCode)
  }, sender)
}

function handleCreateLobby(params, sender) {
  var senderName = readSenderName(sender)
  var hostName = sanitizePlayerName(readString(params, 'hostName'))
  var existingLobbyCode = zoneState.lobbyCodeBySender[senderName]

  if (!hostName) {
    return sendError(sender, 'El nombre del anfitrion es obligatorio')
  }

  if (existingLobbyCode) {
    return sendError(
      sender,
      'El usuario ya tiene un lobby activo: ' + existingLobbyCode
    )
  }

  var lobbyCode = generateUniqueLobbyCode()
  var hostPlayer = createPlayerRecord({
    name: hostName,
    senderName: senderName,
    role: 'host'
  })

  zoneState.lobbiesByCode[lobbyCode] = {
    code: lobbyCode,
    hostName: hostName,
    hostSenderName: senderName,
    createdAt: new Date().toISOString(),
    players: [hostPlayer],
    matches: [],
    status: 'waiting'
  }

  zoneState.lobbyCodeBySender[senderName] = lobbyCode

  return sendResponse('lobbyCreated', buildLobbyResponse(lobbyCode), sender)
}

function handleJoinLobby(params, sender) {
  var senderName = readSenderName(sender)
  var lobbyCode = normalizeCode(readString(params, 'lobbyCode'))
  var guestName = sanitizePlayerName(readString(params, 'guestName'))
  var lobby = null

  if (!lobbyCode) {
    return sendError(sender, 'El codigo del lobby es obligatorio')
  }

  if (!guestName) {
    return sendError(sender, 'El nombre temporal es obligatorio')
  }

  lobby = zoneState.lobbiesByCode[lobbyCode]
  if (!lobby) {
    return sendError(sender, 'Lobby no encontrado')
  }

  if (zoneState.lobbyCodeBySender[senderName]) {
    return sendError(sender, 'El usuario ya pertenece a un lobby activo')
  }

  if (lobby.players.length >= MAX_PLAYERS_PER_LOBBY) {
    return sendError(sender, 'El lobby alcanzo el maximo de jugadores')
  }

  if (containsPlayerName(lobby.players, guestName)) {
    return sendError(sender, 'Ya existe un jugador con ese nombre en el lobby')
  }

  lobby.players.push(
    createPlayerRecord({
      name: guestName,
      senderName: senderName,
      role: 'guest'
    })
  )
  zoneState.lobbyCodeBySender[senderName] = lobby.code

  return sendResponse('lobbyJoined', buildLobbyResponse(lobby.code), sender)
}

function handleGetLobbyState(params, sender) {
  var requestedCode = normalizeCode(readString(params, 'lobbyCode'))
  var senderCode = zoneState.lobbyCodeBySender[readSenderName(sender)]
  var lobbyCode = requestedCode || senderCode

  if (!lobbyCode) {
    return sendError(sender, 'No se encontro un lobby asociado al usuario')
  }

  if (!zoneState.lobbiesByCode[lobbyCode]) {
    return sendError(sender, 'Lobby no encontrado')
  }

  return sendResponse('lobbyState', buildLobbyResponse(lobbyCode), sender)
}

function handleLeaveLobby(params, sender) {
  var senderName = readSenderName(sender)
  var lobbyCode = normalizeCode(readString(params, 'lobbyCode')) ||
    zoneState.lobbyCodeBySender[senderName]
  var lobby = null
  var removedPlayer = null

  if (!lobbyCode) {
    return sendError(sender, 'No se encontro un lobby asociado al usuario')
  }

  lobby = zoneState.lobbiesByCode[lobbyCode]
  if (!lobby) {
    return sendError(sender, 'Lobby no encontrado')
  }

  removedPlayer = removePlayerFromLobby(lobby, senderName)
  if (!removedPlayer) {
    return sendError(sender, 'El usuario no pertenece al lobby indicado')
  }

  delete zoneState.lobbyCodeBySender[senderName]

  if (lobby.players.length === 0 || removedPlayer.role === 'host') {
    dropLobby(lobby.code)

    return sendResponse('lobbyClosed', {
      ok: true,
      lobbyCode: lobbyCode
    }, sender)
  }

  return sendResponse('lobbyLeft', buildLobbyResponse(lobby.code), sender)
}

function createInitialState() {
  return {
    initializedAt: null,
    lobbiesByCode: {},
    lobbyCodeBySender: {}
  }
}

function createPlayerRecord(input) {
  return {
    name: input.name,
    senderName: input.senderName,
    role: input.role,
    joinedAt: new Date().toISOString()
  }
}

function buildLobbyResponse(lobbyCode) {
  var lobby = zoneState.lobbiesByCode[lobbyCode]

  return {
    ok: true,
    lobbyCode: lobby.code,
    hostName: lobby.hostName,
    status: lobby.status,
    createdAt: lobby.createdAt,
    playerCount: lobby.players.length,
    players: clonePlayers(lobby.players)
  }
}

function clonePlayers(players) {
  var clone = []
  var i = 0

  for (i = 0; i < players.length; i += 1) {
    clone.push({
      name: players[i].name,
      role: players[i].role,
      joinedAt: players[i].joinedAt
    })
  }

  return clone
}

function removePlayerFromLobby(lobby, senderName) {
  var i = 0
  var removedPlayer = null

  for (i = 0; i < lobby.players.length; i += 1) {
    if (lobby.players[i].senderName === senderName) {
      removedPlayer = lobby.players[i]
      lobby.players.splice(i, 1)
      break
    }
  }

  return removedPlayer
}

function dropLobby(lobbyCode) {
  var lobby = zoneState.lobbiesByCode[lobbyCode]
  var i = 0

  if (!lobby) {
    return
  }

  for (i = 0; i < lobby.players.length; i += 1) {
    delete zoneState.lobbyCodeBySender[lobby.players[i].senderName]
  }

  delete zoneState.lobbiesByCode[lobbyCode]
}

function containsPlayerName(players, playerName) {
  var normalizedName = normalizeName(playerName)
  var i = 0

  for (i = 0; i < players.length; i += 1) {
    if (normalizeName(players[i].name) === normalizedName) {
      return true
    }
  }

  return false
}

function sanitizePlayerName(value) {
  var sanitizedValue = value || ''

  sanitizedValue = sanitizedValue.replace(/\s+/g, ' ')
  sanitizedValue = sanitizedValue.replace(/^\s+|\s+$/g, '')

  if (sanitizedValue.length > 20) {
    sanitizedValue = sanitizedValue.substring(0, 20)
  }

  return sanitizedValue
}

function normalizeName(value) {
  return sanitizePlayerName(value).toLowerCase()
}

function readParams(rawParams) {
  if (!rawParams) {
    return {}
  }

  if (typeof rawParams.toJson === 'function') {
    return tryParseJson(rawParams.toJson())
  }

  if (typeof rawParams === 'object') {
    return rawParams
  }

  return {}
}

function readString(params, fieldName) {
  if (!params || !fieldName) {
    return ''
  }

  if (typeof params[fieldName] === 'string') {
    return params[fieldName].replace(/^\s+|\s+$/g, '')
  }

  return ''
}

function normalizeCode(code) {
  return (code || '').toUpperCase()
}

function readSenderName(sender) {
  if (!sender) {
    return 'unknown'
  }

  if (typeof sender.name === 'string' && sender.name.length > 0) {
    return sender.name
  }

  if (typeof sender.getName === 'function') {
    return sender.getName()
  }

  return 'unknown'
}

function generateUniqueLobbyCode() {
  var lobbyCode = generateLobbyCode()

  while (zoneState.lobbiesByCode[lobbyCode]) {
    lobbyCode = generateLobbyCode()
  }

  return lobbyCode
}

function generateLobbyCode() {
  var code = ''
  var i = 0

  for (i = 0; i < LOBBY_CODE_LENGTH; i += 1) {
    code += LOBBY_CODE_ALPHABET.charAt(
      Math.floor(Math.random() * LOBBY_CODE_ALPHABET.length)
    )
  }

  return code
}

function countKeys(objectValue) {
  var total = 0
  var key = null

  for (key in objectValue) {
    if (objectValue.hasOwnProperty(key)) {
      total += 1
    }
  }

  return total
}

/*
 * Adaptador local para desacoplar la logica del detalle de SmartFox.
 *
 * Sustituye el cuerpo de esta funcion por la API real de envio cuando
 * conectes la extension al runtime definitivo.
 */
function sendResponse(commandName, payload, recipient) {
  trace(
    '[JuegoExtension] response=' +
      commandName +
      ' recipient=' +
      readSenderName(recipient) +
      ' payload=' +
      stringify(payload)
  )
}

function sendError(recipient, message) {
  return sendResponse('requestError', {
    ok: false,
    message: message
  }, recipient)
}

function tryParseJson(rawValue) {
  try {
    return JSON.parse(rawValue)
  } catch (_error) {
    return {}
  }
}

function stringify(value) {
  try {
    return JSON.stringify(value)
  } catch (_error) {
    return '[unserializable]'
  }
}
