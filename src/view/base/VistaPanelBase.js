import * as GUI from '@babylonjs/gui'

export class VistaPanelBase {
  constructor(gui) {
    this.gui = gui
    this.overlay = null
  }

  crearOverlay(nombre, background = 'rgba(12, 9, 8, 0.64)') {
    const overlay = new GUI.Rectangle(nombre)
    overlay.width = 1
    overlay.height = 1
    overlay.thickness = 0
    overlay.background = background
    overlay.isVisible = false
    this.gui.addControl(overlay)
    return overlay
  }

  crearTarjetaBase(nombre) {
    const tarjeta = new GUI.Rectangle(nombre)
    tarjeta.width = '720px'
    tarjeta.height = '620px'
    tarjeta.maxWidth = 0.92
    tarjeta.maxHeight = 0.9
    tarjeta.cornerRadius = 28
    tarjeta.thickness = 2
    tarjeta.color = '#8e4d22'
    tarjeta.background = 'rgba(28, 21, 18, 0.95)'
    tarjeta.shadowColor = '#00000066'
    tarjeta.shadowBlur = 22
    tarjeta.shadowOffsetX = 0
    tarjeta.shadowOffsetY = 14
    return tarjeta
  }

  crearTexto({
    nombre,
    texto,
    tamano,
    alto,
    top = '0px',
    color = '#ffe4cf'
  }) {
    const bloque = new GUI.TextBlock(nombre, texto)
    bloque.width = '82%'
    bloque.height = alto
    bloque.color = color
    bloque.fontSize = tamano
    bloque.fontFamily = 'Comic Sans MS'
    bloque.textWrapping = true
    bloque.top = top
    return bloque
  }

  crearBoton({
    nombre,
    texto,
    top,
    callback,
    fondo = '#d66a1f',
    color = '#fff7ef',
    left = '0px',
    width = '320px',
    height = '52px'
  }) {
    const boton = GUI.Button.CreateSimpleButton(nombre, texto)
    boton.width = width
    boton.height = height
    boton.top = top
    boton.left = left
    boton.color = color
    boton.background = fondo
    boton.cornerRadius = 18
    boton.thickness = 0
    boton.fontSize = 21
    boton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    if (boton.textBlock) {
      boton.textBlock.fontFamily = 'Comic Sans MS'
    }
    boton.onPointerUpObservable.add(callback)
    return boton
  }

  crearCampoEntrada({
    nombre,
    placeholder,
    top,
    isPassword = false,
    showPasswordButton = false
  }) {
    const input = new GUI.InputText(nombre)
    input.width = showPasswordButton ? '68%' : '76%'
    input.height = '54px'
    input.top = top
    input.color = '#fff2e8'
    input.background = '#2b211d'
    input.focusedBackground = '#352821'
    input.thickness = 2
    input.cornerRadius = 16
    input.placeholderText = placeholder
    input.placeholderColor = '#d6a98a'
    input.fontSize = 20
    input.fontFamily = 'Comic Sans MS'
    input.maxWidth = '520px'
    input.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    const campo = {
      control: input,
      input,
      getValue: () => input.text || '',
      clear: () => {
        input.text = ''
      }
    }

    input.valorReal = ''
    input.mostrarTextoPlano = !isPassword

    if (showPasswordButton) {
      const container = new GUI.Grid(`${nombre}_container`)
      container.width = '76%'
      container.height = '54px'
      container.top = top
      container.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
      container.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
      container.addColumnDefinition(0.8)
      container.addColumnDefinition(0.2)

      const inputContainer = new GUI.Rectangle(`${nombre}_inputContainer`)
      inputContainer.width = '100%'
      inputContainer.height = '54px'
      inputContainer.thickness = 0
      inputContainer.background = 'transparent'

      input.left = '0px'
      input.top = '0px'
      input.width = '100%'
      inputContainer.addControl(input)

      let mascaraPassword = null
      if (isPassword) {
        mascaraPassword = new GUI.TextBlock(`${nombre}_mask`, '')
        mascaraPassword.width = '100%'
        mascaraPassword.height = '54px'
        mascaraPassword.left = '0px'
        mascaraPassword.paddingLeft = '14px'
        mascaraPassword.paddingRight = '14px'
        mascaraPassword.color = '#fff2e8'
        mascaraPassword.fontSize = 20
        mascaraPassword.fontFamily = 'Comic Sans MS'
        mascaraPassword.textHorizontalAlignment =
          GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        mascaraPassword.textVerticalAlignment =
          GUI.Control.VERTICAL_ALIGNMENT_CENTER
        mascaraPassword.isHitTestVisible = false
        mascaraPassword.isVisible = true
        inputContainer.addControl(mascaraPassword)

        input.onTextChangedObservable.add(() => {
          input.valorReal = input.text || ''
          this.sincronizarMascaraPassword(input, mascaraPassword)
        })

        this.sincronizarMascaraPassword(input, mascaraPassword)
        campo.getValue = () => input.valorReal || ''
        campo.clear = () => {
          input.valorReal = ''
          input.text = ''
          this.sincronizarMascaraPassword(input, mascaraPassword)
        }
      }

      const toggleBtn = GUI.Button.CreateSimpleButton(`${nombre}_toggle`, 'Ver')
      toggleBtn.width = '100%'
      toggleBtn.height = '54px'
      toggleBtn.top = '0px'
      toggleBtn.left = '0px'
      toggleBtn.color = '#ffd8bc'
      toggleBtn.background = '#4a3328'
      toggleBtn.cornerRadius = 16
      toggleBtn.thickness = 2
      toggleBtn.borderColor = '#8e4d22'
      toggleBtn.fontSize = 16
      if (toggleBtn.textBlock) {
        toggleBtn.textBlock.fontFamily = 'Comic Sans MS'
      }
      toggleBtn.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
      toggleBtn.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER

      let passwordVisible = false
      toggleBtn.onPointerUpObservable.add(() => {
        passwordVisible = !passwordVisible
        input.mostrarTextoPlano = passwordVisible
        this.sincronizarMascaraPassword(input, mascaraPassword)
        toggleBtn.textBlock.text = passwordVisible ? 'Ocultar' : 'Ver'
      })

      container.addControl(inputContainer, 0, 0)
      container.addControl(toggleBtn, 0, 1)

      campo.control = container
      return campo
    }

    return campo
  }

  sincronizarMascaraPassword(input, mascaraPassword) {
    if (!mascaraPassword) {
      return
    }

    const valorReal = input.valorReal || ''
    const mostrarReal = input.mostrarTextoPlano === true

    input.color = mostrarReal ? '#fff2e8' : 'transparent'
    mascaraPassword.text = '*'.repeat(valorReal.length)
    mascaraPassword.isVisible = !mostrarReal && valorReal.length > 0
  }

  crearItemInfo({ nombre, texto, top, alterno = false }) {
    const bloque = new GUI.Rectangle(nombre)
    bloque.width = '78%'
    bloque.height = '52px'
    bloque.top = top
    bloque.cornerRadius = 14
    bloque.thickness = 0
    bloque.background = alterno ? '#3a2a24' : '#2f221d'
    bloque.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER

    const textoBloque = this.crearTexto({
      nombre: `${nombre}Texto`,
      texto,
      tamano: 18,
      alto: '48px',
      color: '#ffe2cc'
    })
    textoBloque.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    textoBloque.paddingLeft = '18px'
    bloque.addControl(textoBloque)

    return bloque
  }

  mostrar() {
    if (this.overlay) this.overlay.isVisible = true
  }

  ocultar() {
    if (this.overlay) this.overlay.isVisible = false
  }
}
