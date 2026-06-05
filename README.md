# JuegoAccidentesTecno

Un juego educativo que exponga la temática de los accidentes tecnológicos que surgen en los sistemas sociotécnicos, para fomentar la reflexión crítica sobre sus causas y consecuencias, entregando datos en distintos formatos para su posterior análisis.

## Licencia

Este proyecto está bajo la licencia GNU General Public License v3.0. Ver [LICENSE](LICENSE) para más detalles.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE (Navegador)                   │
│  ┌───────────────┐  ┌───────────────┐  ┌──────────────────┐ │
│  │  BabylonJS    │  │  Vistas DOM   │  │  SmartFox JS API │ │
│  │  (Render 3D)  │  │  (UI/HTML)    │  │  (WebSocket)     │ │
│  └───────┬───────┘  └───────┬───────┘  └────────┬─────────┘ │
│          │                  │                    │            │
│          └──────────────────┼────────────────────┘            │
│                             │                                │
│                     src/main.js (MVC)                        │
└──────────────┬────────────────────────┬──────────────────────┘
               │                        │
        Puerto 5173 (Vite)      Puerto 9933 (SmartFox)
               │                        │
┌──────────────▼──────────┐  ┌─────────▼──────────────────────┐
│   Servidor de Desarrollo │  │     SmartFoxServer 2X          │
│   (Vite / Node.js)       │  │     (Multijugador)             │
│                          │  │                                │
│   Rest Bridge ───────────┼──┼──► Extension: JuegoExtension.js│
│   (Express :3000)        │  │                                │
└──────────────┬───────────┘  └─────────┬──────────────────────┘
               │                        │
               ▼                        ▼
        ┌──────────────┐        ┌──────────────┐
        │   MongoDB    │        │  Rooms/Zones │
        │   (:27017)   │        │  (en memoria)│
        └──────────────┘        └──────────────┘
```

### Componentes principales

| Componente | Tecnología | Función |
|---|---|---|
| Frontend | BabylonJS 9.6.2 + Vite 8.0.1 | Motor gráfico 3D, vistas DOM, bundler |
| Servidor de juego | SmartFoxServer 2X | Multijugador en tiempo real, Rooms y Zones |
| REST Bridge | Express (Node.js) | Puente entre cliente y MongoDB |
| Base de datos | MongoDB | Almacenamiento de usuarios, logs, métricas y encuestas |
| Extensión SFS | JavaScript (SFS2X API) | Lógica de lobby, salas y sincronización |

## Requisitos del Sistema

### Requisitos generales

| Requisito | Especificación mínima | Especificación recomendada |
|---|---|---|
| Sistema operativo | Windows 10 / macOS 10.15 / Ubuntu 20.04 | Windows 11 / macOS 13 / Ubuntu 22.04 |
| Procesador | Dual-core 1.5 GHz | Quad-core 2.0 GHz o superior |
| Memoria RAM | 4 GB | 8 GB o superior |
| Almacenamiento | 2 GB disponibles | 5 GB disponibles |
| Navegador web | Chrome 90+, Firefox 88+, Edge 90+ | Última versión de Chrome o Edge |
| Conexión de red | 5 Mbps (local) | 10 Mbps o superior (red local) |

### Requisitos de software

| Software | Versión requerida | Propósito |
|---|---|---|
| Node.js | 18.x o superior (LTS recomendado) | Ejecución del REST Bridge y servidor de desarrollo |
| npm | 9.x o superior | Gestión de paquetes de Node.js |
| MongoDB | 6.x o superior | Base de datos no relacional |
| MongoDB Compass | 1.x (opcional) | Interfaz gráfica para administrar MongoDB |
| SmartFoxServer 2X | 2.13.0 o superior | Servidor de multijugador |
| Java Runtime | 8 o superior (requerido por SmartFoxServer) | Ejecución de SmartFoxServer |

## Instalación

### 1. Instalación de Node.js

1. Descargue el instalador de Node.js LTS desde https://nodejs.org/
2. Ejecute el instalador y siga las instrucciones.
3. Verifique la instalación:

```
node -v
npm -v
```

### 2. Instalación de MongoDB

1. Descargue MongoDB Community Server desde https://www.mongodb.com/try/download/community
2. Instale usando la configuración "Complete".
3. (Opcional) Instale MongoDB Compass para interfaz gráfica.

MongoDB se ejecuta por defecto en el puerto 27017. **No es necesario iniciarlo manualmente**, ya que se conecta automáticamente al ejecutar el REST Bridge (paso 6).

### 3. Instalación de SmartFoxServer 2X

1. Descargue SmartFoxServer 2X desde https://www.smartfoxserver.com/download
2. Ejecute el instalador. Puertos por defecto:
   - **Administración**: 8080
   - **Juego**: 9933
3. Asegúrese de tener Java Runtime Environment (JRE) 8 o superior:

```
java -version
```

4. Inicie SmartFoxServer ejecutando el archivo `sfs2x-standalone.exe`. La ruta por defecto tras la instalación es:

```
C:\Users\<tu-usuario>\SmartFoxServer_2X\SFS2X\sfs2x-standalone.exe
```

Se abrirá una ventana de consola mostrando los logs de inicio. Espere a que aparezca el mensaje `SmartFoxServer 2X started`.

5. Verifique el panel de administración en su navegador:

```
http://localhost:8080/admin/
```

### 4. Configuración de la Extensión de SmartFoxServer

1. Localice la carpeta de extensiones de SmartFoxServer:

```
# Windows
C:\Program Files\SmartFoxServer2X\Extensions\

