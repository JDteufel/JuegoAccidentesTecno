import { GestorAjusteRatio } from './base/GestorAjusteRatio.js'
import temaService from '../services/TemaService.js'
import './estilos/EstiloVistaEncuesta.css'

const PREGUNTAS_ENCUESTA = [
  { id: 'entendimiento_accidentes', texto: '¿Qué tanto entendiste qué es un accidente tecnológico?' },
  { id: 'diversion', texto: '¿Piensas que es un juego divertido?' },
  { id: 'tutorial_util', texto: '¿El tutorial te sirvió para entender el juego?' },
  { id: 'visuales', texto: '¿Te gustan las visuales del juego?' },
  { id: 'reglas_claras', texto: '¿Las reglas se entienden fácil?' },
  { id: 'mecanicas', texto: '¿Te gustan las mecánicas del juego?' },
  { id: 'muestra_agrada', texto: '¿La muestra de accidentes y cartas te agrada?' },
  { id: 'muestra_ayuda', texto: '¿La muestra de accidentes y cartas ayuda a entender mejor el tema?' },
  { id: 'volver_a_jugar', texto: '¿Qué tan probable es que vuelvas a jugar?' }
]

export class VistaEncuesta {
  constructor() {
    this._onEnviar = null
    this._onCerrar = null
    this.containerEl = null
    this.respuestas = {}
    this.preguntaActual = 0
    this._unlistenResize = null
  }

  crear() {
    const container = document.createElement('div')
    container.className = 'encuesta-overlay'
    document.body.appendChild(container)
    this.containerEl = container

    this._crearTarjeta()
    this._aplicarTemaActual()

    this._unlistenResize = () => this._ajustarTamano()
    window.addEventListener('resize', this._unlistenResize)
    this._ajustarTamano()
  }

  _ajustarTamano() {
    if (!this.containerEl) return
    const esMovil = GestorAjusteRatio.esMovil()
    const tarjeta = this.containerEl.querySelector('.encuesta-tarjeta')
    if (!tarjeta) return

    if (esMovil) {
      tarjeta.style.width = '92%'
      tarjeta.style.maxWidth = '420px'
      tarjeta.style.padding = '20px 16px'
    } else {
      tarjeta.style.width = '80%'
      tarjeta.style.maxWidth = '900px'
      tarjeta.style.padding = '36px 40px'
    }
  }

  _crearTarjeta() {
    const tarjeta = document.createElement('div')
    tarjeta.className = 'encuesta-tarjeta'
    this.containerEl.appendChild(tarjeta)

    const titulo = document.createElement('h2')
    titulo.textContent = 'Encuesta de Satisfacción'
    titulo.className = 'encuesta-titulo'
    tarjeta.appendChild(titulo)

    const subtitulo = document.createElement('p')
    subtitulo.textContent = 'Tu opinión nos ayuda a mejorar. Califica cada aspecto del 1 al 10.'
    subtitulo.className = 'encuesta-subtitulo'
    tarjeta.appendChild(subtitulo)

    const indicador = document.createElement('div')
    indicador.className = 'encuesta-indicador'
    indicador.textContent = `Pregunta 1 de ${PREGUNTAS_ENCUESTA.length}`
    tarjeta.appendChild(indicador)

    const barraProgreso = document.createElement('div')
    barraProgreso.className = 'encuesta-barra-progreso'
    tarjeta.appendChild(barraProgreso)

    const barraRelleno = document.createElement('div')
    barraRelleno.className = 'encuesta-barra-relleno'
    barraRelleno.style.width = `${(1 / PREGUNTAS_ENCUESTA.length) * 100}%`
    barraProgreso.appendChild(barraRelleno)

    const zonaPregunta = document.createElement('div')
    zonaPregunta.className = 'encuesta-zona-pregunta'
    tarjeta.appendChild(zonaPregunta)

    this._renderPregunta(zonaPregunta, 0)

    const sliderContainer = document.createElement('div')
    sliderContainer.className = 'encuesta-slider'
    tarjeta.appendChild(sliderContainer)

    const btnAnterior = this._crearBotonNav('← Anterior', 'dark', () => this._navegar(-1))
    btnAnterior.id = 'encuestaBtnAnterior'
    sliderContainer.appendChild(btnAnterior)

    const btnSiguiente = this._crearBotonNav('Siguiente →', 'primary', () => this._navegar(1))
    btnSiguiente.id = 'encuestaBtnSiguiente'
    sliderContainer.appendChild(btnSiguiente)

    const botonesFin = document.createElement('div')
    botonesFin.className = 'encuesta-botones-fin'
    tarjeta.appendChild(botonesFin)

    const btnEnviar = this._crearBoton('Enviar encuesta', 'primary', () => this._enviar())
    btnEnviar.id = 'encuestaBtnEnviar'
    btnEnviar.className = 'encuesta-btn-enviar'
    btnEnviar.disabled = true
    botonesFin.appendChild(btnEnviar)

    const btnCerrar = this._crearBoton('Cerrar', 'dark', () => this._onCerrar && this._onCerrar())
    btnCerrar.className = 'encuesta-btn-cerrar'
    botonesFin.appendChild(btnCerrar)

    this._actualizarBotonesNav()
  }

