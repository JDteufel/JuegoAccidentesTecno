export const CATEGORIAS_CARTA = {
  TRABAJO: 'Trabajo',
  COMUNICACION: 'Comunicacion',
  NUBE: 'Nube',
  DIFUSION: 'Difusion',
  GESTION: 'Gestion',
  PRODUCTIVIDAD: 'Productividad',
  STREAMING: 'Streaming',
  DESARROLLO: 'Desarrollo',
  COMODIN: 'Comodin'
}

export class Carta {
  constructor({ titulo, categoria, codigo, detalle, color, tipo = 'actividad' }) {
    this.titulo = titulo
    this.categoria = categoria
    this.codigo = codigo
    this.detalle = detalle
    this.color = color
    this.tipo = tipo
    this.estado = 'activa'
    this.degradada = false
  }

  activar() {
    this.estado = 'activa'
    this.degradada = false
  }

  degradar() {
    this.estado = 'degradada'
    this.degradada = true
  }

  deshabilitar() {
    this.estado = 'deshabilitada'
  }

  estaActiva() {
    return this.estado === 'activa'
  }

  estaDeshabilitada() {
    return this.estado === 'deshabilitada'
  }

  getColor() {
    return this.color
  }

  toJSON() {
    return {
      titulo: this.titulo,
      categoria: this.categoria,
      codigo: this.codigo,
      detalle: this.detalle,
      color: this.color,
      tipo: this.tipo,
      estado: this.estado,
      degradada: this.degradada
    }
  }

  static fromJSON(json) {
    const carta = new Carta(json)
    carta.estado = json.estado || 'activa'
    carta.degradada = json.degradada || false
    return carta
  }
}

export const CARTAS_PREDETERMINADAS = [
  { titulo: 'GitHub', categoria: CATEGORIAS_CARTA.DESARROLLO, codigo: 'GH', detalle: 'Versiona tareas y coordina entregas.', color: '#d66a1f' },
  { titulo: 'Discord', categoria: CATEGORIAS_CARTA.COMUNICACION, codigo: 'DS', detalle: 'Coordina mensajes y actividades grupales.', color: '#b95a2e' },
  { titulo: 'Google Drive', categoria: CATEGORIAS_CARTA.NUBE, codigo: 'GD', detalle: 'Respalda archivos y comparte recursos.', color: '#cf8a34' },
  { titulo: 'YouTube', categoria: CATEGORIAS_CARTA.DIFUSION, codigo: 'YT', detalle: 'Expone contenido y tutoriales del equipo.', color: '#bc4a2c' },
  { titulo: 'Slack', categoria: CATEGORIAS_CARTA.TRABAJO, codigo: 'SL', detalle: 'Organiza conversaciones por canales.', color: '#845a3a' },
  { titulo: 'Twitch', categoria: CATEGORIAS_CARTA.STREAMING, codigo: 'TW', detalle: 'Activa eventos en vivo e interacciones.', color: '#7d4d31' },
  { titulo: 'Jira', categoria: CATEGORIAS_CARTA.GESTION, codigo: 'JR', detalle: 'Gestiona proyectos y seguimiento de tareas.', color: '#6b4c3a' },
  { titulo: 'Notion', categoria: CATEGORIAS_CARTA.PRODUCTIVIDAD, codigo: 'NT', detalle: 'Crea documentos y bases de conocimiento.', color: '#5a4a3a' },
  { titulo: 'VS Code', categoria: CATEGORIAS_CARTA.DESARROLLO, codigo: 'VC', detalle: 'Edita codigo fuente y depura aplicaciones.', color: '#007acc' },
  { titulo: 'Teams', categoria: CATEGORIAS_CARTA.COMUNICACION, codigo: 'TM', detalle: 'Colabora en reuniones y chats.', color: '#6264a7' },
  { titulo: 'AWS', categoria: CATEGORIAS_CARTA.NUBE, codigo: 'AWS', detalle: 'Proporciona servicios en la nube.', color: '#ff9900' },
  { titulo: 'Zoom', categoria: CATEGORIAS_CARTA.COMUNICACION, codigo: 'ZM', detalle: 'Realiza videoconferencias.', color: '#2d8cff' },
  { titulo: 'Figma', categoria: CATEGORIAS_CARTA.PRODUCTIVIDAD, codigo: 'FG', detalle: 'Disena interfaces graficas.', color: '#f24e1e' },
  { titulo: 'Trello', categoria: CATEGORIAS_CARTA.GESTION, codigo: 'TR', detalle: 'Organiza tareas con tableros.', color: '#0079bf' },
  { titulo: 'Docker', categoria: CATEGORIAS_CARTA.DESARROLLO, codigo: 'DC', detalle: 'Contenedores para aplicaciones.', color: '#2496ed' },
  { titulo: 'Kubernetes', categoria: CATEGORIAS_CARTA.DESARROLLO, codigo: 'K8', detalle: 'Orquesta contenedores.', color: '#326ce5' }
]

export function seleccionarCartasAleatorias(cantidad = 5, categoriasValidas = null) {
  let disponibles = [...CARTAS_PREDETERMINADAS]

  if (categoriasValidas && categoriasValidas.length > 0) {
    disponibles = disponibles.filter(carta =>
      categoriasValidas.includes(carta.categoria)
    )
    if (disponibles.length < cantidad) {
      disponibles = [...CARTAS_PREDETERMINADAS]
    }
  }

  const seleccionados = []
  const copia = [...disponibles]

  for (let i = 0; i < cantidad && copia.length > 0; i++) {
    const indiceAleatorio = Math.floor(Math.random() * copia.length)
    seleccionados.push(new Carta(copia.splice(indiceAleatorio, 1)[0]))
  }

  return seleccionados
}
