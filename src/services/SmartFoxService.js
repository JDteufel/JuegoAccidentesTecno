/**
 * SmartFoxService - Maneja la conexion con SmartFoxServer
 *
 * Provee helpers para conectar, autenticar y trabajar con rooms dinamicas.
 */

const DEFAULT_CONFIG = {
  host: '127.0.0.1',
  port: 9933,
  zone: 'JuegoAccidentesTecno'
}

const LOBBY_GROUP_ID = 'default'
const LOBBY_MAX_USERS = 16

let smartFoxInstance = null
let config = { ...DEFAULT_CONFIG }
let currentLoginName = null
const lobbyListeners = new Set()

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

  const players = getRoomUsers(room).map((user, index) => ({
    name: getUserName(user),
    role: index === 0 ? 'host' : 'guest',
    joinedAt: null
  }))

  return {
    ok: true,
    lobbyCode: getRoomName(room),
    hostName:
      getRoomVariableValue(room, 'hostName', null) ||
      players[0]?.name ||
      currentLoginName,
    status: getRoomVariableValue(room, 'status', 'waiting'),
    createdAt: getRoomVariableValue(room, 'createdAt', null),
    playerCount: players.length,
    players
  }
}

function emitLobbyUpdate(room = getJoinedRoom()) {
  const lobbyData = buildLobbyData(room)

  lobbyListeners.forEach((listener) => {
    try {
      listener(lobbyData)
    } catch (error) {
      console.warn('[SmartFoxService] Error notificando lobby:', error)
    }
  })
}

function bindRuntimeListeners(smartFox, SFS2X) {
  if (smartFox._juegoAccidentesRuntimeBound) {
    return
  }

  smartFox._juegoAccidentesRuntimeBound = true

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
    currentLoginName = null
    emitLobbyUpdate(null)
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
  if (smartFoxInstance && smartFoxInstance.isConnected()) {
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

async function ensureConnection(username) {
  const SFS2X = ensureSfsNamespace()
  const finalConfig = getCurrentConfig()
  const requestedUsername = (username || '').trim()

  if (!requestedUsername) {
    throw new Error('El nombre del jugador es obligatorio para conectarse a SmartFox')
  }

  if (
    smartFoxInstance &&
    smartFoxInstance.isConnected() &&
    getConnectedUsername() === requestedUsername
  ) {
    return smartFoxInstance
  }

  if (
    smartFoxInstance &&
    smartFoxInstance.isConnected() &&
    getConnectedUsername() !== requestedUsername
  ) {
    resetConnectionState()
  }

  const smartFox = smartFoxInstance || createSmartFoxInstance()

  return new Promise((resolve, reject) => {
    let finished = false

    const cleanup = () => {
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
        smartFox.send(new SFS2X.LoginRequest(requestedUsername, '', finalConfig.zone))
      } catch (error) {
        finish(() => reject(error))
      }
    }

    const onLogin = () => {
      currentLoginName = requestedUsername
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
      if (smartFox.isConnected()) {
        smartFox.send(new SFS2X.LoginRequest(requestedUsername, '', finalConfig.zone))
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
      smartFox.removeEventListener(SFS2X.SFSEvent.ROOM_JOIN, onRoomJoin)
      smartFox.removeEventListener(
        SFS2X.SFSEvent.ROOM_JOIN_ERROR,
        onRoomJoinError
      )
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

    const onRoomJoin = (event) => {
      if (getRoomName(event.room) !== roomName) {
        return
      }

      finish(() => resolve(buildLobbyData(event.room)))
    }

    const onRoomJoinError = (event) => {
      finish(() => reject(new Error(event.errorMessage || 'No fue posible unirse a la room')))
    }

    const onRoomCreationError = (event) => {
      finish(() => reject(new Error(event.errorMessage || 'No fue posible crear la room')))
    }

    smartFox.addEventListener(SFS2X.SFSEvent.ROOM_JOIN, onRoomJoin)
    smartFox.addEventListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, onRoomJoinError)
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
  const smartFox = createSmartFoxInstance()

  return new Promise((resolve, reject) => {
    let finished = false

    const cleanup = () => {
      smartFox.removeEventListener(SFS2X.SFSEvent.CONNECTION, onConnection)
      smartFox.removeEventListener(
        SFS2X.SFSEvent.CONNECTION_LOST,
        onConnectionLost
      )
      smartFox.removeEventListener(SFS2X.SFSEvent.LOGIN, onLogin)
      smartFox.removeEventListener(SFS2X.SFSEvent.LOGIN_ERROR, onLoginError)
      smartFox.removeEventListener(
        SFS2X.SFSEvent.EXTENSION_RESPONSE,
        onExtensionResponse
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
        smartFox.send(new SFS2X.LoginRequest('ping_client', '', finalConfig.zone))
      } catch (error) {
        finish(() => reject(error))
      }
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

    const onLogin = () => {
      try {
        smartFox.send(new SFS2X.ExtensionRequest('ping', new SFS2X.SFSObject()))
      } catch (error) {
        finish(() => reject(error))
      }
    }

    const onLoginError = (event) => {
      finish(() =>
        reject(new Error(`Login fallido en la zone ${finalConfig.zone}: ${event.errorMessage}`))
      )
    }

    const onExtensionResponse = (event) => {
      if (event.cmd !== 'pong') {
        return
      }

      finish(() =>
        resolve({
          cmd: event.cmd,
          params: event.params
        })
      )
    }

    smartFox.addEventListener(SFS2X.SFSEvent.CONNECTION, onConnection)
    smartFox.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, onConnectionLost)
    smartFox.addEventListener(SFS2X.SFSEvent.LOGIN, onLogin)
    smartFox.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, onLoginError)
    smartFox.addEventListener(
      SFS2X.SFSEvent.EXTENSION_RESPONSE,
      onExtensionResponse
    )

    try {
      smartFox.connect(finalConfig.host, finalConfig.port)
    } catch (error) {
      finish(() => reject(error))
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

  const smartFox = await ensureConnection(normalizedHost)
  const settings = new SFS2X.SFSRoomSettings(normalizedCode)
  settings.groupId = LOBBY_GROUP_ID
  settings.maxUsers = LOBBY_MAX_USERS
  settings.isGame = true
  settings.isPublic = true
  settings.autoRemoveMode = SFS2X.SFSRoomRemoveMode.WHEN_EMPTY
  settings.variables = [
    createRoomVariable('hostName', normalizedHost),
    createRoomVariable('status', 'waiting'),
    createRoomVariable('createdAt', new Date().toISOString())
  ]

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

  const smartFox = await ensureConnection(normalizedPlayer)

  return waitRoomJoin(normalizedCode, () => {
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

  if (!smartFox || !smartFox.isConnected() || !room) {
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

function sendExtensionRequest(command, params) {
  const SFS2X = getSfsNamespace()

  if (!SFS2X) {
    return Promise.reject(
      new Error('No se encontro la API JavaScript de SmartFoxServer')
    )
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
        event.cmd !== 'requestError' &&
        event.cmd !== 'registerSuccess' &&
        event.cmd !== 'loginSuccess'
      ) {
        return
      }

      smartFox.removeEventListener(
        SFS2X.SFSEvent.EXTENSION_RESPONSE,
        onExtensionResponse
      )

      try {
        const data = JSON.parse(event.params.getUtfString('data'))
        if (data.ok === false) {
          reject(new Error(data.message))
        } else {
          resolve(data)
        }
      } catch (error) {
        if (event.params.getUtfString('cmd') === command) {
          resolve({ ok: true })
        } else {
          reject(error)
        }
      }
    }

    if (!smartFox.isConnected()) {
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