# Linux
/opt/smartfoxserver2x/Extensions/
```

2. Cree una carpeta llamada `JuegoAccidentesTecno` dentro de esa ruta.

3. Copie el archivo `JuegoExtension.js` desde el proyecto:

```
# Desde la carpeta raíz del proyecto
copy "smartfox\extensions\JuegoAccidentesTecno\JuegoExtension.js" "C:\Program Files\SmartFoxServer2X\Extensions\JuegoAccidentesTecno\"
```

4. Configure la Zona desde el panel de administración (http://localhost:8080/admin/):
   - Vaya a **Zone Configurator**.
   - Cree una Zona con nombre: `JuegoAccidentesTecno`
   - En **Extensions**, agregue:
     - **Name**: JuegoExtension
     - **Type**: JavaScript
     - **File**: JuegoExtension.js
     - **Main**: Sí
   - Guarde y reinicie la Zona.

### 5. Instalación del Frontend

1. Navegue a la carpeta raíz del proyecto:

```
cd "ruta\al\proyecto\JuegoAccidentesTecno"
```

2. Instale las dependencias del frontend:

```
npm install
```

Este comando lee el archivo `package.json` de la carpeta raíz del proyecto e instala todas las dependencias listadas automáticamente en la carpeta `node_modules/`. Las dependencias principales son:
- `@babylonjs/core` (9.6.2): Motor gráfico 3D
- `@babylonjs/gui` (9.6.2): Interfaz gráfica para BabylonJS
- `vite` (8.0.1): Bundler y servidor de desarrollo
- `sharp` (0.34.5): Procesamiento de imágenes
- `plantuml-encoder` (1.4.0): Codificador de diagramas (dev)

3. Verifique que el archivo de la API de SmartFox exista:

```
# Windows
dir public\vendor\sfs2x-api-1.7.15.js
```

4. Inicie el servidor de desarrollo:

```
npm run dev
```

Acceda al juego en `http://localhost:5173`.

### 6. Instalación del REST Bridge

1. Navegue a la carpeta del REST Bridge:

```
cd rest-bridge
```

2. Instale las dependencias del REST Bridge:

```
npm install
```

