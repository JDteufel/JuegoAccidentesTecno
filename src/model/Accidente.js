export const CATEGORIAS_ACCIDENTE = {
  RED: 'Red',
  DATOS: 'Datos',
  SEGURIDAD: 'Seguridad',
  SOFTWARE: 'Software',
  HARDWARE: 'Hardware',
  IA: 'Inteligencia Artificial'
}

export class Accidente {
  constructor({ nombre, codigo, descripcion, categoriasAfectadas, nivel, mensajeDebilitacion, mensajeInhabilitacion }) {
    this.nombre = nombre
    this.codigo = codigo
    this.descripcion = descripcion
    this.categoriasAfectadas = categoriasAfectadas
    this.nivel = nivel
    this.mensajeDebilitacion = mensajeDebilitacion
    this.mensajeInhabilitacion = mensajeInhabilitacion
    this.activo = false
  }

  activar() {
    this.activo = true
  }

  desactivar() {
    this.activo = false
  }

  afectaCategoria(categoria) {
    return this.categoriasAfectadas.includes(categoria)
  }

  toJSON() {
    return {
      nombre: this.nombre,
      codigo: this.codigo,
      descripcion: this.descripcion,
      categoriasAfectadas: this.categoriasAfectadas,
      nivel: this.nivel,
      mensajeDebilitacion: this.mensajeDebilitacion,
      mensajeInhabilitacion: this.mensajeInhabilitacion,
      activo: this.activo
    }
  }

  static fromJSON(json) {
    const accidente = new Accidente(json)
    accidente.activo = json.activo || false
    return accidente
  }
}

