import * as GUI from '@babylonjs/gui'
import videoTutorial from '../assets/VideoTutorial.mp4'

export class VistaTutorial {
  constructor(gui) {
    this.gui = gui
    this.fondo = null
    this.container = null
    this.botonCerrar = null
    this.panel = null
    this.video = null
  }

  crear() {
    const fondo = new GUI.Rectangle()
    fondo.width = 1
    fondo.height = 1
    fondo.thickness = 0
    fondo.background = 'rgba(12, 9, 8, 0.64)'
    fondo.isVisible = false
    this.gui.addControl(fondo)
    this.fondo = fondo

    const rect = new GUI.Rectangle()
    rect.width = 0.8
    rect.height = 0.8
    rect.background = 'transparent'
    rect.thickness = 0
    rect.isVisible = false

    fondo.addControl(rect)
    this.container = rect

    const panel = document.createElement('div')
    panel.style.position = 'absolute'
    panel.style.top = '50%'
    panel.style.left = '50%'
    panel.style.width = 'auto'
    panel.style.height = 'auto'
    panel.style.maxWidth = 'none'
    panel.style.maxHeight = 'none'
    panel.style.transform = 'translate(-50%, -50%)'
    panel.style.border = 'none'
    panel.style.borderRadius = '0'
    panel.style.boxSizing = 'border-box'
    panel.style.backgroundColor = 'transparent'
    panel.style.boxShadow = 'none'
    panel.style.zIndex = '20'
    panel.style.display = 'none'
    panel.style.overflow = 'visible'
    panel.style.padding = '0'
    panel.style.flexDirection = 'column'
    panel.style.alignItems = 'center'
    panel.style.justifyContent = 'center'
    panel.style.gap = '14px'

    const contenedorVideo = document.createElement('div')
    contenedorVideo.style.width = 'auto'
    contenedorVideo.style.flex = '0 0 auto'
    contenedorVideo.style.position = 'relative'
    contenedorVideo.style.display = 'flex'
    contenedorVideo.style.alignItems = 'center'
    contenedorVideo.style.justifyContent = 'center'
    contenedorVideo.style.background = 'transparent'
    contenedorVideo.style.padding = '0'

    const video = document.createElement('video')
    video.src = videoTutorial
    video.controls = true
    video.style.display = 'block'
    video.style.width = 'auto'
    video.style.height = 'auto'
    video.style.boxSizing = 'border-box'
    video.style.backgroundColor = 'transparent'
    video.style.border = '2px solid #8e4d22'
    video.style.borderRadius = '10px'

    const ajustarTamanoVideo = () => {
      const anchoMax = window.innerWidth * 0.8
      const altoMax = window.innerHeight * 0.8
      const relacion = video.videoWidth && video.videoHeight
        ? video.videoWidth / video.videoHeight
        : 16 / 9

      const ancho = Math.min(anchoMax, altoMax * relacion)
      const alto = ancho / relacion

      video.style.width = `${ancho}px`
      video.style.height = `${alto}px`
    }

    video.addEventListener('loadedmetadata', ajustarTamanoVideo)
    window.addEventListener('resize', ajustarTamanoVideo)
    ajustarTamanoVideo()

    const btnCerrar = document.createElement('button')
    btnCerrar.type = 'button'
    btnCerrar.textContent = 'X'
    btnCerrar.style.position = 'absolute'
    btnCerrar.style.top = '-20px'
    btnCerrar.style.right = '-20px'
    btnCerrar.style.width = '40px'
    btnCerrar.style.height = '40px'
    btnCerrar.style.border = '2px solid rgba(255, 216, 188, 0.85)'
    btnCerrar.style.borderRadius = '50%'
    btnCerrar.style.background = 'rgba(54, 41, 36, 0.9)'
    btnCerrar.style.color = '#ffd8bc'
    btnCerrar.style.fontSize = '20px'
    btnCerrar.style.fontWeight = '700'
    btnCerrar.style.lineHeight = '1'
    btnCerrar.style.fontFamily = "'Comic Sans MS', cursive"
    btnCerrar.style.cursor = 'pointer'

    contenedorVideo.appendChild(video)
    contenedorVideo.appendChild(btnCerrar)
    panel.appendChild(contenedorVideo)

    this.botonCerrar = btnCerrar
    this.panel = panel
    document.body.appendChild(panel)
    this.video = video
  }

  mostrar() {
    if (!this.fondo || !this.container || !this.panel || !this.video) return

    this.fondo.isVisible = true
    this.container.isVisible = true
    this.panel.style.display = 'flex'
    this.video.play()
  }

  ocultar() {
    if (!this.fondo || !this.container || !this.panel || !this.video) return

    this.fondo.isVisible = false
    this.container.isVisible = false
    this.video.pause()
    this.panel.style.display = 'none'
  }

  alCerrar(callback) {
    if (!this.botonCerrar) return

    this.botonCerrar.addEventListener('click', callback)
  }
}

