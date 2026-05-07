export class GestorAjusteRatio {
  static DEFAULTS = {
    idealWidth: 1600,
    idealHeight: 900,
    maxWidthRatio: 0.8,
    maxHeightRatio: 0.8
  }

  static esMovil() {
    return window.innerWidth <= 768 || ('ontouchstart' in window && window.innerWidth < 1024)
  }

  static esTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024
  }

  static esEscritorio() {
    return window.innerWidth > 1024
  }

  static esLandscape() {
    return window.innerWidth > window.innerHeight
  }

  static esPortrait() {
    return window.innerWidth <= window.innerHeight
  }

  static obtenerFactorEscala() {
    const ancho = window.innerWidth
    const alto = window.innerHeight
    const idealW = GestorAjusteRatio.DEFAULTS.idealWidth
    const idealH = GestorAjusteRatio.DEFAULTS.idealHeight
    return Math.min(ancho / idealW, alto / idealH, 1)
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

  static calcularTamanoResponsive(tamanoBase, tamanoMovil, tamanoTablet) {
    if (GestorAjusteRatio.esMovil()) return tamanoMovil
    if (GestorAjusteRatio.esTablet()) return tamanoTablet || tamanoBase
    return tamanoBase
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

  static aplicarEstilosResponsive(estilos) {
    const sufijo = GestorAjusteRatio.esMovil() ? 'Movil' : GestorAjusteRatio.esTablet() ? 'Tablet' : ''

    const estilosAplicar = {}
    for (const [clave, valor] of Object.entries(estilos)) {
      const claveSufijo = clave + sufijo
      estilosAplicar[clave] = estilos[claveSufijo] !== undefined ? estilos[claveSufijo] : valor
    }

    return estilosAplicar
  }
}
