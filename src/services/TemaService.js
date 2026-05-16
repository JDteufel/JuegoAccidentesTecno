import * as BABYLON from '@babylonjs/core'
import usuariosService from './UsuariosService.js'

export const TEMAS = {
  CLASICO: 'clasico',
  MODERNO: 'moderno'
}

export const TEMAS_DISPONIBLES = [
  {
    id: TEMAS.CLASICO,
    nombre: 'Clásico',
    descripcion: 'Tema casino/madera con tonos cálidos',
    preview: ['#d66a1f', '#a84f16', '#3c2d27', '#2b211d', '#ffe6d1']
  },
  {
    id: TEMAS.MODERNO,
    nombre: 'Moderno',
    descripcion: 'Tech educativo con tonos slate e índigo',
    preview: ['#6366f1', '#0ea5e9', '#334155', '#1e293b', '#f1f5f9']
  }
]

export function obtenerColoresTema(temaId) {
  const temas = {
    clasico: {
      overlay: 'rgba(12, 9, 8, 0.48)',
      overlayFull: 'rgba(12, 9, 8, 0.64)',
      topbar: 'rgba(18, 14, 13, 0.72)',
      cardBg: 'rgba(28, 20, 18, 0.92)',
      cardBgSolid: 'rgba(28, 21, 18, 0.95)',
      inputBg: '#2b211d',
      inputFocused: '#352821',
      itemEven: '#2f221d',
      itemOdd: '#3a2a24',
      primary: '#d66a1f',
      primaryText: '#fff7ef',
      secondary: '#a84f16',
      secondaryText: '#fff1e3',
      dark: '#3c2d27',
      darkText: '#ffd6b7',
      darkAlt: '#362924',
      darkAltText: '#ffd8bc',
      danger: '#a84f16',
      dangerText: '#fff1e3',
      badgeBg: 'rgba(168, 90, 42, 0.4)',
      border: '#8a4a20',
      borderAlt: '#8e4d22',
      textPrimary: '#ffe6d1',
      textSecondary: '#ffd9bd',
      textBody: '#f4cbaa',
      textInput: '#fff2e8',
      placeholder: '#d6a98a',
      error: '#ff6b6b',
      badgeWork: '#90ee90',
      badgeEntertainment: '#ffa500',
      sceneBg: new BABYLON.Color4(0.07, 0.05, 0.05, 1),
      matPrimDiffuse: new BABYLON.Color3(0.92, 0.4, 0.1),
      matPrimEmissive: new BABYLON.Color3(0.33, 0.12, 0.04),
      matSecDiffuse: new BABYLON.Color3(0.96, 0.65, 0.24),
      matSecEmissive: new BABYLON.Color3(0.18, 0.08, 0.03),
      matRingDiffuse: new BABYLON.Color3(0.98, 0.74, 0.3),
      matRingEmissive: new BABYLON.Color3(0.2, 0.11, 0.04),
      matMesa: new BABYLON.Color3(0.3, 0.19, 0.11),
      matMesaSpecular: new BABYLON.Color3(0.12, 0.08, 0.04),
      matMesaEmissive: new BABYLON.Color3(0.015, 0.008, 0.004),
      matResplandor: new BABYLON.Color3(0.12, 0.07, 0.03),
      matResplandorEmissive: new BABYLON.Color3(0.03, 0.015, 0.006),
      matTablero: new BABYLON.Color3(0.56, 0.36, 0.2),
      matTableroSpecular: new BABYLON.Color3(0.22, 0.14, 0.07),
      matTableroEmissive: new BABYLON.Color3(0.03, 0.015, 0.008),
      matTapete: new BABYLON.Color3(0.21, 0.31, 0.28),
      matTapeteSpecular: new BABYLON.Color3(0.05, 0.06, 0.05),
      matTapeteEmissive: new BABYLON.Color3(0.012, 0.02, 0.017),
      matMarco: new BABYLON.Color3(0.34, 0.24, 0.15),
      matMarcoSpecular: new BABYLON.Color3(0.14, 0.1, 0.06),
      matMarcoEmissive: new BABYLON.Color3(0.02, 0.01, 0.005),
      matLinea: new BABYLON.Color3(0.63, 0.46, 0.24),
      matLineaEmissive: new BABYLON.Color3(0.063, 0.046, 0.024),
      matLineaSecundaria: new BABYLON.Color3(0.48, 0.37, 0.22),
      matZonaAccidente: new BABYLON.Color3(0.4, 0.18, 0.12),
      matCarruselPlataforma: new BABYLON.Color3(0.31, 0.18, 0.12),
      matCarruselSello: new BABYLON.Color3(0.68, 0.5, 0.24),
      matCarruselSelloEmissive: new BABYLON.Color3(0.02, 0.01, 0.004),
      matCartaBase: new BABYLON.Color3(0.2, 0.13, 0.09),
      matCartaBaseEmissive: new BABYLON.Color3(0.008, 0.004, 0.002),
      matCartaCara: [
        new BABYLON.Color3(0.63, 0.29, 0.19),
        new BABYLON.Color3(0.62, 0.39, 0.18),
        new BABYLON.Color3(0.55, 0.33, 0.2),
        new BABYLON.Color3(0.45, 0.27, 0.18)
      ],
      hemisfericaDiffuse: new BABYLON.Color3(0.95, 0.85, 0.74),
      hemisfericaGround: new BABYLON.Color3(0.22, 0.12, 0.07),
      spotPrincipalDiffuse: new BABYLON.Color3(0.98, 0.8, 0.58),
      spotPrincipalSpecular: new BABYLON.Color3(0.65, 0.5, 0.32),
      spotContrasteDiffuse: new BABYLON.Color3(0.46, 0.38, 0.28),
      spotContrasteSpecular: new BABYLON.Color3(0.14, 0.12, 0.1),
      luzAmbienteDiffuse: new BABYLON.Color3(0.64, 0.48, 0.34),
      luzRellenoDiffuse: new BABYLON.Color3(0.34, 0.29, 0.24),
      ambientColor: new BABYLON.Color3(0.18, 0.12, 0.08),
      hudPanelBg: 'rgba(23, 17, 14, 0.88)',
      hudBorderColor: '#8e4d22',
      hudTextColor: '#ffe2c8',
      hudSubtextColor: '#f4cbaa',
      hudEstadoBg: ['#2d221d', '#5a2e1d', '#2d221d', '#3a2a1d'],
      hudProgresoBg: '#1a1210',
      hudProgresoColor: '#d66a1f',
      hudBotonVolverBg: '#362924',
      hudBotonReiniciarBg: '#5a3321',
      hudBotonTextColor: '#ffd8bc',
      hudCartaBg: 'rgba(28, 20, 18, 0.92)',
      hudCartaBorder: '#a85a2a',
      hudCartaVaciaBg: 'rgba(33, 23, 19, 0.4)',
      hudCartaVaciaBorder: '#4a3528',
      hudZonaIntercambioIcono: '#a88a6a',
      nombreJugadorColor: '#ffe2c8',
      panelAccidentesBorder: '#8e4d22',
      panelAccidentesBg: 'rgba(28, 20, 16, 0.97)',
      panelInicioBorder: '#8e4d22',
      panelInicioBg: 'rgba(28, 20, 16, 0.95)'
    },
    moderno: {
      overlay: 'rgba(15, 23, 42, 0.7)',
      overlayFull: 'rgba(15, 23, 42, 0.85)',
      topbar: 'rgba(30, 41, 59, 0.85)',
      cardBg: 'rgba(30, 41, 59, 0.95)',
      cardBgSolid: 'rgba(30, 41, 59, 0.97)',
      inputBg: '#1e293b',
      inputFocused: '#263348',
      itemEven: '#1e293b',
      itemOdd: '#253349',
      primary: '#6366f1',
      primaryText: '#f1f5f9',
      secondary: '#0ea5e9',
      secondaryText: '#f1f5f9',
      dark: '#334155',
      darkText: '#cbd5e1',
      darkAlt: '#334155',
      darkAltText: '#cbd5e1',
      danger: '#ef4444',
      dangerText: '#f1f5f9',
      badgeBg: 'rgba(99, 102, 241, 0.3)',
      border: '#334155',
      borderAlt: '#475569',
      textPrimary: '#f1f5f9',
      textSecondary: '#94a3b8',
      textBody: '#cbd5e1',
      textInput: '#f1f5f9',
      placeholder: '#64748b',
      error: '#f43f5e',
      badgeWork: '#22c55e',
      badgeEntertainment: '#f97316',
      sceneBg: new BABYLON.Color4(0.06, 0.09, 0.16, 1),
      matPrimDiffuse: new BABYLON.Color3(0.39, 0.4, 0.95),
      matPrimEmissive: new BABYLON.Color3(0.15, 0.16, 0.35),
      matSecDiffuse: new BABYLON.Color3(0.05, 0.65, 0.91),
      matSecEmissive: new BABYLON.Color3(0.02, 0.2, 0.28),
      matRingDiffuse: new BABYLON.Color3(0.39, 0.4, 0.95),
      matRingEmissive: new BABYLON.Color3(0.2, 0.2, 0.5),
      matMesa: new BABYLON.Color3(0.06, 0.09, 0.16),
      matMesaSpecular: new BABYLON.Color3(0.03, 0.04, 0.06),
      matMesaEmissive: new BABYLON.Color3(0.02, 0.03, 0.06),
      matResplandor: new BABYLON.Color3(0.06, 0.09, 0.16),
      matResplandorEmissive: new BABYLON.Color3(0.02, 0.03, 0.06),
      matTablero: new BABYLON.Color3(0.12, 0.16, 0.23),
      matTableroSpecular: new BABYLON.Color3(0.05, 0.06, 0.09),
      matTableroEmissive: new BABYLON.Color3(0.03, 0.04, 0.07),
      matTapete: new BABYLON.Color3(0.06, 0.12, 0.2),
      matTapeteSpecular: new BABYLON.Color3(0.02, 0.04, 0.06),
      matTapeteEmissive: new BABYLON.Color3(0.01, 0.02, 0.04),
      matMarco: new BABYLON.Color3(0.2, 0.25, 0.35),
      matMarcoSpecular: new BABYLON.Color3(0.06, 0.08, 0.12),
      matMarcoEmissive: new BABYLON.Color3(0.04, 0.05, 0.08),
      matLinea: new BABYLON.Color3(0.39, 0.4, 0.95),
      matLineaEmissive: new BABYLON.Color3(0.12, 0.13, 0.3),
      matLineaSecundaria: new BABYLON.Color3(0.25, 0.28, 0.55),
      matZonaAccidente: new BABYLON.Color3(0.96, 0.25, 0.37),
      matCarruselPlataforma: new BABYLON.Color3(0.12, 0.16, 0.23),
      matCarruselSello: new BABYLON.Color3(0.39, 0.4, 0.95),
      matCarruselSelloEmissive: new BABYLON.Color3(0.15, 0.16, 0.35),
      matCartaBase: new BABYLON.Color3(0.12, 0.16, 0.23),
      matCartaBaseEmissive: new BABYLON.Color3(0.03, 0.04, 0.06),
      matCartaCara: [
        new BABYLON.Color3(0.39, 0.4, 0.95),
        new BABYLON.Color3(0.05, 0.65, 0.91),
        new BABYLON.Color3(0.35, 0.3, 0.8),
        new BABYLON.Color3(0.15, 0.55, 0.85)
      ],
      hemisfericaDiffuse: new BABYLON.Color3(0.7, 0.75, 0.9),
      hemisfericaGround: new BABYLON.Color3(0.1, 0.15, 0.25),
      spotPrincipalDiffuse: new BABYLON.Color3(0.8, 0.85, 1.0),
      spotPrincipalSpecular: new BABYLON.Color3(0.5, 0.55, 0.8),
      spotContrasteDiffuse: new BABYLON.Color3(0.3, 0.4, 0.7),
      spotContrasteSpecular: new BABYLON.Color3(0.15, 0.2, 0.4),
      luzAmbienteDiffuse: new BABYLON.Color3(0.4, 0.45, 0.7),
      luzRellenoDiffuse: new BABYLON.Color3(0.2, 0.25, 0.4),
      ambientColor: new BABYLON.Color3(0.08, 0.12, 0.2),
      hudPanelBg: 'rgba(15, 23, 42, 0.9)',
      hudBorderColor: '#475569',
      hudTextColor: '#f1f5f9',
      hudSubtextColor: '#94a3b8',
      hudEstadoBg: ['#1e293b', '#1e3a5f', '#1e293b', '#253349'],
      hudProgresoBg: '#0f172a',
      hudProgresoColor: '#6366f1',
      hudBotonVolverBg: '#334155',
      hudBotonReiniciarBg: '#475569',
      hudBotonTextColor: '#cbd5e1',
      hudCartaBg: 'rgba(30, 41, 59, 0.95)',
      hudCartaBorder: '#475569',
      hudCartaVaciaBg: 'rgba(30, 41, 59, 0.4)',
      hudCartaVaciaBorder: '#475569',
      hudZonaIntercambioIcono: '#64748b',
      nombreJugadorColor: '#f1f5f9',
      panelAccidentesBorder: '#475569',
      panelAccidentesBg: 'rgba(15, 23, 42, 0.97)',
      panelInicioBorder: '#475569',
      panelInicioBg: 'rgba(15, 23, 42, 0.95)'
    }
  }

  return temas[temaId] || temas.clasico
}