  _renderPregunta(zona, indice) {
    zona.innerHTML = ''
    const pregunta = PREGUNTAS_ENCUESTA[indice]

    const textoPregunta = document.createElement('p')
    textoPregunta.textContent = pregunta.texto
    textoPregunta.className = 'encuesta-texto-pregunta'
    zona.appendChild(textoPregunta)

    const botonesContainer = document.createElement('div')
    botonesContainer.className = 'encuesta-botones-notas'
    zona.appendChild(botonesContainer)

    for (let i = 1; i <= 10; i++) {
      const btn = this._crearBotonNota(i, pregunta.id)
      botonesContainer.appendChild(btn)
    }

    const notaSeleccionada = this.respuestas[pregunta.id]
    if (notaSeleccionada) {
      this._resaltarNota(pregunta.id, notaSeleccionada)
    }
  }

  _crearBotonNota(nota, preguntaId) {
    const btn = document.createElement('button')
    btn.textContent = nota
    btn.className = 'encuesta-btn-nota'
    btn.dataset.nota = nota
    btn.dataset.pregunta = preguntaId

    btn.addEventListener('click', () => {
      this.respuestas[preguntaId] = nota
      this._resaltarNota(preguntaId, nota)
    })

    return btn
  }

  _resaltarNota(preguntaId, nota) {
    const botones = this.containerEl.querySelectorAll(`.encuesta-btn-nota[data-pregunta="${preguntaId}"]`)
    botones.forEach(btn => {
      const btnNota = parseInt(btn.dataset.nota)
      if (btnNota === nota) {
        btn.classList.add('seleccionada')
      } else {
        btn.classList.remove('seleccionada')
      }
    })
    this._actualizarBotonEnviar()
  }

  _navegar(direccion) {
    if (direccion > 0) {
      const preguntaActual = PREGUNTAS_ENCUESTA[this.preguntaActual]
      if (!this.respuestas[preguntaActual.id]) {
        this._mostrarFeedback('Responde esta pregunta antes de continuar', 'warning')
        return
      }
    }

    const nuevaPregunta = this.preguntaActual + direccion
    if (nuevaPregunta < 0 || nuevaPregunta >= PREGUNTAS_ENCUESTA.length) return

    this.preguntaActual = nuevaPregunta
    const zona = this.containerEl.querySelector('.encuesta-zona-pregunta')
    if (zona) {
      this._renderPregunta(zona, this.preguntaActual)
    }

    const indicador = this.containerEl.querySelector('.encuesta-indicador')
    if (indicador) {
      indicador.textContent = `Pregunta ${this.preguntaActual + 1} de ${PREGUNTAS_ENCUESTA.length}`
    }

    const barraRelleno = this.containerEl.querySelector('.encuesta-barra-relleno')
    if (barraRelleno) {
      barraRelleno.style.width = `${((this.preguntaActual + 1) / PREGUNTAS_ENCUESTA.length) * 100}%`
    }

    this._actualizarBotonesNav()
  }

  _actualizarBotonesNav() {
    const btnAnterior = this.containerEl?.querySelector('#encuestaBtnAnterior')
    const btnSiguiente = this.containerEl?.querySelector('#encuestaBtnSiguiente')
    if (!btnAnterior || !btnSiguiente) return

    btnAnterior.disabled = this.preguntaActual === 0

    const esUltima = this.preguntaActual === PREGUNTAS_ENCUESTA.length - 1
    btnSiguiente.textContent = esUltima ? 'Última pregunta' : 'Siguiente →'

    this._actualizarBotonEnviar()
  }

