const DEFAULT_CONFIG = {
  host: window.location.hostname || '127.0.0.1',
  port: 8080,
  zone: 'JuegoAccidentesTecno'
}

const LOBBY_GROUP_ID = 'default'
const LOBBY_MAX_USERS = 33

let smartFoxInstance = null
let config = { ...DEFAULT_CONFIG }
let currentLoginName = null
const lobbyListeners = new Set()
const boundInstances = new WeakSet()
let heartbeatInterval = null
const roomJoinListeners = new Set()

function getSfsNamespace() {
  return window.SFS2X || null
}

function getCurrentConfig() {
  return {
    ...DEFAULT_CONFIG,
    ...config
  }
}

function ensureSfsNamespace() {
  const SFS2X = getSfsNamespace()

  if (!SFS2X) {
    throw new Error('La API de SmartFox no esta cargada en window.SFS2X')
  }

  return SFS2X
}

function getUserName(user) {
  if (!user) return ''
  if (typeof user.name === 'string') return user.name
  if (typeof user.getName === 'function') return user.getName()
  return ''
}

function getRoomName(room) {
  if (!room) return ''
  if (typeof room.name === 'string') return room.name
  if (typeof room.getName === 'function') return room.getName()
  return ''
}

function getRoomUsers(room) {
  if (!room) return []
  if (Array.isArray(room.userList)) return room.userList
  if (typeof room.getUserList === 'function') return room.getUserList() || []
  return []
}

function getRoomVariableValue(room, variableName, fallback = null) {
  if (!room || !variableName) return fallback

  let variable = null
  if (typeof room.getVariable === 'function') {
    variable = room.getVariable(variableName)
  } else if (Array.isArray(room.variables)) {
    variable = room.variables.find((item) => item?.name === variableName)
  }

  if (!variable) {
    return fallback
  }

  if (typeof variable.getValue === 'function') {
    return variable.getValue()
  }

  if (Object.prototype.hasOwnProperty.call(variable, 'value')) {
    return variable.value
  }

  return fallback
}

function getJoinedRoom() {
  if (!smartFoxInstance) return null

  if (smartFoxInstance.lastJoinedRoom) {
    return smartFoxInstance.lastJoinedRoom
  }

  if (typeof smartFoxInstance.getLastJoinedRoom === 'function') {
    return smartFoxInstance.getLastJoinedRoom()
  }

  if (smartFoxInstance.mySelf) {
    if (typeof smartFoxInstance.mySelf.getLastJoinedRoom === 'function') {
      return smartFoxInstance.mySelf.getLastJoinedRoom()
    }

    if (smartFoxInstance.mySelf.lastJoinedRoom) {
      return smartFoxInstance.mySelf.lastJoinedRoom
    }
  }

  return null
}

function buildLobbyData(room = getJoinedRoom()) {
  if (!room) {
    return null
  }

  const actualRoomName = room._overrideName || getRoomName(room)
  console.log('[SmartFoxService] buildLobbyData - actualRoomName:', actualRoomName)

  const allUsers = getRoomUsers(room)
  console.log('[SmartFoxService] buildLobbyData - allUsers:', allUsers.map(u => getUserName(u)))
  console.log('[SmartFoxService] buildLobbyData - room variables:', room.variables)

  const hostNameFromVar = getRoomVariableValue(room, 'hostName', null)
  console.log('[SmartFoxService] buildLobbyData - hostNameFromVar:', hostNameFromVar)

  const hostName = hostNameFromVar || getUserName(allUsers[0]) || currentLoginName
  console.log('[SmartFoxService] buildLobbyData - hostName final:', hostName)
  console.log('[SmartFoxService] buildLobbyData - currentLoginName:', currentLoginName)

  const players = allUsers
    .filter(user => getUserName(user) !== hostName)
    .map((user) => ({
      name: getUserName(user),
      role: 'guest',
      joinedAt: null
    }))

  console.log('[SmartFoxService] buildLobbyData - players result:', players.map(p => p.name))

  return {
    ok: true,
    lobbyCode: actualRoomName,
    hostName,
    status: getRoomVariableValue(room, 'status', 'waiting'),
    createdAt: getRoomVariableValue(room, 'createdAt', null),
    playerCount: players.length,
    players
  }
}