class TemaService {
  constructor() {
    this.temaActual = TEMAS.CLASICO
    this.listeners = []
  }

  obtenerTemaActual() {
    return this.temaActual
  }

  async cargarTemaInicial(usuario) {
    if (usuario) {
      const temaUsuario = usuariosService.obtenerTemaUsuario(usuario)
      if (temaUsuario && [TEMAS.CLASICO, TEMAS.MODERNO].includes(temaUsuario)) {
        this.temaActual = temaUsuario
        this._guardarLocal(temaUsuario)
        return temaUsuario
      }
    }
    const temaLocal = this._obtenerLocal()
    if (temaLocal && [TEMAS.CLASICO, TEMAS.MODERNO].includes(temaLocal)) {
      this.temaActual = temaLocal
      return temaLocal
    }
    this.temaActual = TEMAS.CLASICO
    return TEMAS.CLASICO
  }

  async cambiarTema(temaId) {
    if (![TEMAS.CLASICO, TEMAS.MODERNO].includes(temaId)) {
      console.error(`[TemaService] Tema no valido: ${temaId}`)
      return
    }
    this.temaActual = temaId
    this._guardarLocal(temaId)

    const usuario = this._obtenerUsuarioActual()
    if (usuario) {
      try {
        await usuariosService.actualizarTema(usuario, temaId)
      } catch (error) {
        console.error('[TemaService] Error sincronizando tema con servidor:', error)
      }
    }

    this._notificarCambio(temaId)
  }

  obtenerColoresTema(temaId) {
    return obtenerColoresTema(temaId || this.temaActual)
  }

  onCambioTema(callback) {
    this.listeners.push(callback)
  }

  _guardarLocal(temaId) {
    try {
      localStorage.setItem('tema-preferido', temaId)
    } catch (e) {
      console.warn('[TemaService] No se pudo guardar en localStorage:', e)
    }
  }

  _obtenerLocal() {
    try {
      return localStorage.getItem('tema-preferido')
    } catch (e) {
      return null
    }
  }

  _obtenerUsuarioActual() {
    if (typeof window !== 'undefined' && window.estadoAppGlobal) {
      return window.estadoAppGlobal.getUsername()
    }
    return null
  }

  _notificarCambio(temaId) {
    this.listeners.forEach(cb => cb(temaId))
  }
}

const temaService = new TemaService()
export default temaService
