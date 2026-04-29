# 📦 Reporte de Mercancía

Sistema web para gestión y visualización de reportes de mercancía, con autenticación JWT, balanceo de carga, bot de Telegram, backups automáticos e ingesta automatizada de datos vía correo electrónico usando N8N.

---

## 🏗️ Arquitectura

```
Correo (asunto: "Reporte de Mercancía")
        │
        ▼
      N8N  ←── Cloudflare Tunnel (expone N8N al exterior)
 (automatización)
        │  1. Detecta adjunto reportemercancia.csv
        │  2. Convierte CSV → JSON
        │  3. POST /api/products  (Bearer JWT)
        ▼
Cliente → Nginx (Load Balancer) → app1 / app2 / app3 / app4 → PostgreSQL
                                                     ↑
                                              Telegram Bot
```

- **Nginx** distribuye el tráfico entre 4 instancias Node.js usando `least_conn`
- **4 réplicas** de la app Express para alta disponibilidad
- **PostgreSQL** como base de datos principal
- **Bot de Telegram** para consultas remotas
- **Servicio de backup** automático cada 60 segundos
- **N8N** orquesta la automatización de ingesta de datos vía email
- **Cloudflare Tunnel** expone N8N de forma segura a internet sin abrir puertos

---

## 🚀 Tecnologías

| Categoría | Tecnología |
|---|---|
| Runtime | Node.js (LTS Alpine) |
| Framework | Express 5 |
| Plantillas | Handlebars (express-handlebars) |
| Base de datos | PostgreSQL 15 + pg |
| Autenticación | JWT (jsonwebtoken) + bcrypt |
| Proxy / LB | Nginx |
| Bot | node-telegram-bot-api |
| HTTP Client | Axios |
| Automatización | N8N |
| Tunnel | Cloudflare Tunnel |
| Contenedores | Docker + Docker Compose |
| Dev | Nodemon |

---

## ⚙️ Instalación y uso

### Prerrequisitos

- [Docker](https://www.docker.com/) y Docker Compose instalados

### 1. Clonar el repositorio

```bash
git clone https://github.com/alexbernal28/Reporte_Mercancia.git
cd Reporte_Mercancia
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y completa los valores:

```bash
cp .env.EXAMPLE .env
```

Edita `.env`:

```env
# Base de datos
DB_URL=postgres://user:password@postgres:5432/database_name
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=database_name

# Aplicación
APP_VERSION=1.0.0
NODE_ENV=production
PORT=3000
JWT_SECRET=tu_secreto_seguro

# Telegram Bot
TELEGRAM_TOKEN=token_de_tu_bot
API_URL=http://nginx/api/products
HEALTH_URL=http://nginx/health
API_TOKEN=token_para_la_api
```

### 3. Levantar los servicios

```bash
docker compose up --build -d
```

### 4. Acceder a la aplicación

- **Web:** `http://localhost`
- **Health check:** `http://localhost/health`
- **API productos:** `http://localhost/api/products`

---

## 📁 Estructura del proyecto

```
├── src/
│   ├── app.js                  # Entrada principal de la app
│   ├── bots/
│   │   └── telegram.bot.js     # Bot de Telegram
│   ├── config/
│   │   └── db.js               # Conexión a PostgreSQL
│   ├── controllers/            # Lógica de controladores
│   ├── middlewares/
│   │   └── auth.middleware.js  # Validación JWT
│   ├── repositories/           # Acceso a datos (DB)
│   ├── routes/
│   │   └── routes.js           # Definición de rutas
│   ├── services/               # Lógica de negocio
│   ├── utils/                  # Utilidades (paths, dotenv)
│   └── views/                  # Plantillas Handlebars
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
└── .env.EXAMPLE
```

---

## 🔌 API Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/` | ✅ | Vista principal con paginación |
| `GET` | `/login` | ❌ | Página de login |
| `POST` | `/login` | ❌ | Autenticación de usuario |
| `GET` | `/api/products` | ✅ | Listar todos los productos |
| `POST` | `/api/products` | ✅ | Crear / actualizar productos (upsert) |
| `GET` | `/health` | ❌ | Estado de la API y base de datos |

La autenticación acepta tanto **cookie HTTP-only** (web) como **Bearer Token** (API).

---

## 🤖 Bot de Telegram

Comandos disponibles:

| Comando | Descripción |
|---|---|
| `/get` | Lista los últimos 10 productos registrados |
| `/health` | Muestra el estado actual del sistema |

---

## 🗄️ Base de datos

La app espera las siguientes tablas en PostgreSQL:

**`users`**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL
);
```

**`products`**
```sql
CREATE TABLE products (
    id INT PRIMARY KEY,
    nombre_mercancia VARCHAR(255),
    cantidad INT,
    transportista VARCHAR(255),
    fecha_salida DATE
);
```

---

## 💾 Backups

El servicio `backup` genera un dump comprimido de la base de datos cada 60 segundos en la carpeta `./backups/` con el formato:

```
backup_YYYYMMDD_HHMMSS.sql.gz
```

---

## 🔄 Automatización con N8N

El sistema incluye un flujo de automatización en **N8N** que permite ingestar datos de mercancía directamente desde el correo electrónico, sin intervención manual.

### ¿Cómo funciona?

1. **Trigger por email** — N8N monitorea una bandeja de entrada. Cuando llega un correo con el asunto exacto `Reporte de Mercancía` que incluya un adjunto llamado `reportemercancia.csv`, el flujo se activa automáticamente.

2. **Extracción del CSV** — N8N extrae el archivo adjunto y parsea su contenido.

3. **Conversión CSV → JSON** — Los datos del CSV se transforman a formato JSON compatible con la API del sistema. Cada fila del CSV se mapea a un objeto producto.

4. **Envío a la API** — N8N realiza una petición `POST /api/products` al sistema, incluyendo el token JWT en el header `Authorization: Bearer <token>`. Los datos se guardan (o actualizan via upsert) en PostgreSQL.

### Formato esperado del CSV

```csv
ID,Nombre_Mercancia,Cantidad,Transportista,fecha_salida
1,Producto A,100,Transportes XYZ,2024-01-15
2,Producto B,50,Logística ABC,2024-01-16
```

### Exposición de N8N con Cloudflare Tunnel

N8N corre localmente en el puerto `5678`. Para que pueda recibir webhooks y ser accesible desde internet, se utiliza **Cloudflare Tunnel** mediante el servicio `cloudflared` definido en `docker-compose.yml`:

```yaml
cloudflared:
  image: cloudflare/cloudflared:latest
  command: tunnel --no-autoupdate --url http://host.docker.internal:5678
```

Esto genera una URL pública segura (HTTPS) que apunta a N8N, sin necesidad de abrir puertos en el router ni configurar DNS manualmente.

---



- Contraseñas hasheadas con **bcrypt**
- Sesiones manejadas con **JWT** (expiración de 1 hora)
- Token enviado como **cookie HTTP-only** en la web
- Middleware de autenticación diferencia respuestas web (redirect) vs API (JSON 401)

---

## 👤 Autor

**Elvyn Alexander Bernal**  
[GitHub](https://github.com/alexbernal28)
