import './estilos/EstiloVistaGestion.css'
import temaService from '../services/TemaService.js'

export class VistaGestion {
  constructor() {
    this.onVolverCallback = null
    this.onAutoDistribuirCallback = null
    this.onIniciarTodasCallback = null
    this.onProbarCallback = null
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
    document.body.appendChild(container)
    this.containerEl = container

    const tarjeta = document.createElement('div')
    tarjeta.className = 'tarjeta-gestion'
    container.appendChild(tarjeta)

    const titulo = document.createElement('div')
    titulo.className = 'titulo-gestion'
    titulo.textContent = 'Gestión de Partidas'
    tarjeta.appendChild(titulo)

    const headerRow = document.createElement('div')
    headerRow.className = 'header-row'
    tarjeta.appendChild(headerRow)

    this.codigoEl = document.createElement('div')
    this.codigoEl.className = 'codigo-lobby'
    this.codigoEl.textContent = 'Código: -'
    headerRow.appendChild(this.codigoEl)

    this.contadorEl = document.createElement('div')
    this.contadorEl.className = 'contador-jugadores'
    this.contadorEl.textContent = 'Jugadores: 0'
    headerRow.appendChild(this.contadorEl)

    const mainArea = document.createElement('div')
    mainArea.className = 'main-area'
    tarjeta.appendChild(mainArea)

    this.poolEl = document.createElement('div')
    this.poolEl.className = 'pool-jugadores'
    mainArea.appendChild(this.poolEl)

    this.salasEl = document.createElement('div')
    this.salasEl.className = 'salas-container'
    mainArea.appendChild(this.salasEl)

    for (let i = 1; i <= 32; i++) {
      this.crearJugadorChip(i)
    }

    for (let i = 1; i <= 8; i++) {
      this.crearSalaPredefinida(i)
    }

    this.errorEl = document.createElement('div')
    this.errorEl.className = 'error-global'
    tarjeta.appendChild(this.errorEl)

    const buttonsRow = document.createElement('div')
    buttonsRow.className = 'buttons-row'
    tarjeta.appendChild(buttonsRow)

    const btnAuto = this._crearBoton('Auto-distribuir', 'boton-gestion', () => {
      if (this.onAutoDistribuirCallback) this.onAutoDistribuirCallback()
    })
    buttonsRow.appendChild(btnAuto)

    const btnIniciar = this._crearBoton('Iniciar Todas', 'boton-gestion', () => {
      for (let i = 1; i <= 8; i++) {
        if (this.onIniciarSalaCallbacks[i]) {
          this.onIniciarSalaCallbacks[i]()
        }
      }
      if (this.onIniciarTodasCallback) this.onIniciarTodasCallback()
    })
    buttonsRow.appendChild(btnIniciar)

    const btnProbar = this._crearBoton('Probar', 'boton-gestion', () => {
      if (this.onProbarCallback) this.onProbarCallback()
    })
    buttonsRow.appendChild(btnProbar)

    const btnVolver = this._crearBoton('Volver al Menú', 'boton-gestion', () => {
      if (this.onVolverCallback) this.onVolverCallback()
    })
    buttonsRow.appendChild(btnVolver)

    this._setupDragListeners()

    this.vistaCreada = true
    console.log('[VistaGestion] Vista DOM creada exitosamente')
  }

  _crearBoton(texto, claseCss, callback) {
    const btn = document.createElement('button')
    btn.textContent = texto
    btn.className = claseCss
    btn.addEventListener('click', callback)
    return btn
  }

  crearJugadorChip(numero) {
    const chip = document.createElement('div')
    chip.id = `jugadorChip${numero}`
    chip.dataset.numero = numero
    chip.className = 'jugador-chip'

    const circle = document.createElement('div')
    circle.className = 'jugador-circle'

    const letra = document.createElement('span')
    letra.className = 'jugador-letra'
    letra.textContent = `J${numero}`
    circle.appendChild(letra)
    chip.appendChild(circle)

    const nombre = document.createElement('span')
    nombre.className = 'jugador-nombre'
    nombre.textContent = `Jugador ${numero}`
    chip.appendChild(nombre)

    this.poolEl.appendChild(chip)

    this.jugadorChips[numero] = { element: chip, circle, letra, nombre }
    this.jugadorLabels[numero] = `Jugador ${numero}`
  }