export const ACCIDENTES_PREDETERMINADOS = [
  {
    nombre: 'Sobrecarga de Red',
    codigo: 'SR',
    descripcion: 'La red experimenta una sobrecarga que afecta las comunicaciones.',
    categoriasAfectadas: [CATEGORIAS_ACCIDENTE.RED],
    nivel: 1,
    mensajeDebilitacion: 'Las actividades de comunicacion han sido debilitadas.',
    mensajeInhabilitacion: 'Las actividades de comunicacion estan temporalmente inhabilitadas.'
  },
  {
    nombre: 'Fuga de Datos',
    codigo: 'FD',
    descripcion: 'Se ha producido una fuga de informacion sensible.',
    categoriasAfectadas: [CATEGORIAS_ACCIDENTE.DATOS, CATEGORIAS_ACCIDENTE.SEGURIDAD],
    nivel: 2,
    mensajeDebilitacion: 'Las actividades de almacenamiento han sido debilitadas.',
    mensajeInhabilitacion: 'Las actividades de almacenamiento estan temporalmente inhabilitadas.'
  },
  {
    nombre: 'Ataque de Seguridad',
    codigo: 'AS',
    descripcion: 'Un ataque compromete la seguridad del sistema.',
    categoriasAfectadas: [CATEGORIAS_ACCIDENTE.SEGURIDAD],
    nivel: 2,
    mensajeDebilitacion: 'Las actividades de seguridad han sido debilitadas.',
    mensajeInhabilitacion: 'Las actividades de seguridad estan temporalmente deshabilitadas.'
  },
  {
    nombre: 'Fallo de Software',
    codigo: 'FS',
    descripcion: 'Un fallo en el software afecta las operaciones.',
    categoriasAfectadas: [CATEGORIAS_ACCIDENTE.SOFTWARE],
    nivel: 1,
    mensajeDebilitacion: 'Las actividades de software han sido debilitadas.',
    mensajeInhabilitacion: 'Las actividades de software estan temporalmente deshabilitadas.'
  },
  {
    nombre: 'Fallo de Hardware',
    codigo: 'FH',
    descripcion: 'Problemas de hardware afectan el sistema.',
    categoriasAfectadas: [CATEGORIAS_ACCIDENTE.HARDWARE],
    nivel: 2,
    mensajeDebilitacion: 'Las actividades de hardware han sido debilitadas.',
    mensajeInhabilitacion: 'Las actividades de hardware estan temporalmente deshabilitadas.'
  },
  {
    nombre: 'Sesgo de IA',
    codigo: 'SI',
    descripcion: 'Un sistema de inteligencia artificial muestra comportamientos inesperados.',
    categoriasAfectadas: [CATEGORIAS_ACCIDENTE.IA],
    nivel: 3,
    mensajeDebilitacion: 'Las actividades de IA han sido debilitadas.',
    mensajeInhabilitacion: 'Las actividades de IA estan temporalmente deshabilitadas.'
  },
  {
    nombre: 'Corte de Energia',
    codigo: 'CE',
    descripcion: 'Un corte de energia afecta los sistemas.',
    categoriasAfectadas: [CATEGORIAS_ACCIDENTE.HARDWARE, CATEGORIAS_ACCIDENTE.RED],
    nivel: 2,
    mensajeDebilitacion: 'Los sistemas de infraestructura han sido debilitados.',
    mensajeInhabilitacion: 'Los sistemas de infraestructura estan temporalmente deshabilitados.'
  },
  {
    nombre: 'Phishing Masivo',
    codigo: 'PM',
    descripcion: 'Una campana de phishing afecta a los usuarios.',
    categoriasAfectadas: [CATEGORIAS_ACCIDENTE.SEGURIDAD, CATEGORIAS_ACCIDENTE.DATOS],
    nivel: 2,
    mensajeDebilitacion: 'Las actividades de comunicacion han sido debilitadas.',
    mensajeInhabilitacion: 'Las actividades de comunicacion estan temporalmente deshabilitadas.'
  },
  {
    nombre: 'Interferencia Electromagnetica',
    codigo: 'IE',
    descripcion: 'Interferencias afectan las senales electronicas.',
    categoriasAfectadas: [CATEGORIAS_ACCIDENTE.HARDWARE, CATEGORIAS_ACCIDENTE.RED],
    nivel: 1,
    mensajeDebilitacion: 'Las conexiones inalambricas han sido debilitadas.',
    mensajeInhabilitacion: 'Las conexiones inalambricas estan temporalmente deshabilitadas.'
  },
  {
    nombre: 'Fallo en la Nube',
    codigo: 'FN',
    descripcion: 'Los servicios en la nube presentan interrupciones.',
    categoriasAfectadas: [CATEGORIAS_ACCIDENTE.SOFTWARE, CATEGORIAS_ACCIDENTE.DATOS],
    nivel: 2,
    mensajeDebilitacion: 'Los servicios en la nube han sido debilitados.',
    mensajeInhabilitacion: 'Los servicios en la nube estan temporalmente deshabilitados.'
  },
  {
    nombre: 'Ataque DDoS',
    codigo: 'DD',
    descripcion: 'Un ataque distribuido de denegacion de servicio afecta el sistema.',
    categoriasAfectadas: [CATEGORIAS_ACCIDENTE.RED, CATEGORIAS_ACCIDENTE.SEGURIDAD],
    nivel: 3,
    mensajeDebilitacion: 'Los servicios de red han sido debilitados.',
    mensajeInhabilitacion: 'Los servicios de red estan temporalmente deshabilitados.'
  },
  {
    nombre: 'Corrupcion de Datos',
    codigo: 'CD',
    descripcion: 'Los datos se corrompen y pierden integridad.',
    categoriasAfectadas: [CATEGORIAS_ACCIDENTE.DATOS, CATEGORIAS_ACCIDENTE.SOFTWARE],
    nivel: 2,
    mensajeDebilitacion: 'Las operaciones de datos han sido debilitadas.',
    mensajeInhabilitacion: 'Las operaciones de datos estan temporalmente deshabilitadas.'
  },
  {
    nombre: 'Vulnerabilidad Zero-Day',
    codigo: 'ZD',
    descripcion: 'Una vulnerabilidad desconocida es explotada.',
    categoriasAfectadas: [CATEGORIAS_ACCIDENTE.SEGURIDAD, CATEGORIAS_ACCIDENTE.SOFTWARE],
    nivel: 3,
    mensajeDebilitacion: 'Los sistemas de seguridad han sido debilitados.',
    mensajeInhabilitacion: 'Los sistemas de seguridad estan temporalmente deshabilitados.'
  },
  {
    nombre: 'Fallo de Actualizacion',
    codigo: 'FA',
    descripcion: 'Una actualizacion critica falla y causa problemas.',
    categoriasAfectadas: [CATEGORIAS_ACCIDENTE.SOFTWARE],
    nivel: 1,
    mensajeDebilitacion: 'Los servicios han sido debilitados.',
    mensajeInhabilitacion: 'Los servicios estan temporalmente deshabilitados.'
  },
  {
    nombre: 'Exfiltracion de Datos',
    codigo: 'ED',
    descripcion: 'Datos sensibles son extraidos del sistema.',
    categoriasAfectadas: [CATEGORIAS_ACCIDENTE.DATOS, CATEGORIAS_ACCIDENTE.SEGURIDAD],
    nivel: 3,
    mensajeDebilitacion: 'Las operaciones de datos han sido debilitadas.',
    mensajeInhabilitacion: 'Las operaciones de datos estan temporalmente deshabilitadas.'
  },
  {
    nombre: 'Fallo de Autenticacion',
    codigo: 'FAU',
    descripcion: 'El sistema de autenticacion presenta fallos.',
    categoriasAfectadas: [CATEGORIAS_ACCIDENTE.SEGURIDAD],
    nivel: 2,
    mensajeDebilitacion: 'El acceso al sistema ha sido debilitado.',
    mensajeInhabilitacion: 'El acceso al sistema esta temporalmente deshabilitado.'
  }
]

export function seleccionarAccidentesAleatorios(cantidad = 8) {
  const copia = [...ACCIDENTES_PREDETERMINADOS]
  const seleccionados = []

  for (let i = 0; i < cantidad && copia.length > 0; i++) {
    const indiceAleatorio = Math.floor(Math.random() * copia.length)
    seleccionados.push(new Accidente(copia.splice(indiceAleatorio, 1)[0]))
  }

  return seleccionados
}
