import mongoDBService from './MongoDBService.js'
class UsuariosService {
  constructor() {
    this.usuariosRegistrados = {} 
  }
  async registrar(username, password) {
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
      const normalizedUsername = username.toLowerCase()
      this.usuariosRegistrados[normalizedUsername] = {
        username: username,
        password: password,
        createdAt: new Date().toISOString()
      }
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