export function emitLobbyUpdate(room = getJoinedRoom(), overrideRoomName = null) {
  let lobbyData

  if (room && typeof room === 'object' && room.name) {
    console.log('[SmartFoxService] emitLobbyUpdate usando room.name:', room.name)
    if (overrideRoomName) {
      room._overrideName = overrideRoomName
    }
    lobbyData = buildLobbyData(room)
  } else if (overrideRoomName) {
    console.log('[SmartFoxService] emitLobbyUpdate sin room, usando overrideRoomName:', overrideRoomName)
    lobbyData = {
      ok: true,
      lobbyCode: overrideRoomName,
      hostName: currentLoginName,
      status: 'inSubSala',
      playerCount: 0,
      players: []
    }
  } else {
    lobbyData = buildLobbyData(room)
  }

  console.log('[SmartFoxService] emitLobbyUpdate - lobbyData:', lobbyData)
  console.log('[SmartFoxService] emitLobbyUpdate - notifying', lobbyListeners.size, 'listeners')

  lobbyListeners.forEach((listener) => {
    try {
      listener(lobbyData)
    } catch (error) {
      console.warn('[SmartFoxService] Error notificando lobby:', error)
    }
  })
}

function startHeartbeat() {
  stopHeartbeat()
  heartbeatInterval = setInterval(() => {
    if (smartFoxInstance && smartFoxInstance.isConnected) {
      try {
        const SFS2X = getSfsNamespace()
        smartFoxInstance.send(new SFS2X.ExtensionRequest('ping', new SFS2X.SFSObject()))
      } catch (e) {
        console.warn('[SmartFoxService] Heartbeat fallido:', e)
      }
    }
  }, 30000)
}

function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval)
    heartbeatInterval = null
  }
}

