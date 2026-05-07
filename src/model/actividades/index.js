import { ActividadFutbol } from './ActividadFutbol.js'
import { ActividadPelicula } from './ActividadPelicula.js'
import { ActividadHackathon } from './ActividadHackathon.js'
import { ActividadYoga } from './ActividadYoga.js'
import { ActividadEstudioGrupal } from './ActividadEstudioGrupal.js'
import { ActividadKaraoke } from './ActividadKaraoke.js'

export { ActividadFutbol, ActividadPelicula, ActividadHackathon, ActividadYoga, ActividadEstudioGrupal, ActividadKaraoke }

const FABRICA_ACTIVIDADES = [
  ActividadFutbol,
  ActividadPelicula,
  ActividadHackathon,
  ActividadYoga,
  ActividadEstudioGrupal,
  ActividadKaraoke
]

export function seleccionarActividadesAleatorias(cantidad = 3) {
  const copia = [...FABRICA_ACTIVIDADES]
  const seleccionadas = []

  for (let i = 0; i < cantidad && copia.length > 0; i++) {
    const indice = Math.floor(Math.random() * copia.length)
    const Fabrica = copia.splice(indice, 1)[0]
    seleccionadas.push(new Fabrica())
  }

  return seleccionadas
}
