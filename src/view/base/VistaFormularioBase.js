import { GestorAjusteRatio } from './GestorAjusteRatio.js'
import temaService from '../../services/TemaService.js'
import '../estilos/EstiloVistaFormularioBase.css'

export class VistaFormularioBase {
  constructor() {
    this.onVolverCallback = null
    this.onAccionCallback = null
    this.campos = []
    this.accionButton = null
    this.containerEl = null
    this.tarjetaEl = null
    this.errorEl = null
  }

  crear() {
    const configuracion = this.obtenerConfiguracionFormulario()
    const esMovil = GestorAjusteRatio.esMovil()

    const container = document.createElement('div')
    container.id = configuracion.nombreOverlay
    container.className = 'formulario-overlay'
    container.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;display:none;justify-content:center;align-items:center;padding:${esMovil ? '12px' : '20px'};`
    document.body.appendChild(container)
    this.containerEl = container

    const tarjeta = document.createElement('div')
    tarjeta.className = 'formulario-tarjeta'
    tarjeta.style.minHeight = esMovil ? 'auto' : '400px'
    tarjeta.style.borderRadius = esMovil ? '18px' : '28px'
    tarjeta.style.padding = esMovil ? '24px 18px' : '40px'
    container.appendChild(tarjeta)
    this.tarjetaEl = tarjeta

    const titulo = document.createElement('h2')
    titulo.textContent = configuracion.titulo
    titulo.className = 'formulario-titulo'
    titulo.style.fontSize = esMovil ? '26px' : '32px'
    titulo.style.marginBottom = esMovil ? '20px' : '30px'
    tarjeta.appendChild(titulo)

    this.campos = []
    configuracion.campos.forEach((campo) => {
      const campoInput = this._crearCampoEntrada(campo)
      this.campos.push({ nombre: campo.nombre, control: campoInput })
      tarjeta.appendChild(campoInput.element)
    })

    this.errorEl = document.createElement('div')
    this.errorEl.className = 'formulario-error'
    tarjeta.appendChild(this.errorEl)

    this.accionButton = this._crearBoton(
      configuracion.textoBotonAccion,
      'primary',
      () => this.onAccionCallback && this.onAccionCallback()
    )
    this.accionButton.style.marginTop = '15px'
    tarjeta.appendChild(this.accionButton)

    const btnVolver = this._crearBoton(
      'Volver al Menú',
      'dark',
      () => this.onVolverCallback && this.onVolverCallback()
    )
    btnVolver.style.marginTop = '10px'
    tarjeta.appendChild(btnVolver)

    this._configurarNavegacionEnter()
  }

  _crearCampoEntrada({ nombre, placeholder, isPassword = false, showPasswordButton = false }) {
    const esMovil = GestorAjusteRatio.esMovil()
    const wrapper = document.createElement('div')
    wrapper.className = 'formulario-campo-wrapper'
    wrapper.style.width = esMovil ? '90%' : '76%'

    const input = document.createElement('input')
    input.type = isPassword ? 'password' : 'text'
    input.placeholder = placeholder
    input.autocomplete = 'off'
    input.autocorrect = 'off'
    input.autocapitalize = 'off'
    input.spellcheck = false
    input.className = 'formulario-input'
    input.style.height = esMovil ? '48px' : '54px'
    const colores = temaService.obtenerColoresTema(temaService.obtenerTemaActual())
    input.addEventListener('focus', () => input.style.background = colores.inputFocused)
    input.addEventListener('blur', () => input.style.background = colores.inputBg)

    wrapper.appendChild(input)

    let toggleBtn = null
    if (showPasswordButton) {
      toggleBtn = document.createElement('button')
      toggleBtn.textContent = 'Ver'
      toggleBtn.className = 'formulario-toggle-btn'
      toggleBtn.style.width = esMovil ? '70px' : '80px'
      toggleBtn.style.height = esMovil ? '48px' : '54px'
      this._agregarFeedbackBoton(toggleBtn)

      let passwordVisible = false
      toggleBtn.addEventListener('click', () => {
        passwordVisible = !passwordVisible
        input.type = passwordVisible ? 'text' : 'password'
        toggleBtn.textContent = passwordVisible ? 'Ocultar' : 'Ver'
      })

      wrapper.appendChild(toggleBtn)
    }

    return {
      element: wrapper,
      input,
      getValue: () => input.value || '',
      clear: () => { input.value = '' },
      focus: () => input.focus()
    }
  }

  _crearBoton(texto, temaClave, callback) {
    const esMovil = GestorAjusteRatio.esMovil()
    const colores = temaService.obtenerColoresTema(temaService.obtenerTemaActual())
    let fondo, colorTexto
    if (temaClave === 'primary') {
      fondo = colores.primary
      colorTexto = colores.primaryText
    } else if (temaClave === 'secondary') {
      fondo = colores.secondary
      colorTexto = colores.secondaryText
    } else if (temaClave === 'dark') {
      fondo = colores.darkAlt
      colorTexto = colores.darkAltText
    } else {
      fondo = colores.darkAlt
      colorTexto = colores.darkAltText
    }
    const btn = document.createElement('button')
    btn.textContent = texto
    btn.className = 'formulario-boton'
    btn.style.width = esMovil ? '90%' : '320px'
    btn.style.background = fondo
    btn.style.color = colorTexto
    btn.style.fontSize = esMovil ? '19px' : '22px'
    this._agregarFeedbackBoton(btn)
    btn.addEventListener('click', callback)
    return btn
  }

  _agregarFeedbackBoton(btn) {
    const aplicarActivo = () => {
      btn.style.opacity = '0.85'
      btn.style.transform = 'scale(0.98)'
    }
    const removerActivo = () => {
      btn.style.opacity = '1'
      btn.style.transform = 'scale(1)'
    }
    btn.addEventListener('mouseenter', aplicarActivo)
    btn.addEventListener('mouseleave', removerActivo)
    btn.addEventListener('touchstart', aplicarActivo, { passive: true })
    btn.addEventListener('touchend', removerActivo, { passive: true })
    btn.addEventListener('touchcancel', removerActivo, { passive: true })
  }

  _configurarNavegacionEnter() {
    const camposInput = this.campos.map(c => c.control)

    camposInput.forEach((campo, index) => {
      campo.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          const siguiente = index + 1
          if (siguiente < camposInput.length) {
            camposInput[siguiente].focus()
          } else if (this.onAccionCallback) {
            this.onAccionCallback()
          }
        }
      })
    })
  }

  obtenerConfiguracionFormulario() {
    throw new Error('La subclase debe implementar obtenerConfiguracionFormulario()')
  }

  onVolver(callback) {
    this.onVolverCallback = callback
  }

  onAccion(callback) {
    this.onAccionCallback = callback
  }

  getValorCampo(nombre) {
    const campo = this.campos.find(c => c.nombre === nombre)
    return campo ? campo.control.getValue() : ''
  }

  mostrarError(mensaje) {
    if (this.errorEl) {
      this.errorEl.textContent = mensaje
      this.errorEl.style.visibility = 'visible'
    }
  }

  limpiarError() {
    if (this.errorEl) {
      this.errorEl.textContent = ''
      this.errorEl.style.visibility = 'hidden'
    }
  }

  mostrarCargando(mostrar) {

  }

  limpiarCampos() {
    this.campos.forEach((campo) => {
      campo.control.clear()
    })
    this.limpiarError()
  }

  mostrar() {
    if (this.containerEl) this.containerEl.style.display = 'flex'
    if (!GestorAjusteRatio.esMovil()) {
      this._enfocarPrimerCampo()
    }
  }

  ocultar() {
    if (this.containerEl) this.containerEl.style.display = 'none'
  }

  _enfocarPrimerCampo() {
    if (this.campos.length > 0) {
      setTimeout(() => this.campos[0].control.focus(), 50)
    }
  }

  aplicarTema(temaId) {
    const colores = temaService.obtenerColoresTema(temaId)

    if (this.accionButton) {
      this.accionButton.style.background = colores.primary
      this.accionButton.style.color = colores.primaryText
    }

    const botones = this.containerEl?.querySelectorAll('.formulario-boton')
    if (botones) {
      botones.forEach(btn => {
        if (btn.textContent === 'Volver al Menú') {
          btn.style.background = colores.darkAlt
          btn.style.color = colores.darkAltText
        }
      })
    }

    this.campos.forEach(campo => {
      if (campo.control && campo.control.input) {
        const input = campo.control.input
        input.style.background = colores.inputBg
        const focusHandler = () => input.style.background = colores.inputFocused
        const blurHandler = () => input.style.background = colores.inputBg
        input.removeEventListener('focus', focusHandler)
        input.removeEventListener('blur', blurHandler)
        input.addEventListener('focus', focusHandler)
        input.addEventListener('blur', blurHandler)
      }
    })
  }
}
