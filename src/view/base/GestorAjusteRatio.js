export class GestorAjusteRatio {
  static DEFAULTS = {
    idealWidth: 1600,
    idealHeight: 900,
    maxWidthRatio: 0.8,
    maxHeightRatio: 0.8
  }

  static configurarGUI(guiTexture, options = {}) {
    if (!guiTexture) return guiTexture

    const {
      idealWidth = GestorAjusteRatio.DEFAULTS.idealWidth,
      idealHeight = GestorAjusteRatio.DEFAULTS.idealHeight
    } = options

    guiTexture.idealWidth = idealWidth
    guiTexture.idealHeight = idealHeight
    guiTexture.useSmallestIdeal = true

    return guiTexture
  }

  static calcularTamanoAjustado({
    viewportWidth = window.innerWidth,
    viewportHeight = window.innerHeight,
    contentWidth,
    contentHeight,
    maxWidthRatio = GestorAjusteRatio.DEFAULTS.maxWidthRatio,
    maxHeightRatio = GestorAjusteRatio.DEFAULTS.maxHeightRatio
  }) {
    const anchoBase = contentWidth || 16
    const altoBase = contentHeight || 9
    const relacion = anchoBase / altoBase
    const anchoMax = viewportWidth * maxWidthRatio
    const altoMax = viewportHeight * maxHeightRatio
    const ancho = Math.min(anchoMax, altoMax * relacion)
    const alto = ancho / relacion

    return { ancho, alto }
  }

  static crearAjustadorElemento(element, options = {}) {
    if (!element) {
      return () => {}
    }

    const aplicarTamano = () => {
      const {
        ancho,
        alto
      } = GestorAjusteRatio.calcularTamanoAjustado({
        ...options
      })

      element.style.width = `${ancho}px`
      element.style.height = `${alto}px`
    }

    aplicarTamano()
    window.addEventListener('resize', aplicarTamano)

    return () => {
      window.removeEventListener('resize', aplicarTamano)
    }
  }
}