function bindRuntimeListeners(smartFox, SFS2X) {
  if (boundInstances.has(smartFox)) {
    return
  }

  boundInstances.add(smartFox)

  smartFox.addEventListener(SFS2X.SFSEvent.ROOM_JOIN, (event) => {
    emitLobbyUpdate(event.room || getJoinedRoom())
  })

  smartFox.addEventListener(SFS2X.SFSEvent.USER_ENTER_ROOM, (event) => {
    emitLobbyUpdate(event.room || getJoinedRoom())
  })

  smartFox.addEventListener(SFS2X.SFSEvent.USER_EXIT_ROOM, (event) => {
    emitLobbyUpdate(event.room || getJoinedRoom())
  })

  smartFox.addEventListener(SFS2X.SFSEvent.ROOM_VARIABLES_UPDATE, (event) => {
    emitLobbyUpdate(event.room || getJoinedRoom())
  })

  smartFox.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, () => {
    console.warn('[SmartFoxService] Conexion perdida, reseteando estado')
    stopHeartbeat()
    smartFoxInstance = null
    currentLoginName = null
    emitLobbyUpdate(null)
  })

  smartFox.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, (event) => {
    if (event.cmd === 'iniciarPartida') {
      console.log('[SmartFoxService] EXTENSION_RESPONSE iniciarPartida recibido:', event.params)
      const params = event.params
      const nombreSala = params && typeof params.getUtfString === 'function' ? params.getUtfString('nombreSala') : null
      const ok = params && typeof params.getBool === 'function' ? params.getBool('ok') : false

      iniciarPartidaListeners.forEach((listener, index) => {
        try {
          console.log('[SmartFoxService] Invocando listener iniciarPartida', index)
          listener({ nombreSala, ok })
          console.log('[SmartFoxService] Listener iniciarPartida', index, 'invocado')
        } catch (e) {
          console.warn('[SmartFoxService] Error en listener iniciarPartida:', e)
        }
      })
    } else if (event.cmd === 'jugadorSalaAsignada') {
      console.log('[SmartFoxService] EXTENSION_RESPONSE jugadorSalaAsignada recibido:', event.params)
      const params = event.params
      const nombreSala = params && typeof params.getUtfString === 'function' ? params.getUtfString('nombreSala') : null
      const numeroSala = params && typeof params.getUtfString === 'function' ? params.getUtfString('numeroSala') : null
      const ok = params && typeof params.getBool === 'function' ? params.getBool('ok') : false
      const message = params && typeof params.getUtfString === 'function' ? params.getUtfString('message') : null

      jugadorSalaAsignadaListeners.forEach((listener, index) => {
        try {
          console.log('[SmartFoxService] Invocando listener jugadorSalaAsignada', index)
          listener({ nombreSala, numeroSala, ok, message })
          console.log('[SmartFoxService] Listener jugadorSalaAsignada', index, 'invocado')
        } catch (e) {
          console.warn('[SmartFoxService] Error en listener jugadorSalaAsignada:', e)
        }
      })
    }
  })

  smartFox.addEventListener(SFS2X.SFSEvent.ROOM_JOIN, (event) => {
    const room = event.room
    console.log('[SmartFoxService] ROOM_JOIN event recibido:', room)

    if (!room) {
      console.warn('[SmartFoxService] ROOM_JOIN sin room, ignorando')
      return
    }

    const isGame = typeof room.isGame === 'function' ? room.isGame() : room.isGame
    const roomName = getRoomName(room)

    console.log('[SmartFoxService] Room - name:', roomName, 'isGame:', isGame)

    if (isGame && roomName.startsWith('Sala_')) {
      console.log('[SmartFoxService] *** SUB-SALA JOIN DETECTADO! *** roomName:', roomName)
      console.log('[SmartFoxService] Notificando a', roomJoinListeners.size, 'listeners')
      roomJoinListeners.forEach((listener, index) => {
        try {
          console.log('[SmartFoxService] Invocando listener', index, 'para roomName:', roomName)
          listener({ roomName, room })
          console.log('[SmartFoxService] Listener', index, 'invocado exitosamente')
        } catch (e) {
          console.warn('[SmartFoxService] Error notificando room join:', e)
        }
      })
    } else {
      console.log('[SmartFoxService] Room no es sub-sala de juego, ignorando')
    }
  })

  smartFox.addEventListener(SFS2X.SFSEvent.USER_ENTER_ROOM, (event) => {
    const room = event.room
    if (!room) {
      return
    }

    const isGame = typeof room.isGame === 'function' ? room.isGame() : room.isGame
    const roomName = getRoomName(room)

    if (isGame && roomName && roomName.startsWith('Sala_')) {
      console.log('[SmartFoxService] USER_ENTER_ROOM en sub-sala:', roomName)
      console.log('[SmartFoxService] Notificando a', roomEnterListeners.size, 'listeners de room enter')
      roomEnterListeners.forEach((listener, index) => {
        try {
          console.log('[SmartFoxService] Invocando roomEnter listener', index)
          listener({ roomName, room })
          console.log('[SmartFoxService] roomEnter listener', index, 'invocado')
        } catch (e) {
          console.warn('[SmartFoxService] Error notificando room enter:', e)
        }
      })
    }
  })
}

function createSmartFoxInstance() {
  const SFS2X = ensureSfsNamespace()

  smartFoxInstance = new SFS2X.SmartFox({
    debug: false
  })

  bindRuntimeListeners(smartFoxInstance, SFS2X)
  return smartFoxInstance
}

function resetConnectionState() {
  stopHeartbeat()
  if (smartFoxInstance && smartFoxInstance.isConnected) {
    try {
      smartFoxInstance.disconnect()
    } catch (error) {
      console.warn('[SmartFoxService] Error cerrando conexion previa:', error)
    }
  }

  smartFoxInstance = null
  currentLoginName = null
}

