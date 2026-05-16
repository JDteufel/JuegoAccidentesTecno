import './estilos/EstiloVistaConfiguracion.css'
import temaService, { TEMAS_DISPONIBLES } from '../services/TemaService.js'

export class VistaConfiguracion {
  constructor() {
    this._onCerrar = null
    this._onCambiarTema = null
    this.containerEl = null
    this.temaSeleccionado = null
  }

  crear() {
    const container = document.createElement('div')
    container.id = 'pantallaConfiguracion'
    container.className = 'config-overlay'
    container.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:none;justify-content:center;align-items:center;'
    document.body.appendChild(container)
    this.containerEl = container

    const tarjeta = document.createElement('div')
    tarjeta.className = 'config-tarjeta'
    container.appendChild(tarjeta)

    const titulo = document.createElement('h2')
    titulo.textContent = 'Configuración'
    titulo.className = 'config-titulo'
    tarjeta.appendChild(titulo)

    const seccion = document.createElement('div')
    seccion.className = 'config-seccion'
    tarjeta.appendChild(seccion)

    const seccionTitulo = document.createElement('h3')
    seccionTitulo.textContent = 'Tema Visual'
    seccionTitulo.className = 'config-seccion-titulo'
    seccion.appendChild(seccionTitulo)

    const opcionesContainer = document.createElement('div')
    opcionesContainer.className = 'config-opciones'
    seccion.appendChild(opcionesContainer)

    TEMAS_DISPONIBLES.forEach(tema => {
      const opcion = this._crearOpcionTema(tema)
      opcionesContainer.appendChild(opcion)
    })

    const botonesContainer = document.createElement('div')
    botonesContainer.className = 'config-botones'
    tarjeta.appendChild(botonesContainer)

    const colores = temaService.obtenerColoresTema(temaService.obtenerTemaActual())

    const btnCancelar = this._crearBoton(
      'Cancelar',
      'dark',
      () => this._onCerrar && this._onCerrar()
    )
    botonesContainer.appendChild(btnCancelar)

    const btnAplicar = this._crearBoton(
      'Aplicar',
      'primary',
      () => {
        if (this.temaSeleccionado && this._onCambiarTema) {
          this._onCambiarTema(this.temaSeleccionado)
        }
      }
    )
    btnAplicar.id = 'configBtnAplicar'
    botonesContainer.appendChild(btnAplicar)
  }

  _crearOpcionTema(tema) {
    const colores = temaService.obtenerColoresTema(tema.id)

    const opcion = document.createElement('div')
    opcion.className = 'config-tema-opcion'
    opcion.dataset.tema = tema.id
    opcion.style.cursor = 'pointer'

    const preview = document.createElement('div')
    preview.className = 'config-tema-preview'

    tema.preview.forEach(color => {
      const muestra = document.createElement('div')
      muestra.className = 'config-tema-muestra'
      muestra.style.background = color
      preview.appendChild(muestra)
    })

    opcion.appendChild(preview)

    const nombre = document.createElement('div')
    nombre.className = 'config-tema-nombre'
    nombre.textContent = tema.nombre
    opcion.appendChild(nombre)

    const descripcion = document.createElement('div')
    descripcion.className = 'config-tema-descripcion'
    descripcion.textContent = tema.descripcion
    opcion.appendChild(descripcion)

    const check = document.createElement('div')
    check.className = 'config-tema-check'
    check.textContent = '✓'
    opcion.appendChild(check)

    opcion.addEventListener('click', () => {
      this._seleccionarTema(tema.id)
    })

    opcion.addEventListener('mouseenter', () => {
      opcion.style.transform = 'scale(1.02)'
    })
    opcion.addEventListener('mouseleave', () => {
      opcion.style.transform = 'scale(1)'
    })

    return opcion
  }

  _seleccionarTema(temaId) {
    this.temaSeleccionado = temaId

    const opciones = this.containerEl.querySelectorAll('.config-tema-opcion')
    opciones.forEach(op => {
      if (op.dataset.tema === temaId) {
        op.classList.add('seleccionada')
      } else {
        op.classList.remove('seleccionada')
      }
    })
  }

  mostrarSeleccion(temaId) {
    this.temaSeleccionado = temaId
    if (!this.containerEl) return

    const opciones = this.containerEl.querySelectorAll('.config-tema-opcion')
    opciones.forEach(op => {
      if (op.dataset.tema === temaId) {
        op.classList.add('seleccionada')
      } else {
        op.classList.remove('seleccionada')
      }
    })
  }

  _crearBoton(texto, temaClave, callback) {
    const colores = temaService.obtenerColoresTema(temaService.obtenerTemaActual())
    let fondo, colorTexto
    if (temaClave === 'primary') {
      fondo = colores.primary
      colorTexto = colores.primaryText
    } else if (temaClave === 'secondary') {
      fondo = colores.secondary
      colorTexto = colores.secondaryText
    } else if (temaClave === 'danger') {
      fondo = colores.danger || '#a84f16'
      colorTexto = colores.dangerText || '#fff1e3'
    } else {
      fondo = colores.darkAlt
      colorTexto = colores.darkAltText
    }
    const btn = document.createElement('button')
    btn.textContent = texto
    btn.className = 'config-boton'
    btn.style.background = fondo
    btn.style.color = colorTexto
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
    btn.addEventListener('click', callback)
    return btn
  }

  onCerrar(callback) {
    this._onCerrar = callback
  }

  onCambiarTema(callback) {
    this._onCambiarTema = callback
  }

  mostrar() {
    if (this.containerEl) {
      this.containerEl.style.display = 'flex'
      this.mostrarSeleccion(temaService.obtenerTemaActual())
    }
  }

  ocultar() {
    if (this.containerEl) this.containerEl.style.display = 'none'
  }
}
