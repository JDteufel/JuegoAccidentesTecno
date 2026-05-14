import { CartaGitHub } from './CartaGitHub.js'
import { CartaDiscord } from './CartaDiscord.js'
import { CartaComodin } from './CartaComodin.js'
import { CartaVSCode } from './CartaVSCode.js'
import { CartaDocker } from './CartaDocker.js'
import { CartaKubernetes } from './CartaKubernetes.js'
import { CartaTeams } from './CartaTeams.js'
import { CartaZoom } from './CartaZoom.js'
import { CartaGoogleDrive } from './CartaGoogleDrive.js'
import { CartaAWS } from './CartaAWS.js'
import { CartaYouTube } from './CartaYouTube.js'
import { CartaTwitch } from './CartaTwitch.js'
import { CartaJira } from './CartaJira.js'
import { CartaTrello } from './CartaTrello.js'
import { CartaNotion } from './CartaNotion.js'
import { CartaFigma } from './CartaFigma.js'
import { CartaSlack } from './CartaSlack.js'
import { CartaSpotify } from './CartaSpotify.js'
import { CartaNetflix } from './CartaNetflix.js'
import { CartaTikTok } from './CartaTikTok.js'
import { CartaCoursera } from './CartaCoursera.js'
import { CartaDuolingo } from './CartaDuolingo.js'
import { CartaMeditar } from './CartaMeditar.js'
import { CartaFutbol } from './CartaFutbol.js'
import { CartaCaminar } from './CartaCaminar.js'
import { CartaDormirNoche } from './CartaDormirNoche.js'
import { CartaSiesta } from './CartaSiesta.js'
import { CartaLeer } from './CartaLeer.js'
import { CartaLinkedIn } from './CartaLinkedIn.js'
import { CartaReddit } from './CartaReddit.js'
import { CartaObsidian } from './CartaObsidian.js'
import { CartaStrava } from './CartaStrava.js'
import { CartaTwitter } from './CartaTwitter.js'
import { CartaPinterest } from './CartaPinterest.js'

export { CartaGitHub, CartaDiscord, CartaComodin, CartaVSCode, CartaDocker, CartaKubernetes, CartaTeams, CartaZoom, CartaGoogleDrive, CartaAWS, CartaYouTube, CartaTwitch, CartaJira, CartaTrello, CartaNotion, CartaFigma, CartaSlack, CartaSpotify, CartaNetflix, CartaTikTok, CartaCoursera, CartaDuolingo, CartaMeditar, CartaFutbol, CartaCaminar, CartaDormirNoche, CartaSiesta, CartaLeer, CartaLinkedIn, CartaReddit, CartaObsidian, CartaStrava, CartaTwitter, CartaPinterest }

const FABRICA_CARTAS = {
  GitHub: CartaGitHub,
  Discord: CartaDiscord,
  Comodin: CartaComodin,
  VSCode: CartaVSCode,
  Docker: CartaDocker,
  Kubernetes: CartaKubernetes,
  Teams: CartaTeams,
  Zoom: CartaZoom,
  GoogleDrive: CartaGoogleDrive,
  AWS: CartaAWS,
  YouTube: CartaYouTube,
  Twitch: CartaTwitch,
  Jira: CartaJira,
  Trello: CartaTrello,
  Notion: CartaNotion,
  Figma: CartaFigma,
  Slack: CartaSlack,
  Spotify: CartaSpotify,
  Netflix: CartaNetflix,
  TikTok: CartaTikTok,
  Coursera: CartaCoursera,
  Duolingo: CartaDuolingo,
  Meditar: CartaMeditar,
  Futbol: CartaFutbol,
  Caminar: CartaCaminar,
  DormirNoche: CartaDormirNoche,
  Siesta: CartaSiesta,
  Leer: CartaLeer,
  LinkedIn: CartaLinkedIn,
  Reddit: CartaReddit,
  Obsidian: CartaObsidian,
  Strava: CartaStrava,
  Twitter: CartaTwitter,
  Pinterest: CartaPinterest
}

const VARIANTES_HORAS = {
  GitHub: [1, 2, 3],
  Discord: [1, 2],
  Comodin: [1, 2, 3],
  VSCode: [1, 2, 3],
  Docker: [1, 2, 3],
  Kubernetes: [2, 3],
  Teams: [1, 2],
  Zoom: [1, 2],
  GoogleDrive: [1, 2],
  AWS: [2, 3, 4],
  YouTube: [1, 2],
  Twitch: [1, 2],
  Jira: [1, 2],
  Trello: [1, 2],
  Notion: [1, 2],
  Figma: [1, 2],
  Slack: [1, 2],
  Spotify: [1, 2, 3],
  Netflix: [1, 2, 3],
  TikTok: [1, 2, 4],
  Coursera: [2, 3],
  Duolingo: [1, 2],
  Meditar: [1, 2],
  Futbol: [1, 2, 3],
  Caminar: [1, 2],
  DormirNoche: [2, 3, 4],
  Siesta: [1, 2],
  Leer: [1, 2, 3],
  LinkedIn: [1, 2],
  Reddit: [1, 2],
  Obsidian: [1, 2, 3],
  Strava: [1, 2],
  Twitter: [1, 2],
  Pinterest: [1, 2]
}

export function crearCartaDesdeNombre(nombre, horas = null) {
  const Fabrica = FABRICA_CARTAS[nombre]
  if (!Fabrica) return null
  if (horas !== null) {
    return new Fabrica(horas)
  }
  const variantes = VARIANTES_HORAS[nombre]
  if (variantes && variantes.length > 0) {
    const horasAleatorias = variantes[Math.floor(Math.random() * variantes.length)]
    return new Fabrica(horasAleatorias)
  }
  return new Fabrica()
}

export function obtenerNombresCartas(categoriasValidas = null) {
  const todas = Object.keys(FABRICA_CARTAS)
  if (!categoriasValidas || categoriasValidas.length === 0) return todas
  return todas.filter(nombre => {
    const carta = crearCartaDesdeNombre(nombre)
    return carta && carta.categorias.some(cat => categoriasValidas.includes(cat))
  })
}

export function seleccionarCartasAleatorias(cantidad = 5, categoriasValidas = null) {
  const nombres = obtenerNombresCartas(categoriasValidas)
  if (nombres.length === 0) return []

  const copia = [...nombres]
  const seleccionadas = []

  for (let i = 0; i < cantidad && copia.length > 0; i++) {
    const indice = Math.floor(Math.random() * copia.length)
    const nombre = copia.splice(indice, 1)[0]
    seleccionadas.push(crearCartaDesdeNombre(nombre))
  }

  return seleccionadas
}

export function obtenerNombreCarta(nombre) {
  return FABRICA_CARTAS[nombre] ? nombre : null
}

export function obtenerVariantesHoras(nombre) {
  return VARIANTES_HORAS[nombre] || []
}
