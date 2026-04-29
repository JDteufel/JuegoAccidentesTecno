/**
 * MongoDBService
 * 
 * Servicio centralizado para la comunicación con MongoDB a través del REST Bridge.
 * Proporciona métodos para CRUD de usuarios, logs y partidas.
 * 
 * Patrón: Singleton (instancia única)
 */

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

  /**
   * Método genérico para hacer requests HTTP
   * @param {string} endpoint - Ruta del endpoint (ej: '/usuarios/register')
   * @param {object} data - Datos a enviar
   * @param {string} method - Método HTTP (GET, POST, PUT, DELETE)
   * @param {function} callback - Callback con respuesta
   */
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

  /**
   * Registra un nuevo usuario en MongoDB
   */
  async registerUser(username, password, callback = null) {
    return this.request('/usuarios/register', {
      username: username,
      password: password
    }, 'POST', callback)
  }

  /**
   * Inicia sesión de un usuario en MongoDB
   */
  async loginUser(username, password, callback = null) {
    return this.request('/usuarios/login', {
      username: username,
      password: password
    }, 'POST', callback)
  }

  /**
   * Obtiene un usuario por nombre
   */
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

  /**
   * Obtiene todos los usuarios
   */
  async getAllUsers(callback = null) {
    return this.request('/usuarios', {}, 'GET', callback)
  }

  /**
   * Registra un log en MongoDB
   */
  async logEvent(type, action, details = {}, callback = null) {
    const response = {
      ok: true,
      skipped: true,
      message: 'Endpoint de logs no implementado en rest-bridge',
      type,
      action,
      details
    }
    if (callback) {
      callback(response, 200)
    }
    return response
  }

  /**
   * Obtiene logs por categoría
   */
  async getLogs(category = null, callback = null) {
    const response = {
      ok: true,
      skipped: true,
      logs: [],
      category
    }
    if (callback) {
      callback(response, 200)
    }
    return response
  }

  /**
   * Limpia los logs
   */
  async clearLogs(category = null, callback = null) {
    const response = {
      ok: true,
      skipped: true,
      message: 'Limpieza de logs no implementada en rest-bridge',
      category
    }
    if (callback) {
      callback(response, 200)
    }
    return response
  }

  /**
   * Crea una nueva partida
   */
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

  /**
   * Obtiene una partida por ID
   */
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

  /**
   * Obtiene todas las partidas
   */
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

  /**
   * Actualiza una partida
   */
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

  /**
   * Elimina una partida
   */
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

  /**
   * Verifica el estado del REST Bridge
   */
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

  /**
   * Verifica la conexión a MongoDB (llamada a salud del servidor)
   */
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

// Singleton: exportar instancia única
const mongoDBService = new MongoDBService()
export default mongoDBService
export { MongoDBService }