  crearSalaPredefinida(numero) {
    const sala = document.createElement('div')
    sala.id = `sala${numero}`
    sala.className = 'sala-panel'

    const panel = document.createElement('div')
    panel.className = 'sala-tablero'

    const slots = []
    for (let i = 0; i < 4; i++) {
      const slotWrapper = document.createElement('div')
      slotWrapper.className = 'sala-slot-wrapper'
      slotWrapper.dataset.sala = numero
      slotWrapper.dataset.slot = i

      const circle = document.createElement('div')
      circle.className = 'slot-circle'

      const letra = document.createElement('span')
      letra.className = 'slot-letra'
      circle.appendChild(letra)
      slotWrapper.appendChild(circle)

      const nombre = document.createElement('span')
      nombre.className = 'slot-nombre'
      slotWrapper.appendChild(nombre)

      panel.appendChild(slotWrapper)
      slots.push({ wrapper: slotWrapper, circle, letra, nombre })
    }

    sala.appendChild(panel)

    const titulo = document.createElement('div')
    titulo.className = 'sala-titulo'
    titulo.textContent = `Sala ${numero}`
    sala.appendChild(titulo)

    const btnIniciar = this._crearBotonSala('Iniciar', numero)
    sala.appendChild(btnIniciar)

    const errorSala = document.createElement('div')
    errorSala.className = 'sala-error'
    sala.appendChild(errorSala)

    this.salasEl.appendChild(sala)
    this.salaSlots[numero] = { panel, slots, titulo, btnIniciar, errorSala, activa: false }
  }

  _crearBotonSala(texto, numeroSala) {
    const btn = document.createElement('button')
    btn.textContent = texto
    btn.className = 'boton-sala'
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

    chipEl.classList.add('dragging')
    chipEl.style.left = (pos.x - ds.dragOffsetX) + 'px'
    chipEl.style.top = (pos.y - ds.dragOffsetY) + 'px'

    const circle = chipEl.querySelector('.jugador-circle')
    if (circle) {
      circle.classList.add('dragging')
    }

    if (e.type === 'touchstart') e.preventDefault()
  }

