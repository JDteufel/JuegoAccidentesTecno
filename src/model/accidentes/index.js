import { AccidenteSobrecargaRed } from './AccidenteSobrecargaRed.js'
import { AccidenteAtaqueDDoS } from './AccidenteAtaqueDDoS.js'
import { AccidenteFugaDatos } from './AccidenteFugaDatos.js'
import { AccidenteAtaqueSeguridad } from './AccidenteAtaqueSeguridad.js'
import { AccidenteFalloSoftware } from './AccidenteFalloSoftware.js'
import { AccidenteFalloHardware } from './AccidenteFalloHardware.js'
import { AccidenteSesgoIA } from './AccidenteSesgoIA.js'
import { AccidenteCorteEnergia } from './AccidenteCorteEnergia.js'
import { AccidentePhishingMasivo } from './AccidentePhishingMasivo.js'
import { AccidenteInterferenciaEM } from './AccidenteInterferenciaEM.js'
import { AccidenteFalloNube } from './AccidenteFalloNube.js'
import { AccidenteCorrupcionDatos } from './AccidenteCorrupcionDatos.js'
import { AccidenteVulnerabilidadZeroDay } from './AccidenteVulnerabilidadZeroDay.js'
import { AccidenteFalloActualizacion } from './AccidenteFalloActualizacion.js'
import { AccidenteExfiltracionDatos } from './AccidenteExfiltracionDatos.js'
import { AccidenteFalloAutenticacion } from './AccidenteFalloAutenticacion.js'

export { AccidenteSobrecargaRed, AccidenteAtaqueDDoS, AccidenteFugaDatos, AccidenteAtaqueSeguridad, AccidenteFalloSoftware, AccidenteFalloHardware, AccidenteSesgoIA, AccidenteCorteEnergia, AccidentePhishingMasivo, AccidenteInterferenciaEM, AccidenteFalloNube, AccidenteCorrupcionDatos, AccidenteVulnerabilidadZeroDay, AccidenteFalloActualizacion, AccidenteExfiltracionDatos, AccidenteFalloAutenticacion }

const FABRICA_ACCIDENTES = [
  AccidenteSobrecargaRed,
  AccidenteFugaDatos,
  AccidenteAtaqueSeguridad,
  AccidenteFalloSoftware,
  AccidenteFalloHardware,
  AccidenteSesgoIA,
  AccidenteCorteEnergia,
  AccidentePhishingMasivo,
  AccidenteInterferenciaEM,
  AccidenteFalloNube,
  AccidenteAtaqueDDoS,
  AccidenteCorrupcionDatos,
  AccidenteVulnerabilidadZeroDay,
  AccidenteFalloActualizacion,
  AccidenteExfiltracionDatos,
  AccidenteFalloAutenticacion
]

export function seleccionarAccidentesAleatorios(cantidad = 8) {
  const copia = [...FABRICA_ACCIDENTES]
  const seleccionados = []

  for (let i = 0; i < cantidad && copia.length > 0; i++) {
    const indice = Math.floor(Math.random() * copia.length)
    const Fabrica = copia.splice(indice, 1)[0]
    seleccionados.push(new Fabrica())
  }

  return seleccionados
}
