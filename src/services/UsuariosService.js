import mongoDBService from './MongoDBService.js'
import temaService from './TemaService.js'

class UsuariosService {
  constructor() {
    this.usuariosRegistrados = {}
  }
  async registrar(username, password, tema = 'clasico') {
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
      const result = await mongoDBService.registerUser(username, password, tema)
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
      const normalizedUsername = username.toLowerCase()
      this.usuariosRegistrados[normalizedUsername] = {
        username: username,
        password: password,
        tema: result.tema || tema,
        createdAt: new Date().toISOString()
      }
      await mongoDBService.logEvent('USUARIO', 'register', {
        username: normalizedUsername
      })
      return {
        ok: true,
        message: 'Gamemaster registrado exitosamente',
        user: {
          username: username,
          tema: result.tema || tema,
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
  async login(username, password) {
    if (!username || !password) {
      return {
        ok: false,
        message: 'Usuario y contraseña son obligatorios'
      }
    }
    try {
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
      const normalizedUsername = username.toLowerCase()
      this.usuariosRegistrados[normalizedUsername] = {
        username: result.username,
        password: password,
        tema: result.tema || 'clasico',
        createdAt: new Date().toISOString()
      }
      await mongoDBService.logEvent('USUARIO', 'login_success', {
        username: normalizedUsername
      })
      return {
        ok: true,
        message: 'Login exitoso',
        user: {
          username: result.username,
          tema: result.tema || 'clasico',
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
  async actualizarTema(username, tema) {
    try {
      const result = await mongoDBService.actualizarTemaUsuario(username, tema)
      if (!result.ok) {
        return { ok: false, message: result.message || 'Error al actualizar tema' }
      }
      const normalizedUsername = username.toLowerCase()
      if (this.usuariosRegistrados[normalizedUsername]) {
        this.usuariosRegistrados[normalizedUsername].tema = tema
      }
      return { ok: true, tema: result.tema }
    } catch (error) {
      return { ok: false, message: `Error al actualizar tema: ${error.message}` }
    }
  }
  obtenerTemaUsuario(username) {
    const normalizedUsername = username.toLowerCase()
    const user = this.usuariosRegistrados[normalizedUsername]
    return user ? (user.tema || 'clasico') : null
  }
  obtenerUsuario(username) {
    const normalizedUsername = username.toLowerCase()
    return this.usuariosRegistrados[normalizedUsername] || null
  }
  obtenerTodos() {
    return Object.values(this.usuariosRegistrados)
  }
  existe(username) {
    const normalizedUsername = username.toLowerCase()
    return !!this.usuariosRegistrados[normalizedUsername]
  }
  async inicializar() {
    try {
      const result = await mongoDBService.getAllUsers()
      if (result.usuarios && Array.isArray(result.usuarios)) {
        result.usuarios.forEach(user => {
          const normalized = user.username.toLowerCase()
          this.usuariosRegistrados[normalized] = {
            username: user.username,
            password: user.password,
            tema: user.tema || 'clasico',
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
const usuariosService = new UsuariosService()
export default usuariosService
export { UsuariosService }
