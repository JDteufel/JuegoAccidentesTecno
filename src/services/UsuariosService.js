/**
 * UsuariosService
 * 
 * Servicio para gestionar usuarios del juego.
 * Maneja registro, login, validaciones y persistencia en MongoDB.
 * 
 * Patrón: Singleton + Repository
 */

import mongoDBService from './MongoDBService.js'

class UsuariosService {
  constructor() {
    this.usuariosRegistrados = {} // Caché local: { username: { username, password, createdAt } }
  }

  /**
   * Registra un nuevo usuario
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {object} { ok: boolean, message: string, user: object }
   */
  async registrar(username, password) {
    // Validaciones locales
    if (!username || username.length < 3) {
      return {
        ok: false,
        message: 'El usuario debe tener al menos 3 caracteres'
      }
    }

    if (!password || password.length < 4) {
      return {
        ok: false,
        message: 'La contraseña debe tener al menos 4 caracteres'
      }
    }

    try {
      // Registrar en MongoDB a través del REST Bridge
      const result = await mongoDBService.registerUser(username, password)

      if (result.error) {
        return {
          ok: false,
          message: result.error
        }
      }

      if (!result.ok) {
        return {
          ok: false,
          message: result.message || 'Error al registrar'
        }
      }

      // Guardar en caché local
      const normalizedUsername = username.toLowerCase()
      this.usuariosRegistrados[normalizedUsername] = {
        username: username,
        password: password,
        createdAt: new Date().toISOString()
      }

      // Log del evento
      await mongoDBService.logEvent('USUARIO', 'register', {
        username: normalizedUsername
      })

      return {
        ok: true,
        message: 'Usuario registrado exitosamente',
        user: {
          username: username,
          createdAt: this.usuariosRegistrados[normalizedUsername].createdAt
        }
      }
    } catch (error) {
      return {
        ok: false,
        message: `Error al registrar: ${error.message}`
      }
    }
  }

  /**
   * Autentica un usuario existente
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {object} { ok: boolean, message: string, user: object }
   */
  async login(username, password) {
    if (!username || !password) {
      return {
        ok: false,
        message: 'Usuario y contraseña son obligatorios'
      }
    }

    try {
      // Autenticar en MongoDB a través del REST Bridge
      const result = await mongoDBService.loginUser(username, password)

      if (result.error) {
        return {
          ok: false,
          message: result.error
        }
      }

      if (!result.ok) {
        return {
          ok: false,
          message: result.message || 'Credenciales inválidas'
        }
      }

      // Guardar en caché local
      const normalizedUsername = username.toLowerCase()
      this.usuariosRegistrados[normalizedUsername] = {
        username: result.username,
        password: password,
        createdAt: new Date().toISOString()
      }

      // Log del éxito
      await mongoDBService.logEvent('USUARIO', 'login_success', {
        username: normalizedUsername
      })

      return {
        ok: true,
        message: 'Login exitoso',
        user: {
          username: result.username,
          createdAt: this.usuariosRegistrados[normalizedUsername].createdAt
        }
      }
    } catch (error) {
      return {
        ok: false,
        message: `Error al iniciar sesión: ${error.message}`
      }
    }
  }

  /**
   * Obtiene un usuario del caché local
   * @param {string} username - Nombre de usuario
   * @returns {object | null}
   */
  obtenerUsuario(username) {
    const normalizedUsername = username.toLowerCase()
    return this.usuariosRegistrados[normalizedUsername] || null
  }

  /**
   * Obtiene todos los usuarios registrados
   * @returns {array}
   */
  obtenerTodos() {
    return Object.values(this.usuariosRegistrados)
  }

  /**
   * Verifica si un usuario existe
   * @param {string} username - Nombre de usuario
   * @returns {boolean}
   */
  existe(username) {
    const normalizedUsername = username.toLowerCase()
    return !!this.usuariosRegistrados[normalizedUsername]
  }

  /**
   * Carga usuarios desde MongoDB al inicializar
   */
  async inicializar() {
    try {
      const result = await mongoDBService.getAllUsers()
      if (result.usuarios && Array.isArray(result.usuarios)) {
        result.usuarios.forEach(user => {
          const normalized = user.username.toLowerCase()
          this.usuariosRegistrados[normalized] = {
            username: user.username,
            password: user.password,
            createdAt: user.createdAt
          }
        })
        console.log(`[UsuariosService] Cargados ${result.usuarios.length} usuarios`)
      }
    } catch (error) {
      console.error('[UsuariosService] Error al inicializar:', error)
    }
  }
}

// Singleton: exportar instancia única
const usuariosService = new UsuariosService()
export default usuariosService
export { UsuariosService }
