import videoTutorial from '../assets/VideoTutorial.mp4'
import { GestorAjusteRatio } from './base/GestorAjusteRatio.js'

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
    container.style.cssText = `
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      display: none;
      justify-content: center;
      align-items: center;
      background: rgba(12, 9, 8, 0.64);
      z-index: 100;
    `
    document.body.appendChild(container)
    this.containerEl = container

    const contenedorVideo = document.createElement('div')
    contenedorVideo.style.cssText = `
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    `
    container.appendChild(contenedorVideo)

    const video = document.createElement('video')
    video.src = videoTutorial
    video.controls = true
    video.style.cssText = `
      border: 2px solid #8e4d22;
      border-radius: 10px;
      display: block;
    `

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
    btnCerrar.style.cssText = `
      position: absolute;
      top: -20px;
      right: -20px;
      width: 44px;
      height: 44px;
      border: 2px solid rgba(255, 216, 188, 0.85);
      border-radius: 50%;
      background: rgba(54, 41, 36, 0.9);
      color: #ffd8bc;
      font-size: 20px;
      font-weight: 700;
      font-family: 'Comic Neue', 'Comic Sans MS', cursive;
      cursor: pointer;
      transition: transform 0.2s, opacity 0.2s;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    `
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

  alCerrar(callback) {
    if (!this.botonCerrar) return
    this.botonCerrar.addEventListener('click', callback)
  }
}
