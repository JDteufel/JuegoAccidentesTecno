const DEFAULT_CONFIG = {
  host: '127.0.0.1',
  port: 9933,
  zone: 'JuegoAccidentesTecno'
}

function getSfsNamespace() {
  return window.SFS2X || null
}

function createSmartFoxInstance() {
  const SFS2X = getSfsNamespace()

  if (!SFS2X) {
    throw new Error('La API de SmartFox no esta cargada en window.SFS2X')
  }

  return new SFS2X.SmartFox({
    debug: false
  })
}

export function testSmartFoxPing(config = {}) {
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
