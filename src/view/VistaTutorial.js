import videoTutorial from '../assets/VideoTutorial.mp4'
import { GestorAjusteRatio } from './base/GestorAjusteRatio.js'
import './estilos/EstiloVistaTutorial.css'

export class VistaTutorial {
  constructor() {
    this.containerEl = null
    this.videoEl = null
    this.botonCerrar = null
    this.cleanupVideoResize = null
  }

  crear() {
    const container = document.createElement('div')
    container.id = 'vistaTutorial'
    container.className = 'tutorial-overlay'
    container.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:none;justify-content:center;align-items:center;'
    document.body.appendChild(container)
    this.containerEl = container

    const contenedorVideo = document.createElement('div')
    contenedorVideo.className = 'tutorial-contenedor-video'
    container.appendChild(contenedorVideo)

    const video = document.createElement('video')
    video.src = videoTutorial
    video.controls = true
    video.className = 'tutorial-video'

    const ajustarTamanoVideo = () => {
      if (this.cleanupVideoResize) {
        this.cleanupVideoResize()
      }

      this.cleanupVideoResize = GestorAjusteRatio.crearAjustadorElemento(
        video,
        {
          contentWidth: video.videoWidth || 16,
          contentHeight: video.videoHeight || 9,
          maxWidthRatio: 0.8,
          maxHeightRatio: 0.8
        }
      )
    }

    video.addEventListener('loadedmetadata', ajustarTamanoVideo)
    ajustarTamanoVideo()

    contenedorVideo.appendChild(video)
    this.videoEl = video

    const btnCerrar = document.createElement('button')
    btnCerrar.textContent = 'X'
    btnCerrar.className = 'tutorial-boton-cerrar'
    const aplicarActivo = () => {
      btnCerrar.style.transform = 'scale(0.95)'
      btnCerrar.style.opacity = '0.85'
    }
    const removerActivo = () => {
      btnCerrar.style.transform = 'scale(1)'
      btnCerrar.style.opacity = '1'
    }
    btnCerrar.addEventListener('mouseenter', aplicarActivo)
    btnCerrar.addEventListener('mouseleave', removerActivo)
    btnCerrar.addEventListener('touchstart', aplicarActivo, { passive: true })
    btnCerrar.addEventListener('touchend', removerActivo, { passive: true })
    btnCerrar.addEventListener('touchcancel', removerActivo, { passive: true })
    contenedorVideo.appendChild(btnCerrar)
    this.botonCerrar = btnCerrar
  }

  mostrar() {
    if (!this.containerEl || !this.videoEl) return
    this.containerEl.style.display = 'flex'
    this.videoEl.play()
  }

  ocultar() {
    if (!this.containerEl || !this.videoEl) return
    this.videoEl.pause()
    this.containerEl.style.display = 'none'
  }

  onCerrar(callback) {
    if (!this.botonCerrar) return
    this.botonCerrar.addEventListener('click', callback)
  }
}
