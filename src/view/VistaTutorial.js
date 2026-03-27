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
    fondo.background = 'rgba(0, 0, 0, 0.65)'
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
    panel.style.width = 'min(80vw, 80vh * 1.7778)'
    panel.style.maxWidth = '80vw'
    panel.style.maxHeight = '80vh'
    panel.style.transform = 'translate(-50%, -50%)'
    panel.style.border = '3px solid #e5e7eb'
    panel.style.borderRadius = '14px'
    panel.style.boxSizing = 'border-box'
    panel.style.backgroundColor = '#000000'
    panel.style.zIndex = '20'
    panel.style.display = 'none'
    panel.style.overflow = 'hidden'

    const btnCerrar = document.createElement('button')
    btnCerrar.type = 'button'
    btnCerrar.textContent = 'X'
    btnCerrar.style.position = 'absolute'
    btnCerrar.style.top = '10px'
    btnCerrar.style.right = '10px'
    btnCerrar.style.width = '36px'
    btnCerrar.style.height = '36px'
    btnCerrar.style.border = '1px solid rgba(229, 231, 235, 0.65)'
    btnCerrar.style.borderRadius = '999px'
    btnCerrar.style.background = 'rgba(15, 23, 42, 0.8)'
    btnCerrar.style.color = '#ffffff'
    btnCerrar.style.fontSize = '18px'
    btnCerrar.style.cursor = 'pointer'
    btnCerrar.style.zIndex = '1'

    panel.appendChild(btnCerrar)
    this.botonCerrar = btnCerrar
    this.panel = panel

    const video = document.createElement('video')
    video.src = videoTutorial
    video.controls = true
    video.style.display = 'block'
    video.style.width = '100%'
    video.style.height = 'auto'
    video.style.maxHeight = '80vh'
    video.style.backgroundColor = '#000000'

    panel.appendChild(video)
    document.body.appendChild(panel)
    this.video = video
  }

  mostrar() {
    if (!this.fondo || !this.container || !this.panel || !this.video) return

    this.fondo.isVisible = true
    this.container.isVisible = true
    this.panel.style.display = 'block'
    this.video.play()
  }

  ocultar() {
    if (!this.fondo || !this.container || !this.panel || !this.video) return

    this.fondo.isVisible = false
    this.container.isVisible = false
    this.video.pause()
    this.panel.style.display = 'none'
  }

  onCerrar(callback) {
    if (!this.botonCerrar) return

    this.botonCerrar.addEventListener('click', callback)
  }
}
