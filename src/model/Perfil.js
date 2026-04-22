export class Perfil {
  constructor({ nombre, horasRequeridas, categoriasValidas, descripcion }) {
    this.nombre = nombre
    this.horasRequeridas = horasRequeridas
    this.categoriasValidas = categoriasValidas
    this.descripcion = descripcion
    this.horasCompletadas = 0
    this.completado = false
  }

  agregarHoras(horas) {
    this.horasCompletadas += horas
    if (this.horasCompletadas >= this.horasRequeridas) {
      this.horasCompletadas = this.horasRequeridas
      this.completado = true
    }
  }

  getProgreso() {
    return Math.min(this.horasCompletadas / this.horasRequeridas, 1)
  }

  cartaEsValida(categoria) {
    return this.categoriasValidas.includes(categoria)
  }

  reset() {
    this.horasCompletadas = 0
    this.completado = false
  }

  toJSON() {
    return {
      nombre: this.nombre,
      horasRequeridas: this.horasRequeridas,
      categoriasValidas: this.categoriasValidas,
      descripcion: this.descripcion,
      horasCompletadas: this.horasCompletadas,
      completado: this.completado
    }
  }

  static fromJSON(json) {
    const perfil = new Perfil(json)
    perfil.horasCompletadas = json.horasCompletadas || 0
    perfil.completado = json.completado || false
    return perfil
  }
}

export const PERFILES_PREDETERMINADOS = [
  {
    nombre: 'Analista de Sistemas',
    horasRequeridas: 6,
    categoriasValidas: ['Trabajo', 'Gestion', 'Desarrollo'],
    descripcion: 'Analiza y optimiza sistemas tecnologicos.'
  },
  {
    nombre: 'Desarrollador Full Stack',
    horasRequeridas: 8,
    categoriasValidas: ['Desarrollo', 'Gestion', 'Nube'],
    descripcion: 'Desarrolla aplicaciones de extremo a extremo.'
  },
  {
    nombre: 'Especialista en Redes',
    horasRequeridas: 6,
    categoriasValidas: ['Red', 'Seguridad'],
    descripcion: 'Administra infraestructura de redes.'
  },
  {
    nombre: 'Cientifico de Datos',
    horasRequeridas: 8,
    categoriasValidas: ['Datos', 'Inteligencia Artificial', 'Nube'],
    descripcion: 'Analiza datos y crea modelos predictivos.'
  },
  {
    nombre: 'Administrador de Bases de Datos',
    horasRequeridas: 6,
    categoriasValidas: ['Datos', 'Gestion', 'Seguridad'],
    descripcion: 'Administra y optimiza bases de datos.'
  },
  {
    nombre: 'Ingeniero de Software',
    horasRequeridas: 8,
    categoriasValidas: ['Desarrollo', 'Gestion', 'Trabajo'],
    descripcion: 'Diseña y desarrolla soluciones software.'
  },
  {
    nombre: 'Especialista en Seguridad',
    horasRequeridas: 6,
    categoriasValidas: ['Seguridad', 'Red', 'Datos'],
    descripcion: 'Protege sistemas de amenazas.'
  },
  {
    nombre: 'Arquitecto de Soluciones',
    horasRequeridas: 8,
    categoriasValidas: ['Gestion', 'Desarrollo', 'Nube'],
    descripcion: 'Disena arquitecturas tecnologicas.'
  },
  {
    nombre: 'Desarrollador DevOps',
    horasRequeridas: 6,
    categoriasValidas: ['Desarrollo', 'Red', 'Gestion'],
    descripcion: 'Automatiza procesos de desarrollo.'
  },
  {
    nombre: 'Especialista en Cloud',
    horasRequeridas: 6,
    categoriasValidas: ['Nube', 'Red', 'Seguridad'],
    descripcion: 'Administra servicios en la nube.'
  },
  {
    nombre: 'Analista de IA',
    horasRequeridas: 8,
    categoriasValidas: ['Inteligencia Artificial', 'Datos', 'Desarrollo'],
    descripcion: 'Desarrolla modelos de inteligencia artificial.'
  },
  {
    nombre: 'Gerente de Proyectos TI',
    horasRequeridas: 6,
    categoriasValidas: ['Gestion', 'Trabajo', 'Comunicacion'],
    descripcion: 'Lidera proyectos tecnologicos.'
  }
]

export function seleccionarPerfilAleatorio() {
  const indiceAleatorio = Math.floor(Math.random() * PERFILES_PREDETERMINADOS.length)
  return new Perfil(PERFILES_PREDETERMINADOS[indiceAleatorio])
}

export function seleccionarPerfilAleatorioExcluyendo(excluidos = []) {
  const disponibles = PERFILES_PREDETERMINADOS.filter(
    p => !excluidos.some(e => e.nombre === p.nombre)
  )
  if (disponibles.length === 0) {
    return new Perfil(PERFILES_PREDETERMINADOS[Math.floor(Math.random() * PERFILES_PREDETERMINADOS.length)])
  }
  const indiceAleatorio = Math.floor(Math.random() * disponibles.length)
  return new Perfil(disponibles[indiceAleatorio])
}