Este comando lee el archivo `package.json` de la carpeta `rest-bridge/` e instala todas las dependencias listadas automáticamente en `rest-bridge/node_modules/`. Las dependencias principales son:
- `express` (5.2.1): Framework web para Node.js
- `mongoose` (9.5.0): ODM para MongoDB
- `cors` (2.8.6): Middleware para CORS
- `dotenv` (17.4.2): Gestión de variables de entorno
- `bcryptjs` (3.0.3): Encriptación de contraseñas

3. Verifique el archivo `.env`:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/JuegoAccidentesTecno
```

4. Inicie el servidor y la conexión a MongoDB:

```
node server.js
```

Verá:
```
[REST Bridge] Servidor corriendo en puerto 3000
[MongoDB] Conectado exitosamente
```

5. Verifique el estado en `http://localhost:3000/health`

### Resumen de puertos

| Servicio | Puerto | Protocolo |
|---|---|---|
| Frontend (Vite) | 5173 | HTTP |
| REST Bridge (Express) | 3000 | HTTP/REST |
| MongoDB | 27017 | TCP |
| SmartFoxServer (juego) | 9933 | TCP/WebSocket |
| SmartFoxServer (admin) | 8080 | HTTP |

## Configuración de Red para Multijugador

### Uso en red local

1. **Frontend**: Exponga en todas las interfaces:

```
npm run dev -- --host
```

2. **REST Bridge**: Edite `.env` en `rest-bridge`:

```
MONGODB_URI=mongodb://0.0.0.0:27017/JuegoAccidentesTecno
```

3. **SmartFoxServer**: Configure en `config/server.xml`:

```xml
<SocketKeypair>
    <address>0.0.0.0</address>
    <port>9933</port>
</SocketKeypair>
```

4. **Cliente**: En `src/services/SmartFoxService.js`, apunte a la IP del servidor en lugar de `localhost`.

### Configuración del firewall (Windows)

> **Nota:** En la mayoría de los casos no es necesario modificar el firewall para uso local. Solo aplique estas reglas si los dispositivos externos no pueden conectarse al servidor.

```powershell
# Ejecutar como administrador (solo si es necesario)
New-NetFirewallRule -DisplayName "SmartFoxServer Game" -Direction Inbound -LocalPort 9933 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "SmartFoxServer Admin" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "REST Bridge" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Vite Dev Server" -Direction Inbound -LocalPort 5173 -Protocol TCP -Action Allow
```

## Manual de Usuario

### Acceso al sistema

1. Abra un navegador compatible (Chrome, Firefox, Edge).
2. Navegue a la dirección del servidor (por defecto: `http://localhost:5173`).
3. Se mostrará la vista inicial con el fondo 3D animado.

### Registro de GameMaster

1. Seleccione **Registrarse** en la vista inicial.
2. Ingrese nombre de usuario y contraseña.
3. Confirme el registro. Los datos se guardan en MongoDB.

### Inicio de sesión

1. Seleccione **Iniciar sesión**.
2. Ingrese sus credenciales.
3. Se habilitarán las opciones de gestión de partidas.

### Creación de un Lobby

1. Como GameMaster, seleccione **Crear Lobby**.
2. El sistema genera un código único de 6 caracteres.
3. Comparta el código con los jugadores.

### Unión de jugadores

1. Los jugadores sin cuenta seleccionan **Jugar**.
2. Ingresan el código del lobby y un nombre temporal.
3. Aparecen en la vista de gestión del GameMaster.

### Gestión de partidas

El GameMaster puede:
- **Auto-distribuir**: Asigna jugadores automáticamente a las salas.
- **Distribución manual**: Arrastra jugadores hacia las salas deseadas.
- **Iniciar partida individual**: Botón **Iniciar** debajo de cada sala.
- **Iniciar todas**: Botón **Iniciar Todas** para comenzar todas las salas.
- **Modo prueba**: Botón **Probar** para prueba individual.

### Jugabilidad

1. El sistema asigna un perfil aleatorio y 3 cartas iniciales a cada jugador.
2. Se seleccionan 8 accidentes tecnológicos posibles.
3. Por turno, cada jugador puede:
   - **Jugar una carta**: Arrastrar desde su zona al tablero central.
   - **Intercambiar**: Intercambiar con otro jugador (misma cantidad de horas).
   - **Actividad grupal**: Afecta a todos los jugadores.
