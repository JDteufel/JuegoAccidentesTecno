/**
 * SmartFoxService - Maneja la conexión con SmartFoxServer
 *
 * Provee una interfaz limpia para conectar, enviar comandos y recibir respuestas.
 */

const DEFAULT_CONFIG = {
  host: '127.0.0.1',
  port: 9933,
  zone: 'JuegoAccidentesTecno'
}

let smartFoxInstance = null
let config = { ...DEFAULT_CONFIG }

function getSfsNamespace() {
  return window.SFS2X || null
}

function createSmartFoxInstance() {
  const SFS2X = getSfsNamespace()

  if (!SFS2X) {
    throw new Error('La API de SmartFox no esta cargada en window.SFS2X')
  }

  smartFoxInstance = new SFS2X.SmartFox({
    debug: false
  })

  return smartFoxInstance
}

/**
 * Obtiene la instancia de SmartFox
 * @returns {Object} Instancia de SmartFox o null
 */
export function getSmartFoxInstance() {
  return smartFoxInstance
}

/**
 * Obtiene la configuración actual
 * @returns {Object} Configuración de conexión
 */
export function getConfig() {
  return { ...config }
}

/**
 * Actualiza la configuración
 * @param {Object} newConfig - Nueva configuración
 */
export function updateConfig(newConfig) {
  config = { ...DEFAULT_CONFIG, ...newConfig }
}

export function testSmartFoxPing() {
  const SFS2X = getSfsNamespace()

  if (!SFS2X) {
    return Promise.reject(
      new Error('No se encontro la API JavaScript de SmartFoxServer')
    )
  }

  const finalConfig = {
    ...DEFAULT_CONFIG,
    ...config
  }

  return new Promise((resolve, reject) => {
    const smartFox = createSmartFoxInstance()
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
        smartFox.send(new SFS2X.LoginRequest('', '', finalConfig.zone))
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
        smartFox.send(
          new SFS2X.ExtensionRequest('ping', new SFS2X.SFSObject())
        )
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

/**
 * Registra un nuevo usuario en el servidor
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Promise} Promesa con el resultado
 */
export function registerUser(username, password) {
  return sendExtensionRequest('register', { username, password })
}

/**
 * Inicia sesión con credenciales
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Promise} Promesa con el resultado
 */
export function loginUser(username, password) {
  return sendExtensionRequest('login', { username, password })
}

/**
 * Envía una solicitud de extensión al servidor
 * @param {string} command - Comando a ejecutar
 * @param {Object} params - Parámetros
 * @returns {Promise} Promesa con la respuesta
 */
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

    // Agregar parámetros
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        sfsParams.putUtfString(key, params[key])
      }
    }

    const onExtensionResponse = (event) => {
      if (event.cmd !== command && event.cmd !== 'requestError' && event.cmd !== 'registerSuccess' && event.cmd !== 'loginSuccess') {
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
        // Si no es JSON, intentar obtener directamente
        if (event.params.getUtfString('cmd') === command) {
          resolve({ ok: true })
        } else {
          reject(error)
        }
      }
    }

    // Verificar si hay conexión
    if (!smartFox.isConnected()) {
      // Conectar primero
      smartFox.addEventListener(SFS2X.SFSEvent.CONNECTION, () => {
        smartFox.send(new SFS2X.ExtensionRequest(command, sfsParams))
      })
      smartFox.addEventListener(
        SFS2X.SFSEvent.CONNECTION_LOST,
        () => reject(new Error('Conexion perdida'))
      )
      smartFox.connect(config.host || DEFAULT_CONFIG.host, config.port || DEFAULT_CONFIG.port)
    } else {
      smartFox.addEventListener(
        SFS2X.SFSEvent.EXTENSION_RESPONSE,
        onExtensionResponse
      )
      smartFox.send(new SFS2X.ExtensionRequest(command, sfsParams))
    }
  })
}
