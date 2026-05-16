const REST_BRIDGE_ORIGIN = 'http://127.0.0.1:3000'
const REST_BRIDGE_API_URL = `${REST_BRIDGE_ORIGIN}/api`

class MongoDBService {
  constructor() {
    this.serverUrl = REST_BRIDGE_ORIGIN
    this.baseUrl = REST_BRIDGE_API_URL
  }

  normalizarErrorConexion(error) {
    const rawMessage = error?.message || 'Error de red'
    const normalizedMessage = rawMessage.toLowerCase()

    if (
      normalizedMessage.includes('failed to fetch') ||
      normalizedMessage.includes('load failed') ||
      normalizedMessage.includes('networkerror') ||
      normalizedMessage.includes('fetch failed')
    ) {
      return `No se pudo conectar con el servicio de usuarios en ${this.serverUrl}. Inicie el rest-bridge para usar registro e inicio de sesión.`
    }

    return rawMessage
  }

  async request(endpoint, data = {}, method = 'POST', callback = null) {
    const url = `${this.baseUrl}${endpoint}`

    try {
      const options = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      if (method !== 'GET' && Object.keys(data).length > 0) {
        options.body = JSON.stringify(data)
      }
      const response = await fetch(url, options)
      const responseText = await response.text()
      const result = responseText ? JSON.parse(responseText) : {}

      if (!response.ok) {
        const errorResult = {
          ok: false,
          status: response.status,
          message: result.message || `Error HTTP ${response.status}`
        }

        if (callback) {
          callback(errorResult, response.status)
        }

        return errorResult
      }

      if (callback) {
        callback(result, response.status)
      }
      return result
    } catch (error) {
      const message = this.normalizarErrorConexion(error)
      console.error(`[MongoDBService] Error en ${endpoint}:`, message)
      if (callback) {
        callback({ error: message }, 500)
      }
      return { error: message }
    }
  }

  async registerUser(username, password, tema = 'clasico', callback = null) {
    return this.request('/usuarios/register', {
      username: username,
      password: password,
      tema: tema
    }, 'POST', callback)
  }
  async loginUser(username, password, callback = null) {
    return this.request('/usuarios/login', {
      username: username,
      password: password
    }, 'POST', callback)
  }
  async actualizarTemaUsuario(username, tema, callback = null) {
    return this.request(`/usuarios/${username}/tema`, {
      tema: tema
    }, 'PATCH', callback)
  }
  async getUser(username, callback = null) {
    const result = await this.getAllUsers()
    if (!result.ok || !Array.isArray(result.usuarios)) {
      if (callback) {
        callback(result, result.status || 500)
      }
      return result
    }

    const normalizedUsername = (username || '').toLowerCase()
    const user = result.usuarios.find(
      (usuario) => usuario.username.toLowerCase() === normalizedUsername
    )

    const response = user
      ? { ok: true, user }
      : { ok: false, status: 404, message: 'Usuario no encontrado' }

    if (callback) {
      callback(response, response.status || 200)
    }

    return response
  }

  async getAllUsers(callback = null) {
    return this.request('/usuarios', {}, 'GET', callback)
  }
  async logEvent(type, action, details = {}, callback = null) {
    return this.request('/logs', { type, action, details }, 'POST', callback)
  }

  async getLogs(category = null, callback = null) {
    const endpoint = category ? `/logs?type=${category}` : '/logs'
    return this.request(endpoint, {}, 'GET', callback)
  }

  async clearLogs(category = null, callback = null) {
    const endpoint = category ? `/logs?type=${category}` : '/logs'
    return this.request(endpoint, {}, 'DELETE', callback)
  }

  async createPartida(data, callback = null) {
    const response = {
      ok: false,
      skipped: true,
      message: 'Endpoint de partidas no implementado en rest-bridge'
    }
    if (callback) {
      callback(response, 501)
    }
    return response
  }

  async getPartida(partidaId, callback = null) {
    const response = {
      ok: false,
      skipped: true,
      message: 'Endpoint de partidas no implementado en rest-bridge'
    }
    if (callback) {
      callback(response, 501)
    }
    return response
  }

  async getAllPartidas(callback = null) {
    const response = {
      ok: true,
      skipped: true,
      partidas: []
    }
    if (callback) {
      callback(response, 200)
    }
    return response
  }

  async updatePartida(partidaId, data, callback = null) {
    const response = {
      ok: false,
      skipped: true,
      message: 'Endpoint de partidas no implementado en rest-bridge'
    }
    if (callback) {
      callback(response, 501)
    }
    return response
  }

  async deletePartida(partidaId, callback = null) {
    const response = {
      ok: false,
      skipped: true,
      message: 'Endpoint de partidas no implementado en rest-bridge'
    }
    if (callback) {
      callback(response, 501)
    }
    return response
  }

  async healthCheck(callback = null) {
    try {
      const response = await fetch(`${this.serverUrl}/health`)
      const result = await response.json()

      if (callback) {
        callback(result, response.status)
      }

      return result
    } catch (error) {
      const message = this.normalizarErrorConexion(error)
      console.error('[MongoDBService] Error en /health:', message)
      if (callback) {
        callback({ error: message }, 500)
      }
      return { error: message }
    }
  }

  async checkConnection() {
    try {
      const result = await this.healthCheck()
      if (result.status === 'ok') {
        console.log('[MongoDBService] ✅ Conexión verificada')
        return { ok: true, message: 'Conectado a MongoDB vía REST Bridge' }
      }
      console.warn('[MongoDBService] ⚠️ Servidor respondió pero sin estatus ok:', result)
      return { ok: false, message: 'Estatus incierto' }
    } catch (error) {
      console.error('[MongoDBService] ❌ Error de conexión:', error.message)
      return { ok: false, message: error.message }
    }
  }
}
const mongoDBService = new MongoDBService()
export default mongoDBService
export { MongoDBService }