function getConnectedUsername() {
  if (!smartFoxInstance) return null
  if (smartFoxInstance.mySelf) {
    return getUserName(smartFoxInstance.mySelf) || currentLoginName
  }
  return currentLoginName
}

export async function ensureConnection(username) {
  const SFS2X = ensureSfsNamespace()
  const finalConfig = getCurrentConfig()
  const requestedUsername = (username || '').trim()

  if (!requestedUsername) {
    throw new Error('El nombre del jugador es obligatorio para conectarse a SmartFox')
  }

  console.log('[SmartFoxService] ensureConnection llamado para:', requestedUsername)

  if (smartFoxInstance && smartFoxInstance.isConnected && getConnectedUsername() === requestedUsername) {
    console.log('[SmartFoxService] Ya conectado como:', requestedUsername)
    return smartFoxInstance
  }

  if (smartFoxInstance && smartFoxInstance.isConnected && getConnectedUsername() !== requestedUsername) {
    console.log('[SmartFoxService] Reconectando con diferente usuario:', requestedUsername)
    resetConnectionState()
  }

  if (smartFoxInstance && !smartFoxInstance.isConnected) {
    console.log('[SmartFoxService] Instancia previa no conectada, reseteando')
    resetConnectionState()
  }

  const smartFox = smartFoxInstance || createSmartFoxInstance()

  return new Promise((resolve, reject) => {
    let finished = false

    const connectionTimeout = setTimeout(() => {
      finish(() => reject(new Error('Timeout: No se pudo conectar con SmartFoxServer en 10 segundos')))
    }, 10000)

    const cleanup = () => {
      clearTimeout(connectionTimeout)
      smartFox.removeEventListener(SFS2X.SFSEvent.CONNECTION, onConnection)
      smartFox.removeEventListener(SFS2X.SFSEvent.LOGIN, onLogin)
      smartFox.removeEventListener(SFS2X.SFSEvent.LOGIN_ERROR, onLoginError)
      smartFox.removeEventListener(
        SFS2X.SFSEvent.CONNECTION_LOST,
        onConnectionLost
      )
    }

    const finish = (callback) => {
      if (finished) return
      finished = true
      cleanup()
      callback()
    }

    const onConnection = (event) => {
      if (!event.success) {
        finish(() => reject(new Error('No fue posible conectar con SmartFoxServer')))
        return
      }

      try {
        smartFox.send(new SFS2X.LoginRequest(requestedUsername, '', null, finalConfig.zone))
      } catch (error) {
        finish(() => reject(error))
      }
    }

    const onLogin = () => {
      currentLoginName = requestedUsername
      startHeartbeat()
      finish(() => resolve(smartFox))
    }

    const onLoginError = (event) => {
      finish(() =>
        reject(
          new Error(
            `Login fallido en la zone ${finalConfig.zone}: ${event.errorMessage}`
          )
        )
      )
    }

    const onConnectionLost = (event) => {
      stopHeartbeat()
      finish(() =>
        reject(
          new Error(
            `Conexion perdida con SmartFoxServer: ${event.reason || 'sin motivo'}`
          )
        )
      )
    }

    smartFox.addEventListener(SFS2X.SFSEvent.CONNECTION, onConnection)
    smartFox.addEventListener(SFS2X.SFSEvent.LOGIN, onLogin)
    smartFox.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, onLoginError)
    smartFox.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, onConnectionLost)

    try {
      if (smartFox.isConnected) {
        smartFox.send(new SFS2X.LoginRequest(requestedUsername, '', null, finalConfig.zone))
      } else {
        smartFox.connect(finalConfig.host, finalConfig.port)
      }
    } catch (error) {
      finish(() => reject(error))
    }
  })
}