  _dragMove(e) {
    const ds = this.dragState

    if (!ds.active) {
      this._resaltarSlotBajoCursor(e)
      return
    }

    e.preventDefault()

    const pos = this._getPointerPos(e)
    ds.element.style.left = (pos.x - ds.dragOffsetX) + 'px'
    ds.element.style.top = (pos.y - ds.dragOffsetY) + 'px'

    this._resaltarSlotBajoCursor(e)
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
      ds.element.classList.remove('dragging')
      ds.element.style.position = ''
      ds.element.style.zIndex = ''
      ds.element.style.pointerEvents = ''
      ds.element.style.left = ''
      ds.element.style.top = ''
      this.onJugadorSoltadoCallback(nombreJugador, dropTarget.salaNumero, dropTarget.slotIndex)
    } else {
      console.log(`[VistaGestion] Chip ${ds.numero} devuelto a posición original`)
      ds.element.classList.remove('dragging')
      ds.element.style.position = ''
      ds.element.style.zIndex = ''
      ds.element.style.left = ''
      ds.element.style.top = ''
      ds.element.style.pointerEvents = ''

      const circle = ds.element.querySelector('.jugador-circle')
      if (circle) {
        circle.classList.remove('dragging')
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

    for (const salaData of Object.values(this.salaSlots)) {
      for (let i = 0; i < 4; i++) {
        const slotData = salaData.slots[i]
        const rect = slotData.wrapper.getBoundingClientRect()

        if (
          pos.x >= rect.left &&
          pos.x <= rect.right &&
          pos.y >= rect.top &&
          pos.y <= rect.bottom
        ) {
          slotData.circle.classList.add('resaltado')
          return
        }
      }
    }
  }

  _limpiarResaltadoSlots() {
    for (const salaData of Object.values(this.salaSlots)) {
      for (let i = 0; i < 4; i++) {
        const slotData = salaData.slots[i]
        slotData.circle.classList.remove('resaltado')
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

  onProbar(callback) {
    this.onProbarCallback = callback
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
      chip.circle.classList.remove('activo', 'activo-par', 'dragging')
      chip.letra.classList.remove('activo')
      chip.nombre.classList.remove('activo')

      if (i <= nombresJugadores.length) {
        const nombre = nombresJugadores[i - 1]
        chip.letra.textContent = nombre.charAt(0).toUpperCase()
        chip.nombre.textContent = nombre
        chip.circle.classList.add((i - 1) % 2 === 0 ? 'activo' : 'activo-par')
        chip.letra.classList.add('activo')
        chip.nombre.classList.add('activo')
        this.jugadorLabels[i] = nombre
      } else {
        chip.letra.textContent = `J${i}`
        chip.nombre.textContent = `Jugador ${i}`
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

      salaData.panel.classList.remove('activa', 'activa-par', 'activa-impar')
      salaData.titulo.classList.remove('activa')

      if (salaDefinida && jugadoresEnSala.length > 0) {
        salaData.panel.classList.add('activa', n % 2 === 0 ? 'activa-par' : 'activa-impar')
        salaData.titulo.classList.add('activa')
        salaData.titulo.textContent = `Sala ${n}`
        salaData.activa = true
        salaData.btnIniciar.style.opacity = '1'
        salaData.btnIniciar.style.pointerEvents = 'auto'
        this.limpiarErrorSala(n)
      } else {
        salaData.activa = false
        salaData.btnIniciar.style.opacity = '0.4'
        salaData.btnIniciar.style.pointerEvents = 'none'
        this.limpiarErrorSala(n)
      }

      for (let i = 0; i < 4; i++) {
        const slotData = salaData.slots[i]
        const jugador = jugadoresEnSala[i]

        slotData.circle.classList.remove('ocupado', 'resaltado')
        slotData.letra.classList.remove('ocupado')
        slotData.nombre.classList.remove('ocupado')

        if (jugador) {
          slotData.circle.classList.add('ocupado')
          slotData.letra.textContent = jugador.charAt(0).toUpperCase()
          slotData.letra.classList.add('ocupado')
          slotData.nombre.textContent = jugador
          slotData.nombre.classList.add('ocupado')
        } else {
          slotData.letra.textContent = ''
          slotData.nombre.textContent = ''
        }
      }
    })
  }

  mostrarError(mensaje) {
    if (this.errorEl) {
      this.errorEl.textContent = mensaje
      this.errorEl.classList.remove('exito')
      this.errorEl.classList.add('visible')
    }
  }

  limpiarError() {
    if (this.errorEl) {
      this.errorEl.textContent = ''
      this.errorEl.classList.remove('visible', 'exito')
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

    const colores = temaService.obtenerColoresTema(temaService.obtenerTemaActual())

    switch (estado) {
      case 'disponible':
        salaData.btnIniciar.textContent = 'Iniciar'
        salaData.btnIniciar.style.background = colores.borderAlt
        salaData.btnIniciar.style.opacity = salaData.activa ? '1' : '0.4'
        salaData.btnIniciar.disabled = !salaData.activa
        salaData.btnIniciar.style.pointerEvents = salaData.activa ? 'auto' : 'none'
        salaData.btnIniciar.style.cursor = salaData.activa ? 'pointer' : 'not-allowed'
        break
      case 'jugadoresListos':
        salaData.btnIniciar.textContent = 'Jugadores Listos'
        salaData.btnIniciar.style.background = colores.primary
        salaData.btnIniciar.style.opacity = '1'
        salaData.btnIniciar.disabled = false
        salaData.btnIniciar.style.pointerEvents = 'auto'
        salaData.btnIniciar.style.cursor = 'pointer'
        break
      case 'iniciando':
        salaData.btnIniciar.textContent = 'Iniciando...'
        salaData.btnIniciar.style.background = colores.borderAlt
        salaData.btnIniciar.style.opacity = '0.6'
        salaData.btnIniciar.disabled = true
        salaData.btnIniciar.style.pointerEvents = 'none'
        salaData.btnIniciar.style.cursor = 'wait'
        break
      case 'iniciada':
        salaData.btnIniciar.textContent = 'Partida Iniciada!'
        salaData.btnIniciar.style.background = colores.badgeWork
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
      this.errorEl.classList.add('exito', 'visible')
    }
  }

  aplicarTema(temaId) {
    const colores = temaService.obtenerColoresTema(temaId)
    const root = document.documentElement
    root.style.setProperty('--gestion-bg', colores.cardBg)
    root.style.setProperty('--gestion-border', colores.border)
    root.style.setProperty('--gestion-text', colores.textPrimary)
    root.style.setProperty('--gestion-primary', colores.primary)
    root.style.setProperty('--gestion-dark', colores.dark)
    root.style.setProperty('--gestion-item-even', colores.itemEven)
    root.style.setProperty('--gestion-item-odd', colores.itemOdd)
  }
}
