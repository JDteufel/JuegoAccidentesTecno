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

    const container = document.createElement('div')
    container.id = configuracion.nombreOverlay
    container.style.cssText = `
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      display: none;
      justify-content: center;
      align-items: center;
      background: rgba(12, 9, 8, 0.64);
      z-index: 100;
      font-family: 'Comic Sans MS', cursive;
    `
    document.body.appendChild(container)
    this.containerEl = container

    const tarjeta = document.createElement('div')
    tarjeta.style.cssText = `
      width: 720px;
      max-width: 92vw;
      height: 620px;
      max-height: 90vh;
      border-radius: 28px;
      border: 2px solid #8e4d22;
      background: rgba(28, 21, 18, 0.95);
      box-shadow: 0 14px 22px rgba(0,0,0,0.4);
      padding: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    `
    container.appendChild(tarjeta)
    this.tarjetaEl = tarjeta

    const titulo = document.createElement('h2')
    titulo.textContent = configuracion.titulo
    titulo.style.cssText = `
      color: #ffe4cf;
      font-size: 30px;
      margin: 0 0 30px 0;
      text-align: center;
    `
    tarjeta.appendChild(titulo)

    this.campos = []
    configuracion.campos.forEach((campo) => {
      const campoInput = this._crearCampoEntrada(campo)
      this.campos.push({ nombre: campo.nombre, control: campoInput })
      tarjeta.appendChild(campoInput.element)
    })

    this.errorEl = document.createElement('div')
    this.errorEl.style.cssText = `
      color: #ff6b6b;
      font-size: 16px;
      height: 40px;
      text-align: center;
      visibility: hidden;
      margin-top: 10px;
    `
    tarjeta.appendChild(this.errorEl)

    this.accionButton = this._crearBoton(
      configuracion.textoBotonAccion,
      '#d66a1f',
      '#fff7ef',
      () => this.onAccionCallback && this.onAccionCallback()
    )
    this.accionButton.style.marginTop = '15px'
    tarjeta.appendChild(this.accionButton)

    const btnVolver = this._crearBoton(
      'Volver al Menú',
      '#362924',
      '#ffd8bc',
      () => this.onVolverCallback && this.onVolverCallback()
    )
    btnVolver.style.marginTop = '10px'
    tarjeta.appendChild(btnVolver)

    this._configurarNavegacionEnter()
  }

  _crearCampoEntrada({ nombre, placeholder, isPassword = false, showPasswordButton = false }) {
    const wrapper = document.createElement('div')
    wrapper.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      width: 76%;
      max-width: 520px;
    `

    const input = document.createElement('input')
    input.type = isPassword ? 'password' : 'text'
    input.placeholder = placeholder
    input.style.cssText = `
      flex: 1;
      height: 54px;
      padding: 0 14px;
      color: #fff2e8;
      background: #2b211d;
      border: 2px solid transparent;
      border-radius: 16px;
      font-size: 20px;
      font-family: 'Comic Sans MS', cursive;
      outline: none;
      transition: background 0.2s;
    `
    input.addEventListener('focus', () => input.style.background = '#352821')
    input.addEventListener('blur', () => input.style.background = '#2b211d')

    wrapper.appendChild(input)

    let toggleBtn = null
    if (showPasswordButton) {
      toggleBtn = document.createElement('button')
      toggleBtn.textContent = 'Ver'
      toggleBtn.style.cssText = `
        width: 80px;
        height: 54px;
        color: #ffd8bc;
        background: #4a3328;
        border: 2px solid #8e4d22;
        border-radius: 16px;
        font-size: 16px;
        font-family: 'Comic Sans MS', cursive;
        cursor: pointer;
        transition: opacity 0.2s;
      `
      toggleBtn.addEventListener('mouseenter', () => toggleBtn.style.opacity = '0.85')
      toggleBtn.addEventListener('mouseleave', () => toggleBtn.style.opacity = '1')

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

  _crearBoton(texto, fondo, color, callback) {
    const btn = document.createElement('button')
    btn.textContent = texto
    btn.style.cssText = `
      width: 320px;
      height: 52px;
      border: none;
      border-radius: 18px;
      background: ${fondo};
      color: ${color};
      font-size: 21px;
      font-family: 'Comic Sans MS', cursive;
      cursor: pointer;
      transition: transform 0.2s, opacity 0.2s;
    `
    btn.addEventListener('mouseenter', () => {
      btn.style.opacity = '0.85'
      btn.style.transform = 'scale(1.05)'
    })
    btn.addEventListener('mouseleave', () => {
      btn.style.opacity = '1'
      btn.style.transform = 'scale(1)'
    })
    btn.addEventListener('click', callback)
    return btn
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
    this._enfocarPrimerCampo()
  }

  ocultar() {
    if (this.containerEl) this.containerEl.style.display = 'none'
  }

  _enfocarPrimerCampo() {
    if (this.campos.length > 0) {
      setTimeout(() => this.campos[0].control.focus(), 50)
    }
  }
}