function createRoomVariable(name, value) {
  const SFS2X = ensureSfsNamespace()
  return new SFS2X.SFSRoomVariable(name, value)
}

async function waitRoomJoin(roomName, action) {
  const SFS2X = ensureSfsNamespace()
  const smartFox = smartFoxInstance

  if (!smartFox) {
    throw new Error('No hay conexion activa con SmartFox')
  }

  return new Promise((resolve, reject) => {
    let finished = false

    const cleanup = () => {
      smartFox.removeEventListener(SFS2X.SFSEvent.ROOM_ADD, onRoomAdd)
      smartFox.removeEventListener(
        SFS2X.SFSEvent.ROOM_CREATION_ERROR,
        onRoomCreationError
      )
    }

    const finish = (callback) => {
      if (finished) return
      finished = true
      cleanup()
      callback()
    }

    const onRoomAdd = (event) => {
      if (getRoomName(event.room) !== roomName) {
        return
      }

      console.log('[SmartFoxService] Sala creada exitosamente:', roomName)
      finish(() => resolve(buildLobbyData(event.room)))
    }

    const onRoomCreationError = (event) => {
      console.error('[SmartFoxService] Error creando sala:', event.errorMessage)
      finish(() => reject(new Error(event.errorMessage || 'No fue posible crear la room')))
    }

    smartFox.addEventListener(SFS2X.SFSEvent.ROOM_ADD, onRoomAdd)
    smartFox.addEventListener(
      SFS2X.SFSEvent.ROOM_CREATION_ERROR,
      onRoomCreationError
    )

    try {
      action()
    } catch (error) {
      finish(() => reject(error))
    }
  })
}

async function waitRoomJoinEvent(roomName, action) {
  const SFS2X = ensureSfsNamespace()
  const smartFox = smartFoxInstance

  if (!smartFox) {
    throw new Error('No hay conexion activa con SmartFox')
  }

  return new Promise((resolve, reject) => {
    let finished = false

    const cleanup = () => {
      smartFox.removeEventListener(SFS2X.SFSEvent.ROOM_JOIN, onRoomJoin)
      smartFox.removeEventListener(
        SFS2X.SFSEvent.ROOM_JOIN_ERROR,
        onRoomJoinError
      )
    }

    const finish = (callback) => {
      if (finished) return
      finished = true
      cleanup()
      callback()
    }

    const onRoomJoin = (event) => {
      if (getRoomName(event.room) !== roomName) {
        return
      }

      console.log('[SmartFoxService] Sala unida exitosamente:', roomName)
      finish(() => resolve(buildLobbyData(event.room)))
    }

    const onRoomJoinError = (event) => {
      console.error('[SmartFoxService] Error uniendose a sala:', event.errorMessage)
      finish(() => reject(new Error(event.errorMessage || 'No fue posible unirse a la room')))
    }

    smartFox.addEventListener(SFS2X.SFSEvent.ROOM_JOIN, onRoomJoin)
    smartFox.addEventListener(
      SFS2X.SFSEvent.ROOM_JOIN_ERROR,
      onRoomJoinError
    )

    try {
      action()
    } catch (error) {
      finish(() => reject(error))
    }
  })
}

export function getSmartFoxInstance() {
  return smartFoxInstance
}

export function getConfig() {
  return { ...config }
}

export function updateConfig(newConfig) {
  config = { ...DEFAULT_CONFIG, ...newConfig }
}