  _actualizarBotonEnviar() {
    const btnEnviar = this.containerEl?.querySelector('#encuestaBtnEnviar')
    if (!btnEnviar) return

    const todasRespondidas = Object.keys(this.respuestas).length === PREGUNTAS_ENCUESTA.length
    btnEnviar.disabled = !todasRespondidas
  }

  _crearBoton(texto, tipoClave, callback) {
    const btn = document.createElement('button')
    btn.textContent = texto
    btn.className = tipoClave === 'primary' ? 'encuesta-btn-enviar' : 'encuesta-btn-cerrar'
    btn.addEventListener('click', callback)
    return btn
  }

  _crearBotonNav(texto, tipoClave, callback) {
    const btn = document.createElement('button')
    btn.textContent = texto
    btn.className = 'encuesta-btn-nav'
    btn.addEventListener('click', callback)
    return btn
  }

  _enviar() {
    const totalPreguntas = PREGUNTAS_ENCUESTA.length
    const respondidas = Object.keys(this.respuestas).length

    if (respondidas < totalPreguntas) {
      this._mostrarFeedback(`Faltan ${totalPreguntas - respondidas} pregunta(s) por responder`, 'warning')
      return
    }

    if (this._onEnviar) {
      this._onEnviar({ ...this.respuestas })
    }
  }

  _mostrarFeedback(texto, tipo) {
    const existente = this.containerEl?.querySelector('.encuesta-feedback')
    if (existente) existente.remove()

    const feedback = document.createElement('div')
    feedback.className = `encuesta-feedback ${tipo}`
    feedback.textContent = texto
    document.body.appendChild(feedback)

    setTimeout(() => {
      if (feedback.parentNode) feedback.remove()
    }, 3000)
  }

  _aplicarTemaActual() {
    const colores = temaService.obtenerColoresTema(temaService.obtenerTemaActual())
    if (!this.containerEl) return

    const root = this.containerEl
    root.style.setProperty('--panel-bg', colores.panelInicioBg || 'rgba(28, 20, 18, 0.97)')
    root.style.setProperty('--border-color', colores.hudBorderColor || '#8e4d22')
    root.style.setProperty('--text-primary', colores.primary || '#d66a1f')
    root.style.setProperty('--text-secondary', colores.hudSubtextColor || '#f4cbaa')
    root.style.setProperty('--primary-color', colores.primary || '#d66a1f')
    root.style.setProperty('--primary-text', colores.primaryText || '#fff7ef')
    root.style.setProperty('--dark-alt', colores.darkAlt || '#3a2a1a')
    root.style.setProperty('--dark-alt-text', colores.darkAltText || '#f4cbaa')
    root.style.setProperty('--progress-bg', 'rgba(142, 77, 34, 0.3)')
    root.style.setProperty('--shadow-color', 'rgba(0,0,0,0.5)')
  }

  onEnviar(callback) {
    this._onEnviar = callback
  }

  onCerrar(callback) {
    this._onCerrar = callback
  }

  mostrar() {
    if (this.containerEl) {
      this.containerEl.style.display = 'flex'
      this._aplicarTemaActual()
      this._ajustarTamano()
    }
  }

  ocultar() {
    if (this.containerEl) {
      this.containerEl.style.display = 'none'
    }
  }

  resetear() {
    this.respuestas = {}
    this.preguntaActual = 0
    if (!this.containerEl) return

    const zona = this.containerEl.querySelector('.encuesta-zona-pregunta')
    if (zona) {
      this._renderPregunta(zona, 0)
    }

    const indicador = this.containerEl.querySelector('.encuesta-indicador')
    if (indicador) {
      indicador.textContent = `Pregunta 1 de ${PREGUNTAS_ENCUESTA.length}`
    }

    const barraRelleno = this.containerEl.querySelector('.encuesta-barra-relleno')
    if (barraRelleno) {
      barraRelleno.style.width = `${(1 / PREGUNTAS_ENCUESTA.length) * 100}%`
    }

    this._actualizarBotonesNav()
  }
}
