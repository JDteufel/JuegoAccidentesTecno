import { PerfilAnalistaSistemas } from './PerfilAnalistaSistemas.js'
import { PerfilDesarrolladorFullStack } from './PerfilDesarrolladorFullStack.js'
import { PerfilEspecialistaRedes } from './PerfilEspecialistaRedes.js'
import { PerfilCientificoDatos } from './PerfilCientificoDatos.js'
import { PerfilAdminBasesDatos } from './PerfilAdminBasesDatos.js'
import { PerfilIngenieroSoftware } from './PerfilIngenieroSoftware.js'
import { PerfilEspecialistaSeguridad } from './PerfilEspecialistaSeguridad.js'
import { PerfilArquitectoSoluciones } from './PerfilArquitectoSoluciones.js'
import { PerfilDesarrolladorDevOps } from './PerfilDesarrolladorDevOps.js'
import { PerfilEspecialistaCloud } from './PerfilEspecialistaCloud.js'
import { PerfilAnalistaIA } from './PerfilAnalistaIA.js'
import { PerfilGerenteProyectosTI } from './PerfilGerenteProyectosTI.js'
import { PerfilAdictoRedes } from './PerfilAdictoRedes.js'
import { PerfilEstudiante } from './PerfilEstudiante.js'
import { PerfilCommunityManager } from './PerfilCommunityManager.js'
import { PerfilGamer } from './PerfilGamer.js'
import { PerfilFreelancer } from './PerfilFreelancer.js'
import { PerfilDocente } from './PerfilDocente.js'

export { PerfilAnalistaSistemas, PerfilDesarrolladorFullStack, PerfilEspecialistaRedes, PerfilCientificoDatos, PerfilAdminBasesDatos, PerfilIngenieroSoftware, PerfilEspecialistaSeguridad, PerfilArquitectoSoluciones, PerfilDesarrolladorDevOps, PerfilEspecialistaCloud, PerfilAnalistaIA, PerfilGerenteProyectosTI, PerfilAdictoRedes, PerfilEstudiante, PerfilCommunityManager, PerfilGamer, PerfilFreelancer, PerfilDocente }

const FABRICA_PERFILES = [
  PerfilAnalistaSistemas,
  PerfilDesarrolladorFullStack,
  PerfilEspecialistaRedes,
  PerfilCientificoDatos,
  PerfilAdminBasesDatos,
  PerfilIngenieroSoftware,
  PerfilEspecialistaSeguridad,
  PerfilArquitectoSoluciones,
  PerfilDesarrolladorDevOps,
  PerfilEspecialistaCloud,
  PerfilAnalistaIA,
  PerfilGerenteProyectosTI,
  PerfilAdictoRedes,
  PerfilEstudiante,
  PerfilCommunityManager,
  PerfilGamer,
  PerfilFreelancer,
  PerfilDocente
]

export function seleccionarPerfilAleatorio() {
  const indice = Math.floor(Math.random() * FABRICA_PERFILES.length)
  return new FABRICA_PERFILES[indice]()
}

export function seleccionarPerfilAleatorioExcluyendo(excluidos = []) {
  const disponibles = FABRICA_PERFILES.filter(
    Fabrica => !excluidos.some(e => e.nombre === new Fabrica().nombre)
  )
  if (disponibles.length === 0) {
    const indice = Math.floor(Math.random() * FABRICA_PERFILES.length)
    return new FABRICA_PERFILES[indice]()
  }
  const indice = Math.floor(Math.random() * disponibles.length)
  return new disponibles[indice]()
}