export async function testSmartFoxPing() {
  const SFS2X = ensureSfsNamespace()
  const finalConfig = getCurrentConfig()

  const pingFox = new SFS2X.SmartFox({ debug: false })

  return new Promise((resolve, reject) => {
    let finished = false

    const cleanup = () => {
      pingFox.removeEventListener(SFS2X.SFSEvent.CONNECTION, onConnection)
      pingFox.removeEventListener(SFS2X.SFSEvent.CONNECTION_LOST, onConnectionLost)
      pingFox.removeEventListener(SFS2X.SFSEvent.LOGIN, onLogin)
      pingFox.removeEventListener(SFS2X.SFSEvent.LOGIN_ERROR, onLoginError)
      pingFox.removeEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, onExtensionResponse)
    }

    const finish = (callback) => {
      if (finished) return
      finished = true
      cleanup()
      callback()
    }

    const onConnection = (event) => {
      if (!event.success) {
        finish(() => {
          try { pingFox.disconnect() } catch (e) {}
          reject(new Error('No fue posible conectar con SmartFoxServer'))
        })
        return
      }

      try {
        const pingUsername = `ping_client_${Date.now()}`
        pingFox.send(new SFS2X.LoginRequest(pingUsername, '', null, finalConfig.zone))
      } catch (error) {
        finish(() => {
          try { pingFox.disconnect() } catch (e) {}
          reject(error)
        })
      }
    }

    const onConnectionLost = () => {
      finish(() => {
        try { pingFox.disconnect() } catch (e) {}
        reject(new Error('Conexion perdida con SmartFoxServer'))
      })
    }

    const onLogin = () => {
      try {
        pingFox.send(new SFS2X.ExtensionRequest('ping', new SFS2X.SFSObject()))
      } catch (error) {
        finish(() => {
          try { pingFox.disconnect() } catch (e) {}
          reject(error)
        })
      }
    }

    const onLoginError = (event) => {
      finish(() => {
        try { pingFox.disconnect() } catch (e) {}
        reject(new Error(`Login fallido en la zone ${finalConfig.zone}: ${event.errorMessage}`))
      })
    }

    const onExtensionResponse = (event) => {
      if (event.cmd !== 'pong') {
        return
      }

      finish(() => {
        try { pingFox.disconnect() } catch (e) {}
        resolve({
          cmd: event.cmd,
          params: event.params
        })
      })
    }

    pingFox.addEventListener(SFS2X.SFSEvent.CONNECTION, onConnection)
    pingFox.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, onConnectionLost)
    pingFox.addEventListener(SFS2X.SFSEvent.LOGIN, onLogin)
    pingFox.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, onLoginError)
    pingFox.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, onExtensionResponse)

    try {
      pingFox.connect(finalConfig.host, finalConfig.port)
    } catch (error) {
      finish(() => {
        try { pingFox.disconnect() } catch (e) {}
        reject(error)
      })
    }
  })
}

export function subscribeToLobbyUpdates(listener) {
  if (typeof listener !== 'function') {
    return () => {}
  }

  lobbyListeners.add(listener)
  return () => {
    lobbyListeners.delete(listener)
  }
}

export function subscribeToRoomJoin(listener) {
  if (typeof listener !== 'function') {
    return () => {}
  }

  console.log('[SmartFoxService] Registrando subscribeToRoomJoin - total listeners:', roomJoinListeners.size + 1)
  roomJoinListeners.add(listener)
  return () => {
    console.log('[SmartFoxService] Dando de baja subscribeToRoomJoin - listeners restantes:', roomJoinListeners.size - 1)
    roomJoinListeners.delete(listener)
  }
}

const roomEnterListeners = new Set()

export function subscribeToRoomEnter(listener) {
  if (typeof listener !== 'function') {
    return () => {}
  }

  console.log('[SmartFoxService] Registrando subscribeToRoomEnter - total listeners:', roomEnterListeners.size + 1)
  roomEnterListeners.add(listener)
  return () => {
    console.log('[SmartFoxService] Dando de baja subscribeToRoomEnter - listeners restantes:', roomEnterListeners.size - 1)
    roomEnterListeners.delete(listener)
  }
}

const iniciarPartidaListeners = new Set()