4. Al finalizar cada turno, probabilidad de activar un accidente.
5. La partida finaliza cuando todos completan sus perfiles.

### Modo de prueba

Controles adicionales para el GameMaster:
- **Fin de Turno**: Finaliza el turno manualmente.
- **Accidente**: Activa un accidente inmediatamente.
- **Intercambiar**: Simula intercambio con jugador virtual.
- **Reiniciar**: Reinicia el perfil para probar con cartas nuevas.

### Consulta de información

- **Reglas**: Reglas del juego, cartas y accidentes.
- **Tutorial**: Video explicativo.
- **Cartas**: Todas las cartas con descripciones.
- **Accidentes**: Todos los accidentes tecnológicos posibles.

### Encuesta de retroalimentación

Al finalizar una partida o desde el menú principal, los jugadores pueden completar una encuesta. Los resultados se almacenan en la colección `Encuestas` de MongoDB.

## Estructura de la Base de Datos

### Colecciones

| Colección | Descripción |
|---|---|
| `Usuarios` | Cuentas de GameMaster |
| `Logs` | Eventos del sistema |
| `Metricas` | Métricas de juego |
| `Encuestas` | Respuestas de jugadores |

### Tipos de eventos en Logs

| Tipo | Descripción |
|---|---|
| USUARIO | Registro, inicio y cierre de sesión |
| LOGS | Eventos de lobby y partida |
| METRICAS | Acciones de juego |
| SISTEMA | Eventos internos del servidor |

## Endpoints del REST Bridge

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/usuarios/register` | Registrar nuevo GameMaster |
| POST | `/api/usuarios/login` | Iniciar sesión |
| GET | `/api/usuarios` | Obtener todos los usuarios |
| POST | `/api/logs` | Guardar logs |
| GET | `/health` | Verificar estado |

## Comandos de SmartFoxServer Extension

| Comando | Dirección | Descripción |
|---|---|---|
| `ping` | Cliente → Servidor | Verificar conexión |
| `pong` | Servidor → Cliente | Respuesta al ping |
| `createLobby` | Cliente → Servidor | Crear lobby |
| `joinLobby` | Cliente → Servidor | Unirse a lobby |
| `crearSubSala` | Cliente → Servidor | Crear sub-sala |
| `iniciarPartida` | Cliente → Servidor | Iniciar partida |
| `log` | Cliente → Servidor | Registrar evento |

## Solución de Problemas

### MongoDB no se conecta

1. Verifique que MongoDB esté corriendo: `net start MongoDB`
2. Verifique que el puerto 27017 no esté bloqueado.
3. Verifique la URI en `.env` del REST Bridge.

### SmartFoxServer no responde

1. Verifique que SmartFoxServer esté corriendo.
2. Verifique puertos 9933 y 8080 en el firewall.
3. Verifique que `JuegoExtension.js` esté en la carpeta de extensiones.
4. Revise los logs en `SmartFoxServer2X/logs/`.

### Jugadores no pueden unirse al lobby

1. Verifique que el GameMaster creó el lobby correctamente.
2. Verifique que todos los dispositivos estén en la misma red.
3. Verifique la dirección de SmartFoxServer en `SmartFoxService.js`.

### El frontend no carga

1. Verifique que el servidor de desarrollo esté corriendo (`npm run dev`).
2. Abra la consola del navegador (F12) y revise errores.
3. Verifique que `sfs2x-api-1.7.15.js` exista en `public/vendor/`.

## Construcción para Producción

```
npm run build
```

Los archivos se generan en `dist/`. Para previsualizar:

```
npm run preview
```

## Limpieza de Datos

```
cd rest-bridge
node cleanupDB.js
```

Elimina datos de prueba de `Logs`, `Metricas` y `Encuestas`, manteniendo `Usuarios`.
