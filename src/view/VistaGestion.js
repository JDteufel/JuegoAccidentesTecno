import { VistaPanelBase } from './base/VistaPanelBase.js'

export class VistaGestion {
  constructor() {
    this.onVolverCallback = null
    this.onAutoDistribuirCallback = null
    this.onIniciarTodasCallback = null
    this.onIniciarSalaCallbacks = {}
    this.onEliminarSalaCallbacks = {}
    this.onJugadorSoltadoCallback = null
    this.vistaCreada = false
    this.salaSlots = {}
    this.jugadorChips = {}
    this.jugadorLabels = {}
    this.dragState = {
      active: false,
      numero: null,
      element: null,
      dragOffsetX: 0,
      dragOffsetY: 0,
      originalCell: { row: 0, col: 0 },
      cooldown: false
    }
    this.containerEl = null
    this.poolEl = null
    this.salasEl = null
    this.codigoEl = null
    this.contadorEl = null
    this.errorEl = null
  }

  crear() {
    console.log('[VistaGestion] Iniciando creación DOM...')

    const container = document.createElement('div')
    container.id = 'gestionContainer'
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
      width: 1300px;
      max-width: 95vw;
      min-height: 660px;
      background: rgba(28, 21, 18, 0.95);
      border: 2px solid #8e4d22;
      border-radius: 28px;
      box-shadow: 0 0 22px rgba(0,0,0,0.4);
      padding: 50px 40px 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    `
    container.appendChild(tarjeta)

    const titulo = document.createElement('div')
    titulo.textContent = 'Gestión de Partidas'
    titulo.style.cssText = `
      color: #ffe4cf;
      font-size: 28px;
      margin-bottom: 20px;
      text-align: center;
    `
    tarjeta.appendChild(titulo)

    const headerRow = document.createElement('div')
    headerRow.style.cssText = `
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 25px;
    `
    tarjeta.appendChild(headerRow)

    this.codigoEl = document.createElement('div')
    this.codigoEl.textContent = 'Código: -'
    this.codigoEl.style.cssText = `
      color: #cf8a34;
      font-size: 20px;
      min-width: 200px;
    `
    headerRow.appendChild(this.codigoEl)

    this.contadorEl = document.createElement('div')
    this.contadorEl.textContent = 'Jugadores: 0'
    this.contadorEl.style.cssText = `
      color: #f4cbaa;
      font-size: 18px;
      min-width: 200px;
      text-align: right;
    `
    headerRow.appendChild(this.contadorEl)

    const mainArea = document.createElement('div')
    mainArea.style.cssText = `
      display: flex;
      gap: 40px;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      margin-top: 30px;
      margin-bottom: 30px;
    `
    tarjeta.appendChild(mainArea)

    this.poolEl = document.createElement('div')
    this.poolEl.style.cssText = `
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      grid-template-rows: repeat(4, auto);
      gap: 4px;
      width: 520px;
      min-width: 400px;
      align-content: start;
    `
    mainArea.appendChild(this.poolEl)

    this.salasEl = document.createElement('div')
    this.salasEl.style.cssText = `
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: 12px;
      width: 720px;
      min-width: 500px;
    `
    mainArea.appendChild(this.salasEl)

    for (let i = 1; i <= 32; i++) {
      this.crearJugadorChip(i)
    }

    for (let i = 1; i <= 8; i++) {
      this.crearSalaPredefinida(i)
    }

    this.errorEl = document.createElement('div')
    this.errorEl.style.cssText = `
      color: #ff6b6b;
      font-size: 16px;
      height: 28px;
      text-align: center;
      visibility: hidden;
      margin-bottom: 15px;
    `
    tarjeta.appendChild(this.errorEl)

    const buttonsRow = document.createElement('div')
    buttonsRow.style.cssText = `
      display: flex;
      gap: 16px;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      margin-top: 30px;
    `
    tarjeta.appendChild(buttonsRow)

    const btnAuto = this._crearBoton('Auto-distribuir', '#d66a1f', '#fff7ef', () => {
      if (this.onAutoDistribuirCallback) this.onAutoDistribuirCallback()
    })
    buttonsRow.appendChild(btnAuto)

    const btnIniciar = this._crearBoton('Iniciar Todas', '#a84f16', '#fff1e3', () => {
      for (let i = 1; i <= 8; i++) {
        if (this.onIniciarSalaCallbacks[i]) {
          this.onIniciarSalaCallbacks[i]()
        }
      }
      if (this.onIniciarTodasCallback) this.onIniciarTodasCallback()
    })
    buttonsRow.appendChild(btnIniciar)

    const btnVolver = this._crearBoton('Volver al Menú', '#362924', '#ffd8bc', () => {
      if (this.onVolverCallback) this.onVolverCallback()
    })
    buttonsRow.appendChild(btnVolver)

    this._setupDragListeners()

    this.vistaCreada = true
    console.log('[VistaGestion] Vista DOM creada exitosamente')
  }

  _crearBoton(texto, fondo, color, callback) {
    const btn = document.createElement('button')
    btn.textContent = texto
    btn.style.cssText = `
      padding: 10px 24px;
      border: none;
      border-radius: 18px;
      background: ${fondo};
      color: ${color};
      font-size: 16px;
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

  crearJugadorChip(numero) {
    const chip = document.createElement('div')
    chip.id = `jugadorChip${numero}`
    chip.dataset.numero = numero
    chip.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: grab;
      padding: 2px;
      position: relative;
      z-index: 1;
      user-select: none;
      justify-self: center;
    `

    const circle = document.createElement('div')
    circle.className = 'jugador-circle'
    circle.style.cssText = `
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 2px solid #5a4a3a;
      background: rgba(30, 22, 18, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.2s, background 0.2s;
      flex-shrink: 0;
    `

    const letra = document.createElement('span')
    letra.className = 'jugador-letra'
    letra.textContent = `J${numero}`
    letra.style.cssText = `
      color: #8a7a6a;
      font-size: 13px;
      font-family: 'Comic Sans MS', cursive;
      line-height: 1;
    `
    circle.appendChild(letra)
    chip.appendChild(circle)

    const nombre = document.createElement('span')
    nombre.className = 'jugador-nombre'
    nombre.textContent = `Jugador ${numero}`
    nombre.style.cssText = `
      color: #8a7a6a;
      font-size: 10px;
      font-family: 'Comic Sans MS', cursive;
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 60px;
      text-align: center;
    `
    chip.appendChild(nombre)

    this.poolEl.appendChild(chip)

    this.jugadorChips[numero] = { element: chip, circle, letra, nombre }
    this.jugadorLabels[numero] = `Jugador ${numero}`
  }

  crearSalaPredefinida(numero) {
    const sala = document.createElement('div')
    sala.id = `sala${numero}`
    sala.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px 10px;
    `

    const panel = document.createElement('div')
    panel.className = 'sala-panel'
    panel.style.cssText = `
      width: 120px;
      height: 120px;
      border-radius: 12px;
      border: 2px solid #5a4a3a;
      background: rgba(30, 22, 18, 0.5);
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 8px;
      padding: 10px;
      box-sizing: border-box;
      transition: border-color 0.2s, background 0.2s;
    `

    const slots = []
    for (let i = 0; i < 4; i++) {
      const slotWrapper = document.createElement('div')
      slotWrapper.className = 'sala-slot-wrapper'
      slotWrapper.dataset.sala = numero
      slotWrapper.dataset.slot = i
      slotWrapper.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: auto;
      `

      const circle = document.createElement('div')
      circle.className = 'slot-circle'
      circle.style.cssText = `
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 2px solid #5a4a3a;
        background: rgba(30, 22, 18, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: border-color 0.2s, background 0.2s;
      `

      const letra = document.createElement('span')
      letra.className = 'slot-letra'
      letra.style.cssText = `
        color: #5a4a3a;
        font-size: 12px;
        font-family: 'Comic Sans MS', cursive;
        line-height: 1;
      `
      circle.appendChild(letra)
      slotWrapper.appendChild(circle)

      const nombre = document.createElement('span')
      nombre.className = 'slot-nombre'
      nombre.style.cssText = `
        color: #5a4a3a;
        font-size: 8px;
        font-family: 'Comic Sans MS', cursive;
        margin-top: 1px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 40px;
        text-align: center;
      `
      slotWrapper.appendChild(nombre)

      panel.appendChild(slotWrapper)
      slots.push({ wrapper: slotWrapper, circle, letra, nombre })
    }

    sala.appendChild(panel)

    const titulo = document.createElement('div')
    titulo.className = 'sala-titulo'
    titulo.textContent = `Sala ${numero}`
    titulo.style.cssText = `
      color: #8a7a6a;
      font-size: 14px;
      font-family: 'Comic Sans MS', cursive;
      margin-top: 6px;
    `
    sala.appendChild(titulo)

    const btnIniciar = this._crearBotonSala('Iniciar', numero)
    sala.appendChild(btnIniciar)

    const errorSala = document.createElement('div')
    errorSala.className = 'sala-error'
    errorSala.style.cssText = `
      color: #ff6b6b;
      font-size: 11px;
      font-family: 'Comic Sans MS', cursive;
      margin-top: 4px;
      min-height: 16px;
      text-align: center;
      max-width: 120px;
    `
    sala.appendChild(errorSala)

    this.salasEl.appendChild(sala)
    this.salaSlots[numero] = { panel, slots, titulo, btnIniciar, errorSala, activa: false }
  }

  _crearBotonSala(texto, numeroSala) {
    const btn = document.createElement('button')
    btn.textContent = texto
    btn.style.cssText = `
      padding: 4px 14px;
      border: none;
      border-radius: 12px;
      background: #8e4d22;
      color: #ffe4cf;
      font-size: 12px;
      font-family: 'Comic Sans MS', cursive;
      cursor: pointer;
      transition: transform 0.2s, opacity 0.2s;
      margin-top: 6px;
    `
    btn.addEventListener('mouseenter', () => {
      btn.style.opacity = '0.85'
      btn.style.transform = 'scale(1.05)'
    })
    btn.addEventListener('mouseleave', () => {
      btn.style.opacity = '1'
      btn.style.transform = 'scale(1)'
    })
    btn.addEventListener('click', () => {
      if (this.onIniciarSalaCallbacks[numeroSala]) {
        this.onIniciarSalaCallbacks[numeroSala]()
      }
    })
    return btn
  }

  _setupDragListeners() {
    const container = this.containerEl

    container.addEventListener('mousedown', (e) => this._dragStart(e))
    container.addEventListener('mousemove', (e) => this._dragMove(e))
    container.addEventListener('mouseup', (e) => this._dragEnd(e))

    container.addEventListener('touchstart', (e) => this._dragStart(e), { passive: false })
    container.addEventListener('touchmove', (e) => this._dragMove(e), { passive: false })
    container.addEventListener('touchend', (e) => this._dragEnd(e), { passive: false })
  }

  _getPointerPos(e) {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    return { x: e.clientX, y: e.clientY }
  }

  _dragStart(e) {
    if (this.dragState.active || this.dragState.cooldown) return

    const chipEl = e.target.closest('[data-numero]')
    if (!chipEl || chipEl.style.display === 'none') return

    const numero = parseInt(chipEl.dataset.numero)
    const ds = this.dragState

    ds.active = true
    ds.numero = numero
    ds.element = chipEl
    ds.originalCell = {
      row: (numero - 1) % 4,
      col: Math.floor((numero - 1) / 4)
    }

    const rect = chipEl.getBoundingClientRect()
    const pos = this._getPointerPos(e)
    ds.dragOffsetX = pos.x - rect.left - rect.width / 2
    ds.dragOffsetY = pos.y - rect.top - rect.height / 2

    chipEl.style.position = 'fixed'
    chipEl.style.zIndex = '1000'
    chipEl.style.left = (pos.x - ds.dragOffsetX) + 'px'
    chipEl.style.top = (pos.y - ds.dragOffsetY) + 'px'
    chipEl.style.cursor = 'grabbing'
    chipEl.style.pointerEvents = 'none'

    const circle = chipEl.querySelector('.jugador-circle')
    if (circle) {
      circle.style.borderColor = '#cf8a34'
      circle.style.transform = 'scale(1.2)'
      circle.style.boxShadow = '0 0 15px rgba(207,138,52,0.5)'
    }

    if (e.type === 'touchstart') e.preventDefault()
  }

  _dragMove(e) {
    const ds = this.dragState

    if (!ds.active) {
      this._resaltarSlotBajoCursor(e)
      return
    }

    const pos = this._getPointerPos(e)
    ds.element.style.left = (pos.x - ds.dragOffsetX) + 'px'
    ds.element.style.top = (pos.y - ds.dragOffsetY) + 'px'

    this._resaltarSlotBajoCursor(e)

    if (e.type === 'touchmove') e.preventDefault()
  }

  _dragEnd(e) {
    const ds = this.dragState
    if (!ds.active) return

    this._limpiarResaltadoSlots()

    const pos = this._getPointerPos(e.changedTouches ? { touches: e.changedTouches } : e)
    const dropTarget = this._buscarSlotBajoCursor(pos.x, pos.y)

    const nombreJugador = ds.element.querySelector('.jugador-nombre')?.textContent || ''
    const esJugadorActivo = nombreJugador && !nombreJugador.startsWith('Jugador ')

    const dropExitoso = dropTarget && this.onJugadorSoltadoCallback && esJugadorActivo

    if (dropExitoso) {
      console.log(`[VistaGestion] Jugador "${nombreJugador}" soltado en Sala ${dropTarget.salaNumero}, slot ${dropTarget.slotIndex}`)
      ds.element.style.display = 'none'
      ds.element.style.position = ''
      ds.element.style.zIndex = ''
      ds.element.style.pointerEvents = ''
      this.onJugadorSoltadoCallback(nombreJugador, dropTarget.salaNumero, dropTarget.slotIndex)
    } else {
      console.log(`[VistaGestion] Chip ${ds.numero} devuelto a posición original`)
      ds.element.style.position = ''
      ds.element.style.zIndex = ''
      ds.element.style.left = ''
      ds.element.style.top = ''
      ds.element.style.cursor = 'grab'
      ds.element.style.display = ''
      ds.element.style.pointerEvents = ''

      const circle = ds.element.querySelector('.jugador-circle')
      if (circle) {
        circle.style.borderColor = ''
        circle.style.transform = ''
        circle.style.boxShadow = ''
      }
    }

    ds.active = false
    ds.numero = null
    ds.element = null

    ds.cooldown = true
    setTimeout(() => { ds.cooldown = false }, 100)
  }

  _resaltarSlotBajoCursor(e) {
    this._limpiarResaltadoSlots()

    const pos = this._getPointerPos(e)

    for (const [numStr, salaData] of Object.entries(this.salaSlots)) {
      for (let i = 0; i < 4; i++) {
        const slotData = salaData.slots[i]
        const rect = slotData.wrapper.getBoundingClientRect()

        if (
          pos.x >= rect.left &&
          pos.x <= rect.right &&
          pos.y >= rect.top &&
          pos.y <= rect.bottom
        ) {
          slotData.circle.style.borderColor = '#cf8a34'
          slotData.circle.style.borderWidth = '3px'
          return
        }
      }
    }
  }

  _limpiarResaltadoSlots() {
    for (const salaData of Object.values(this.salaSlots)) {
      for (let i = 0; i < 4; i++) {
        const slotData = salaData.slots[i]
        slotData.circle.style.borderColor = ''
        slotData.circle.style.borderWidth = ''
      }
    }
  }

  _buscarSlotBajoCursor(cursorX, cursorY) {
    for (const [numStr, salaData] of Object.entries(this.salaSlots)) {
      const salaNumero = parseInt(numStr)
      for (let i = 0; i < 4; i++) {
        const slotData = salaData.slots[i]
        const rect = slotData.wrapper.getBoundingClientRect()

        if (
          cursorX >= rect.left &&
          cursorX <= rect.right &&
          cursorY >= rect.top &&
          cursorY <= rect.bottom
        ) {
          return { salaNumero, slotIndex: i }
        }
      }
    }
    return null
  }

  mostrar() {
    if (this.containerEl) {
      this.containerEl.style.display = 'flex'
    }
  }

  ocultar() {
    if (this.containerEl) {
      this.containerEl.style.display = 'none'
    }
  }

  onVolver(callback) {
    this.onVolverCallback = callback
  }

  onAutoDistribuir(callback) {
    this.onAutoDistribuirCallback = callback
  }

  onIniciarTodas(callback) {
    this.onIniciarTodasCallback = callback
  }

  onIniciarSala(numeroSala, callback) {
    this.onIniciarSalaCallbacks[numeroSala] = callback
  }

  onEliminarSala(numeroSala, callback) {
    this.onEliminarSalaCallbacks[numeroSala] = callback
  }

  onJugadorSoltado(callback) {
    this.onJugadorSoltadoCallback = callback
  }

  actualizarSalaMaestra(salaData) {
    if (!salaData) {
      if (this.codigoEl) this.codigoEl.textContent = 'Código: -'
      if (this.contadorEl) this.contadorEl.textContent = 'Jugadores: 0'
      return
    }

    const codigo = salaData.lobbyCode || '-'
    const jugadores = salaData.playerCount || 0

    if (this.codigoEl) this.codigoEl.textContent = `Código: ${codigo}`
    if (this.contadorEl) this.contadorEl.textContent = `Jugadores: ${jugadores}`
    this.limpiarError()
  }

  actualizarPool(jugadores) {
    if (!this.vistaCreada) return

    const nombresJugadores = jugadores || []

    for (let i = 1; i <= 32; i++) {
      const chip = this.jugadorChips[i]
      if (!chip) continue

      chip.element.style.display = ''

      if (i <= nombresJugadores.length) {
        const nombre = nombresJugadores[i - 1]
        chip.letra.textContent = nombre.charAt(0).toUpperCase()
        chip.nombre.textContent = nombre
        chip.circle.style.borderColor = '#cf8a34'
        chip.circle.style.background = (i - 1) % 2 === 0 ? 'rgba(60, 45, 39, 0.9)' : 'rgba(47, 34, 29, 0.9)'
        chip.letra.style.color = '#ffe4cf'
        chip.nombre.style.color = '#d6a98a'
        this.jugadorLabels[i] = nombre
      } else {
        chip.letra.textContent = `J${i}`
        chip.nombre.textContent = `Jugador ${i}`
        chip.circle.style.borderColor = '#5a4a3a'
        chip.circle.style.background = 'rgba(30, 22, 18, 0.5)'
        chip.letra.style.color = '#8a7a6a'
        chip.nombre.style.color = '#8a7a6a'
        this.jugadorLabels[i] = `Jugador ${i}`
      }
    }
  }

  actualizarSalas(subSalas, jugadoresAsignados) {
    if (!this.vistaCreada) return

    Object.keys(this.salaSlots).forEach(num => {
      const n = parseInt(num)
      const salaData = this.salaSlots[n]
      if (!salaData) return

      const salaDefinida = subSalas && subSalas.find(s => s.numero === n)
      const jugadoresEnSala = salaDefinida
        ? Object.keys(jugadoresAsignados).filter(j => jugadoresAsignados[j] === n)
        : []

      if (salaDefinida && jugadoresEnSala.length > 0) {
        salaData.panel.style.borderColor = '#8e4d22'
        salaData.panel.style.background = n % 2 === 0 ? 'rgba(47, 34, 29, 0.8)' : 'rgba(58, 42, 36, 0.8)'
        salaData.titulo.style.color = '#ffe4cf'
        salaData.titulo.textContent = `Sala ${n}`
        salaData.activa = true
        salaData.btnIniciar.style.opacity = '1'
        salaData.btnIniciar.style.pointerEvents = 'auto'
        this.limpiarErrorSala(n)
      } else {
        salaData.panel.style.borderColor = '#5a4a3a'
        salaData.panel.style.background = 'rgba(30, 22, 18, 0.5)'
        salaData.titulo.style.color = '#8a7a6a'
        salaData.titulo.textContent = `Sala ${n}`
        salaData.activa = false
        salaData.btnIniciar.style.opacity = '0.4'
        salaData.btnIniciar.style.pointerEvents = 'none'
        this.limpiarErrorSala(n)
      }

      for (let i = 0; i < 4; i++) {
        const slotData = salaData.slots[i]
        const jugador = jugadoresEnSala[i]

        if (jugador) {
          slotData.circle.style.borderColor = '#4a8c3f'
          slotData.circle.style.background = 'rgba(74, 140, 63, 0.3)'
          slotData.letra.textContent = jugador.charAt(0).toUpperCase()
          slotData.letra.style.color = '#a8e6a0'
          slotData.nombre.textContent = jugador
          slotData.nombre.style.color = '#a8e6a0'
        } else {
          slotData.circle.style.borderColor = '#5a4a3a'
          slotData.circle.style.background = 'rgba(30, 22, 18, 0.5)'
          slotData.letra.textContent = ''
          slotData.letra.style.color = '#5a4a3a'
          slotData.nombre.textContent = ''
          slotData.nombre.style.color = '#5a4a3a'
        }
      }
    })
  }

  mostrarError(mensaje) {
    if (this.errorEl) {
      this.errorEl.textContent = mensaje
      this.errorEl.style.color = '#ff6b6b'
      this.errorEl.style.visibility = 'visible'
    }
  }

  limpiarError() {
    if (this.errorEl) {
      this.errorEl.textContent = ''
      this.errorEl.style.color = '#ff6b6b'
      this.errorEl.style.visibility = 'hidden'
    }
  }

  mostrarErrorSala(numero, mensaje) {
    const salaData = this.salaSlots[numero]
    if (salaData && salaData.errorSala) {
      salaData.errorSala.textContent = mensaje
    }
  }

  limpiarErrorSala(numero) {
    const salaData = this.salaSlots[numero]
    if (salaData && salaData.errorSala) {
      salaData.errorSala.textContent = ''
    }
  }

  setSalaIniciando(numero, iniciando) {
    const salaData = this.salaSlots[numero]
    if (!salaData || !salaData.btnIniciar) return

    if (iniciando) {
      salaData.btnIniciar.textContent = 'Iniciando...'
      salaData.btnIniciar.style.opacity = '0.6'
      salaData.btnIniciar.style.pointerEvents = 'none'
      salaData.btnIniciar.style.cursor = 'wait'
    } else {
      salaData.btnIniciar.textContent = 'Iniciar'
      salaData.btnIniciar.style.opacity = salaData.activa ? '1' : '0.4'
      salaData.btnIniciar.style.pointerEvents = salaData.activa ? 'auto' : 'none'
      salaData.btnIniciar.style.cursor = 'pointer'
    }
  }

  setSalaEstado(numero, estado) {
    const salaData = this.salaSlots[numero]
    if (!salaData || !salaData.btnIniciar) return

    switch (estado) {
      case 'disponible':
        salaData.btnIniciar.textContent = 'Iniciar'
        salaData.btnIniciar.style.background = '#8e4d22'
        salaData.btnIniciar.style.opacity = salaData.activa ? '1' : '0.4'
        salaData.btnIniciar.disabled = !salaData.activa
        salaData.btnIniciar.style.pointerEvents = salaData.activa ? 'auto' : 'none'
        salaData.btnIniciar.style.cursor = salaData.activa ? 'pointer' : 'not-allowed'
        break
      case 'jugadoresListos':
        salaData.btnIniciar.textContent = 'Jugadores Listos'
        salaData.btnIniciar.style.background = '#d66a1f'
        salaData.btnIniciar.style.opacity = '1'
        salaData.btnIniciar.disabled = false
        salaData.btnIniciar.style.pointerEvents = 'auto'
        salaData.btnIniciar.style.cursor = 'pointer'
        break
      case 'iniciando':
        salaData.btnIniciar.textContent = 'Iniciando...'
        salaData.btnIniciar.style.background = '#8e4d22'
        salaData.btnIniciar.style.opacity = '0.6'
        salaData.btnIniciar.disabled = true
        salaData.btnIniciar.style.pointerEvents = 'none'
        salaData.btnIniciar.style.cursor = 'wait'
        break
      case 'iniciada':
        salaData.btnIniciar.textContent = 'Partida Iniciada!'
        salaData.btnIniciar.style.background = '#4ade80'
        salaData.btnIniciar.style.opacity = '1'
        salaData.btnIniciar.disabled = true
        salaData.btnIniciar.style.pointerEvents = 'none'
        salaData.btnIniciar.style.cursor = 'not-allowed'
        break
    }
  }

  mostrarMensajeFinal(mensaje) {
    if (this.errorEl) {
      this.errorEl.textContent = mensaje
      this.errorEl.style.color = '#4ade80'
      this.errorEl.style.visibility = 'visible'
    }
  }
}