export function subscribeToIniciarPartida(listener) {
  if (typeof listener !== 'function') {
    return () => {}
  }

  console.log('[SmartFoxService] Registrando subscribeToIniciarPartida - total listeners:', iniciarPartidaListeners.size + 1)
  iniciarPartidaListeners.add(listener)
  return () => {
    console.log('[SmartFoxService] Dando de baja subscribeToIniciarPartida - listeners restantes:', iniciarPartidaListeners.size - 1)
    iniciarPartidaListeners.delete(listener)
  }
}

const jugadorSalaAsignadaListeners = new Set()

export function subscribeToJugadorSalaAsignada(listener) {
  if (typeof listener !== 'function') {
    return () => {}
  }

  console.log('[SmartFoxService] Registrando subscribeToJugadorSalaAsignada - total listeners:', jugadorSalaAsignadaListeners.size + 1)
  jugadorSalaAsignadaListeners.add(listener)
  return () => {
    console.log('[SmartFoxService] Dando de baja subscribeToJugadorSalaAsignada - listeners restantes:', jugadorSalaAsignadaListeners.size - 1)
    jugadorSalaAsignadaListeners.delete(listener)
  }
}

export async function createLobbyRoom(lobbyCode, hostName) {
  const SFS2X = ensureSfsNamespace()
  const normalizedCode = (lobbyCode || '').trim().toUpperCase()
  const normalizedHost = (hostName || '').trim()

  if (!normalizedCode) {
    throw new Error('El codigo del lobby es obligatorio')
  }

  if (!normalizedHost) {
    throw new Error('El nombre del anfitrion es obligatorio')
  }

  console.log('[SmartFoxService] Creando lobby room:', normalizedCode, 'host:', normalizedHost)

  const smartFox = await ensureConnection(normalizedHost)
  const settings = new SFS2X.RoomSettings(normalizedCode)
  settings.groupId = LOBBY_GROUP_ID
  settings.maxUsers = LOBBY_MAX_USERS
  settings.isGame = true
  settings.variables = [
    createRoomVariable('hostName', normalizedHost),
    createRoomVariable('status', 'waiting'),
    createRoomVariable('createdAt', new Date().toISOString())
  ]

  console.log('[SmartFoxService] RoomSettings creadas, enviando CreateRoomRequest')

  return waitRoomJoin(normalizedCode, () => {
    smartFox.send(new SFS2X.CreateRoomRequest(settings, true))
  })
}

export async function joinLobbyRoom(lobbyCode, playerName) {
  const SFS2X = ensureSfsNamespace()
  const normalizedCode = (lobbyCode || '').trim().toUpperCase()
  const normalizedPlayer = (playerName || '').trim()

  if (!normalizedCode) {
    throw new Error('El codigo del lobby es obligatorio')
  }

  if (!normalizedPlayer) {
    throw new Error('El nombre del jugador es obligatorio')
  }

  console.log('[SmartFoxService] Uniendose a lobby:', normalizedCode, 'como:', normalizedPlayer)

  const smartFox = await ensureConnection(normalizedPlayer)

  return waitRoomJoinEvent(normalizedCode, () => {
    smartFox.send(new SFS2X.JoinRoomRequest(normalizedCode))
  })
}

export function getCurrentLobbyState() {
  return buildLobbyData()
}

export async function leaveCurrentRoom() {
  const SFS2X = ensureSfsNamespace()
  const smartFox = smartFoxInstance
  const room = getJoinedRoom()

  if (!smartFox || !smartFox.isConnected || !room) {
    return { ok: true, skipped: true }
  }

  return new Promise((resolve, reject) => {
    let finished = false

    const cleanup = () => {
      smartFox.removeEventListener(SFS2X.SFSEvent.USER_EXIT_ROOM, onExit)
      smartFox.removeEventListener(
        SFS2X.SFSEvent.CONNECTION_LOST,
        onConnectionLost
      )
    }

    const finish = (callback) => {
      if (finished) return
      finished = true
      cleanup()
      callback()
    }

    const onExit = () => {
      finish(() => {
        emitLobbyUpdate(null)
        resolve({ ok: true })
      })
    }

    const onConnectionLost = (event) => {
      finish(() =>
        reject(
          new Error(
            `Conexion perdida con SmartFoxServer: ${event.reason || 'sin motivo'}`
          )
        )
      )
    }

    smartFox.addEventListener(SFS2X.SFSEvent.USER_EXIT_ROOM, onExit)
    smartFox.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, onConnectionLost)

    try {
      smartFox.send(new SFS2X.LeaveRoomRequest(room))
      setTimeout(() => {
        finish(() => {
          emitLobbyUpdate(null)
          resolve({ ok: true, timeoutFallback: true })
        })
      }, 1000)
    } catch (error) {
      finish(() => reject(error))
    }
  })
}

