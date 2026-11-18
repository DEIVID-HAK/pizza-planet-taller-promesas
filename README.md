# 🍕 Pizza Planet — Taller de Promesas y APIs

Taller educativo paso a paso: **Promesas JavaScript** + **API gratuita** + **Tailwind CSS** compilado localmente, en formato **SPA con navegación**.

> **"Imagina que le pides una pizza a una aplicación. Tú haces el pedido y no te quedas mirando la puerta durante 30 minutos. Mientras esperas, puedes hacer otras cosas. Una Promise funciona de manera parecida."**

## 🎯 Objetivo

Completar cada taller siguiendo los pasos, comprender qué ocurre en cada uno y resolver los retos. Ideal para estudiantes de ~11 años.

## 📚 Los 11 Talleres

| Taller | Tema | Descripción |
|--------|------|-------------|
| **1** | Promise básica | Pedir 1 post: `fetch()` + `.then()` + `.catch()` + `.finally()` |
| **2** | Promise + lista | Pedir varios usuarios y recorrer la lista |
| **3** | Promise.all | Post + Autor + Comentarios — todo o nada |
| **4** | Promise.allSettled | Revisar qué funcionó y qué falló |
| **5** | Promise.race | Carrera: el primero en terminar gana |
| **6** | Promise.any | El primer éxito importa |
| **7** | Máquina de Estados | UI reactiva PENDING / FULFILLED / REJECTED |
| **8** | async y await | Código legible + try/catch |
| **9** | Cámara | `getUserMedia()` + captura de fotos |
| **10** | Reportes | Generar, descargar e imprimir reportes |
| **11** | Geolocalización | Ubicación del usuario en un mapa |
| **🏆** | Reto Final | Super Explorador de APIs con todo lo aprendido |

## 🚀 Quick Start

```bash
# 1. Instalar dependencias
npm install

# 2. Compilar CSS (una vez)
npm run build:css

# 3. Servir y abrir en el navegador
npm start
```

Abre **http://localhost:3000** en tu navegador.

## ✨ Requisitos

- **Node.js** v18 o superior
- **Navegador** moderno (Chrome, Firefox, Edge)
- **Editor de código** (VS Code recomendado)

## 🗂️ Estructura del proyecto

```
PRENDCES/
├── index.html              ← SPA principal (sidebar + navegación)
├── src/
│   ├── app.js              ← Lógica SPA, router y todos los talleres
│   ├── input.css           ← Fuente de Tailwind CSS
│   └── styles.css          ← CSS compilado (generado por build)
├── package.json            ← Dependencias y scripts
├── tailwind.config.js      ← Configuración de Tailwind
├── postcss.config.js       ← Pipeline de procesamiento CSS
└── README.md               ← Este archivo
```

## 📦 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run build:css` | Compila Tailwind CSS una vez (producción) |
| `npm run watch:css` | Compila CSS en modo watch (desarrollo) |
| `npm run dev` | Alias de `watch:css` |
| `npm start` | Sirve el proyecto en localhost |
| `npm run clean` | Elimina el CSS compilado |

## 🔧 Tecnologías

- **JavaScript Vanilla** — Sin frameworks, sin transpiladores
- **Tailwind CSS 3** — Compilado localmente (sin CDN)
- **PostCSS + Autoprefixer** — Pipeline de procesamiento CSS
- **JSONPlaceholder API** — API gratuita de pruebas
- **OpenStreetMap** — Mapa gratuito para geolocalización

## 🧠 Tabla para recordar

| Herramienta | Explicación para niños |
|-------------|------------------------|
| Promise | Una promesa de que llegará una respuesta |
| `.then()` | Cuando termine, haz esto |
| `.catch()` | Si algo sale mal, haz esto |
| `.finally()` | Pase lo que pase, haz esto al final |
| `async` | Esta función trabaja con Promesas |
| `await` | Espera el resultado |
| `Promise.all()` | Esperar a que todos terminen |
| `Promise.allSettled()` | Revisar cómo terminó cada uno |
| `Promise.race()` | Gana el primero que termine |
| `Promise.any()` | Gana el primero que tenga éxito |
| `fetch()` | Pedir información a Internet |
| API | Un servicio que nos entrega información |
| `try/catch` | Intentar algo y atrapar errores |
| `getUserMedia()` | Pedir acceso a cámara o micrófono |
| Geolocalización | Obtener la ubicación del dispositivo |

## 📄 Licencia

ISC