export function registerUser(username, password) {
  return sendExtensionRequest('register', { username, password })
}

export function loginUser(username, password) {
  return sendExtensionRequest('login', { username, password })
}

export function sendExtensionRequest(command, params) {
  const SFS2X = getSfsNamespace()

  if (!SFS2X) {
    return Promise.reject(
      new Error('No se encontro la API JavaScript de SmartFoxServer')
    )
  }

  if (smartFoxInstance && !smartFoxInstance.isConnected) {
    console.warn('[SmartFoxService] Conexion perdida, reseteando instancia')
    resetConnectionState()
  }

  const smartFox = smartFoxInstance || createSmartFoxInstance()

  return new Promise((resolve, reject) => {
    const sfsParams = new SFS2X.SFSObject()

    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        sfsParams.putUtfString(key, params[key])
      }
    }

    const onExtensionResponse = (event) => {
      if (
        event.cmd !== command &&
        event.cmd !== 'requestError'
      ) {
        return
      }

      smartFox.removeEventListener(
        SFS2X.SFSEvent.EXTENSION_RESPONSE,
        onExtensionResponse
      )

      console.log('[SmartFoxService] Respuesta recibida - cmd:', event.cmd)
      console.log('[SmartFoxService] Params keys:', event.params ? Object.keys(event.params) : 'null')

      if (event.cmd === 'requestError') {
        const errorMsg = event.params ? event.params.getUtfString('errorMessage') || 'Error desconocido' : 'Error desconocido'
        console.error('[SmartFoxService] Error del servidor:', errorMsg)
        reject(new Error(errorMsg))
        return
      }

      try {
        const data = {}
        const params = event.params

        if (params && typeof params.getBool === 'function') {
          data.ok = params.getBool('ok')
        }
        if (params && typeof params.getUtfString === 'function') {
          data.message = params.getUtfString('message') || ''
          data.nombreSala = params.getUtfString('nombreSala') || ''
          data.numeroSala = params.getUtfString('numeroSala') || ''
          data.zone = params.getUtfString('zone') || ''
          data.initializedAt = params.getUtfString('initializedAt') || ''
          data.note = params.getUtfString('note') || ''
          const jugadoresStr = params.getUtfString('jugadores')
          if (jugadoresStr) {
            data.jugadores = JSON.parse(jugadoresStr)
          }
        }
        if (params && typeof params.getInt === 'function') {
          data.commandsProcessed = params.getInt('commandsProcessed')
        }

        console.log('[SmartFoxService] Datos parseados:', data)

        if (data.ok === false) {
          reject(new Error(data.message || 'Error desconocido'))
        } else {
          resolve(data)
        }
      } catch (error) {
        console.error('[SmartFoxService] Error parseando respuesta:', error)
        resolve({ ok: true, message: 'Respuesta recibida pero no se pudo parsear' })
      }
    }

    if (!smartFox.isConnected) {
      reject(new Error('La conexion SmartFox debe inicializarse antes de usar ExtensionRequest'))
      return
    }

    smartFox.addEventListener(
      SFS2X.SFSEvent.EXTENSION_RESPONSE,
      onExtensionResponse
    )
    smartFox.send(new SFS2X.ExtensionRequest(command, sfsParams))
  })
}
