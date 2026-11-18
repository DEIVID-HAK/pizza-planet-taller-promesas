/**
 * ================================================================
 * PIZZA PLANET — TALLER DE PROMESAS Y APIS
 * ================================================================
 *
 * Estructura SPA con navegacion por hash (#page)
 * 11 talleres + Reto Final
 *
 * API usada: JSONPlaceholder (https://jsonplaceholder.typicode.com/)
 * ================================================================
 */

const API = 'https://jsonplaceholder.typicode.com';

const PAGES = {
  home: 'Inicio',
  'promise-basica': 'Taller 1 · Promise básica',
  'promise-array': 'Taller 2 · Promise + lista',
  'promise-all': 'Taller 3 · Promise.all',
  'promise-allsettled': 'Taller 4 · Promise.allSettled',
  'promise-race': 'Taller 5 · Promise.race',
  'promise-any': 'Taller 6 · Promise.any',
  'maquina-estados': 'Taller 7 · Máquina de Estados',
  'async-await': 'Taller 8 · async y await',
  videos: 'Taller 9 · Cámara',
  reportes: 'Taller 10 · Reportes',
  geolocalizacion: 'Taller 11 · Geolocalización',
  'reto-final': '🏆 Reto Final'
};

// ================================================================
// UTILIDADES
// ================================================================

function sanitizeHTML(raw) {
  if (typeof raw !== 'string') return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };
  return raw.replace(/[&<>"']/g, match => map[match]);
}

function showLoading(containerId, message = 'Cargando...') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `<p class="text-slate-500">${sanitizeHTML(message)}</p>`;
}

function showError(containerId, message) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `<p class="text-red-400">Error: ${sanitizeHTML(message)}</p>`;
}

// ================================================================
// VISOR DE CÓDIGO DIDÁCTICO
// Muestra el código que implementa cada concepto, resaltado y
// comentado en español para que el estudiante entienda cada parte.
// ================================================================

function highlightJS(code) {
  // Resalta el código con un único recorrido para NO corromper
  // el HTML ya insertado (un tokenizador en una sola pasada).
  const tokens = [];
  let buffer = '';
  const flush = () => { if (buffer) { tokens.push({ t: 'txt', v: buffer }); buffer = ''; } };

  const esc = (s) => sanitizeHTML(s);
  const scanRegex = /\s*(\/\/[^\n]*|\/[^\n]*|[A-Za-z_$][\w$]*|\d+|\".*?\"|'.*?'|`.+?`|[^\w\s])/y;

  let i = 0;
  while (i < code.length) {
    // concatena comentario hasta fin de línea
    if (code.slice(i).search(/\/\//) === 0) {
      const nl = code.indexOf('\n', i);
      const end = nl === -1 ? code.length : nl;
      flush();
      tokens.push({ t: 'comment', v: code.slice(i, end) });
      i = end;
      continue;
    }
    // string doble
    if (code[i] === '"') {
      const end = code.indexOf('"', i + 1);
      const j = end === -1 ? code.length : end + 1;
      flush();
      tokens.push({ t: 'string', v: code.slice(i, j) });
      i = j;
      continue;
    }
    // string simple
    if (code[i] === "'") {
      const end = code.indexOf("'", i + 1);
      const j = end === -1 ? code.length : end + 1;
      flush();
      tokens.push({ t: 'string', v: code.slice(i, j) });
      i = j;
      continue;
    }
    // template string
    if (code[i] === '`') {
      const end = code.indexOf('`', i + 1);
      const j = end === -1 ? code.length : end + 1;
      flush();
      tokens.push({ t: 'string', v: code.slice(i, j) });
      i = j;
      continue;
    }
    // palabra o numero o símbolo
    const m = code.slice(i, i + 1).match(/[A-Za-z_\d]/);
    if (m) {
      let j = i;
      while (j < code.length && /[A-Za-z0-9_$]/.test(code[j])) j++;
      const word = code.slice(i, j);
      flush();
      if (/^\d+$/.test(word)) tokens.push({ t: 'num', v: word });
      else tokens.push({ t: 'word', v: word });
      i = j;
      continue;
    }
    // símbolo (.) método
    if (code[i] === '.') {
      let j = i + 1;
      while (j < code.length && /[A-Za-z0-9_$]/.test(code[j])) j++;
      flush();
      tokens.push({ t: 'method', v: code.slice(i, j) });
      i = j;
      continue;
    }
    // cualquier otro carácter
    buffer += code[i];
    i++;
  }
  flush();

  const KEYWORDS = new Set(['const','let','function','return','if','else','new','try','catch','finally','throw','async','await','true','false','null']);
  const FUNCS = new Set(['fetch','console','log','error','document','getElementById','setTimeout','JSON','forEach','Math']);

  return tokens.map(tok => {
    if (tok.t === 'txt') return esc(tok.v);
    if (tok.t === 'comment') return `<span class="text-slate-500 italic">${esc(tok.v)}</span>`;
    if (tok.t === 'string') return `<span class="text-emerald-400">${esc(tok.v)}</span>`;
    if (tok.t === 'num') return `<span class="text-amber-400">${esc(tok.v)}</span>`;
    if (tok.t === 'method') return `<span class="text-sky-400">${esc(tok.v)}</span>`;
    if (tok.t === 'word') {
      if (KEYWORDS.has(tok.v)) return `<span class="text-fuchsia-400 font-semibold">${esc(tok.v)}</span>`;
      if (FUNCS.has(tok.v)) return `<span class="text-cyan-300">${esc(tok.v)}</span>`;
      return esc(tok.v);
    }
    return esc(tok.v);
  }).join('');
}

const CONCEPT_CODE = {
  'promise-basica': `// TALLER 1 — MI PRIMERA PROMESA
// Pedimos 1 publicación a la API. fetch() devuelve una Promise.

fetch("https://jsonplaceholder.typicode.com/posts/1")
  // .then() -> "cuando termine, haz esto"
  .then(respuesta => {
    // Comprobamos que la respuesta fue correcta
    if (!respuesta.ok) {
      throw new Error("Error: " + respuesta.status);
    }
    return respuesta.json(); // La convertimos a un objeto
  })
  .then(post => {
    // Aquí tenemos los datos de la publicación
    console.log("Publicación recibida:", post.title);
  })
  // .catch() -> "si algo sale mal, haz esto"
  .catch(error => {
    console.error("Falló:", error.message);
  })
  // .finally() -> "pase lo que pase, al final haz esto"
  .finally(() => {
    console.log("La operación terminó");
  });`,

  'promise-array': `// TALLER 2 — UNA PROMESA CON UNA LISTA
// Pedimos una LISTA de usuarios (un array).

fetch("https://jsonplaceholder.typicode.com/users?_limit=5")
  .then(respuesta => {
    if (!respuesta.ok) throw new Error("HTTP " + respuesta.status);
    return respuesta.json(); // Es un ARRAY
  })
  .then(usuarios => {
    // Recorremos la lista con .map() para
    // convertir cada usuario en una tarjeta
    usuarios.map(usuario => {
      console.log(usuario.name);  // Nombre
      console.log(usuario.username); // Usuario
      console.log(usuario.email);  // Correo
      console.log(usuario.company.name); // Empresa
    });
  })
  .catch(error => console.error("Error:", error.message));`,

  'promise-all': `// TALLER 3 — Promise.all()
// 3 personas trabajan al mismo tiempo:
// una trae el post, otra el autor, otra los comentarios.

const peticionPost = fetch(".../posts/1").then(r => r.json());
const peticionAutor = fetch(".../users/1").then(r => r.json());
const peticionComentarios = fetch(".../posts/1/comments").then(r => r.json());

// Esperamos a que TODAS terminen
Promise.all([peticionPost, peticionAutor, peticionComentarios])
  .then(([post, autor, comentarios]) => {
    // Las 3 llegaron bien
    console.log("Título:", post.title);
    console.log("Autor:", autor.name);
    console.log("Comentarios:", comentarios.length);
  })
  // Si UNA falla, TODO falla ("todo o nada")
  .catch(error => console.error("Todo falló:", error.message));`,

  'promise-allsettled': `// TALLER 4 — Promise.allSettled()
// Revisamos qué operaciones funcionaron y cuáles fallaron.

const ids = [1, 2, 3, 99, 999]; // 99 y 999 no existen

// Una Promise por cada id
const peticiones = ids.map(id =>
  fetch(".../posts/" + id).then(r => {
    if (!r.ok) throw new Error("no existe");
    return r.json();
  })
);

// Promise.allSettled NUNCA rechaza:
// espera TODAS y revisa resultado por resultado
Promise.allSettled(peticiones).then(resultados => {
  resultados.forEach(resultado => {
    if (resultado.status === "fulfilled") {
      console.log("✅ ÉXITO del post", resultado.value.id);
    } else {
      console.log("❌ ERROR del post", resultado.reason.message);
    }
  });
});`,

  'promise-race': `// TALLER 5 — Promise.race()
// Dos tareas empiezan al mismo tiempo.
// GANA la primera que termina.

const peticionAPI = fetch(".../posts/1").then(r => r.json());

// Un temporizador de 2 segundos que producirá error al terminar
const temporizador = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(new Error("⏰ ¡Tiempo agotado!"));
  }, 2000);
});

// La primera en terminar (éxito O error) decide
Promise.race([peticionAPI, temporizador])
  .then(post => console.log("🏆 Ganó la API:", post.title))
  .catch(error => console.log("⏰ Ganó el timeout:", error.message));`,

  'promise-any': `// TALLER 6 — Promise.any()
// Tenemos varias puertas. Entramos por la PRIMERA
// que esté disponible (la primera en tener ÉXITO).

const peticiones = [
  fetch(".../posts/1").then(r => r.json()),   // puerta 1
  fetch(".../posts/2").then(r => r.json()),   // puerta 2
  fetch(".../posts/999")                       // puerta 3 (falla)
    .then(r => { if (!r.ok) throw new Error("no existe"); return r.json(); })
];

// Aunque una falle, la primera con ÉXITO gana
Promise.any(peticiones)
  .then(primeraExitosa => {
    console.log("🥇 Primer éxito: post", primeraExitosa.id);
  })
  // Solo rechaza si TODAS fallan
  .catch(error => console.error("❌ Todas fallaron:", error.message));`,

  'maquina-estados': `// TALLER 7 — LA MÁQUINA DE ESTADOS
// Una búsqueda pasa por varios estados.

const ESTADOS = {
  IDLE: "idle",        // no hacemos nada todavía
  PENDING: "pending",  // estamos buscando...
  FULFILLED: "fulfilled", // encontramos la información
  REJECTED: "rejected"    // ocurrió un error
};

async function buscar(userId) {
  mostrarEstado(ESTADOS.PENDING);   // ⏳ desactivamos el botón
  try {
    const res = await fetch(".../posts?userId=" + userId);
    const posts = await res.json();
    mostrarEstado(ESTADOS.FULFILLED); // ✅ mostramos los posts
  } catch (error) {
    mostrarEstado(ESTADOS.REJECTED);  // ❌ mostramos el error
  }
}`,

  'async-await': `// TALLER 8 — ASYNC Y AWAIT
// Una forma sencilla de leer código con Promesas.

async function obtenerPostsDeUsuario(userId) {
  // await = "espera el resultado" (como poner un bloqueo)
  const respuesta = await fetch(".../posts?userId=" + userId);

  // Comprobamos que responda bien
  if (!respuesta.ok) throw new Error("Error HTTP " + respuesta.status);

  const posts = await respuesta.json(); // esperamos a convertir
  return posts;
}

// try = "intenta hacer esto"
try {
  const posts = await obtenerPostsDeUsuario(1);
  posts.forEach(post => console.log("Post:", post.title));
}
// catch = "si falla, atrapa el error"
catch (error) {
  console.error("Algo salió mal:", error.message);
}`,
};

function renderConceptCode() {
  for (const [key, code] of Object.entries(CONCEPT_CODE)) {
    const el = document.getElementById(`code-${key}`);
    if (!el) continue;
    el.innerHTML = highlightJS(code);
  }
}

function getPageFromHash() {
  const hash = window.location.hash.replace('#', '') || 'home';
  return hash;
}

function navigateTo(page) {
  window.location.hash = page;
}

function updateNavActive() {
  const currentPage = getPageFromHash();
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkPage = link.getAttribute('data-page');
    if (linkPage === currentPage) {
      link.classList.add('active');
      link.classList.remove('text-slate-400');
    } else {
      link.classList.remove('active');
      link.classList.add('text-slate-400');
    }
  });
}

function updatePageTitle() {
  const currentPage = getPageFromHash();
  const title = PAGES[currentPage] || currentPage;
  const titleEl = document.getElementById('page-title');
  if (titleEl) {
    titleEl.textContent = title;
  }
}

function showPage(pageName) {
  document.querySelectorAll('.page-section').forEach(section => {
    section.classList.add('hidden');
  });
  const target = document.getElementById(`page-${pageName}`);
  if (target) {
    target.classList.remove('hidden');
  }
  updateNavActive();
  updatePageTitle();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================================================================
// RUTAS SPA
// ================================================================

function handleRoute() {
  const page = getPageFromHash();
  if (!PAGES[page]) {
    navigateTo('home');
    return;
  }
  showPage(page);
  loadPageData(page);
}

function loadPageData(page) {
  switch (page) {
    case 'promise-basica': loadSinglePost(); break;
    case 'promise-array': loadUsersList(); break;
    case 'promise-all': loadCombinedData(); break;
    case 'promise-allsettled': loadSettledPosts(); break;
    case 'promise-race': loadRaceResult(); break;
    case 'promise-any': loadAnyResult(); break;
    case 'maquina-estados': initSearchIfNeeded(); break;
    case 'async-await': initAsyncSearchIfNeeded(); break;
    case 'videos': break;
    case 'reportes': break;
    case 'geolocalizacion': break;
    case 'reto-final': initRetoFinalIfNeeded(); break;
    default: break;
  }
}


// ================================================================
// TALLER 1 — MI PRIMERA PROMESA (Promise básica)
// ================================================================

function loadSinglePost(postId = null) {
  const container = document.getElementById('single-post');
  if (!container) return;

  const idInput = document.getElementById('single-post-id');
  const id = postId !== null ? postId : (idInput ? Number(idInput.value) || 1 : 1);

  showLoading('single-post', `🍕 Cargando la publicación nº ${id}...`);
  console.log(`[Taller 1] ⏳ IDLE → Pedimos la publicación nº ${id}`);

  fetch(`${API}/posts/${id}`)
    .then(response => {
      console.log('[Taller 1] Respuesta recibida:', response.status);
      if (!response.ok) {
        throw new Error(`La API respondió con HTTP ${response.status} (la publicación ${id} no existe)`);
      }
      return response.json();
    })
    .then(post => {
      console.log('[Taller 1] ✅ FULFILLED. Publicación recibida:', post);
      container.innerHTML = `
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-white">${sanitizeHTML(post.title)}</h3>
            <span class="bg-red-500/10 text-red-400 text-xs font-bold px-2 py-1 rounded">Publicación nº ${post.id}</span>
          </div>
          <p class="text-slate-400 leading-relaxed">${sanitizeHTML(post.body)}</p>
          <div class="flex gap-3 text-xs text-slate-500">
            <span><strong class="text-slate-300">Nº de publicación:</strong> ${post.id}</span>
            <span><strong class="text-slate-300">Autor nº:</strong> ${post.userId}</span>
          </div>
        </div>
      `;
    })
    .catch(error => {
      console.error('[Taller 1] ❌ REJECTED. Error:', error.message);
      showError('single-post', error.message);
    })
    .finally(() => {
      console.log('[Taller 1] 🎬 Fin de la operación (finally)');
      const footer = document.createElement('p');
      footer.className = 'text-xs text-slate-600 mt-3 border-t border-slate-800 pt-2';
      footer.textContent = '✅ Operación terminada (finally)';
      if (!container.querySelector('.finally-note')) {
        footer.classList.add('finally-note');
        footer.style.opacity = '0.7';
        container.appendChild(footer);
      }
    });
}

// ================================================================
// TALLER 2 — UNA PROMESA CON UNA LISTA (Promise + array)
// ================================================================

function loadUsersList(limit = null) {
  const container = document.getElementById('users-list');
  if (!container) return;

  const limitInput = document.getElementById('users-limit');
  const n = limit !== null ? limit : (limitInput ? Number(limitInput.value) || 5 : 5);

  showLoading('users-list', `👤 Cargando ${n} usuarios...`);
  console.log('[Taller 2] ⏳ Solicitando usuarios...');

  fetch(`${API}/users?_limit=${n}`)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(users => {
      console.log(`[Taller 2] ✅ Recibimos ${users.length} usuarios`);
      container.innerHTML = users.map(user => `
        <div class="bg-slate-900 rounded-xl p-4 border border-slate-800 hover:border-blue-700 transition-all">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
              ${user.name.charAt(0)}
            </div>
            <div>
              <h3 class="font-bold text-white text-sm">${sanitizeHTML(user.name)}</h3>
              <p class="text-xs text-slate-500">@${sanitizeHTML(user.username)}</p>
            </div>
          </div>
          <div class="text-xs space-y-1 text-slate-400">
            <p>📧 ${sanitizeHTML(user.email)}</p>
            <p>🏢 <strong class="text-slate-300">${sanitizeHTML(user.company.name)}</strong></p>
          </div>
        </div>
      `).join('');
    })
    .catch(error => {
      console.error('[Taller 2] ❌ Error:', error.message);
      showError('users-list', error.message);
    })
    .finally(() => {
      console.log('[Taller 2] 🎬 Lista de usuarios terminada');
    });
}

// ================================================================
// TALLER 3 — Promise.all() (Post + Autor + Comentarios)
// ================================================================

function loadCombinedData() {
  const container = document.getElementById('combined-data');
  if (!container) return;

  showLoading('combined-data', '🍕 Cargando publicación + autor + comentarios...');
  console.log('[Taller 3] ⏳ Disparamos 3 peticiones en paralelo');

  const postPromise = fetch(`${API}/posts/1`).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
  const userPromise = fetch(`${API}/users/1`).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
  const commentsPromise = fetch(`${API}/posts/1/comments`).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });

  Promise.all([postPromise, userPromise, commentsPromise])
    .then(([post, user, comments]) => {
      console.log('[Taller 3] ✅ Promise.all: las 3 terminaron', { post, user, comments });
      container.innerHTML = `
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <h3 class="text-lg font-bold text-white">${sanitizeHTML(post.title)}</h3>
            <span class="bg-purple-500/10 text-purple-400 text-xs font-bold px-2 py-1 rounded">Publicación nº ${post.id}</span>
          </div>
          <p class="text-slate-400">${sanitizeHTML(post.body)}</p>
          <div class="bg-slate-800/50 rounded-lg p-3 text-sm">
            <p class="font-bold text-emerald-400 mb-1">👨‍🍳 Autor: ${sanitizeHTML(user.name)}</p>
            <p class="text-slate-400 text-xs">@${sanitizeHTML(user.username)} · ${sanitizeHTML(user.email)}</p>
          </div>
          <div>
            <p class="font-bold text-white mb-2">💬 Comentarios (${comments.length})</p>
            <div class="space-y-2">
              ${comments.slice(0, 3).map(c => `
                <div class="bg-slate-800/40 rounded-lg p-3">
                  <p class="text-sm font-semibold text-slate-200">${sanitizeHTML(c.name)}</p>
                  <p class="text-xs text-slate-500">${sanitizeHTML(c.email)}</p>
                  <p class="text-sm text-slate-400 mt-1">${sanitizeHTML(c.body)}</p>
                </div>
              `).join('')}
            </div>
          </div>
          <p class="text-xs text-emerald-400 font-semibold">✅ Las 3 peticiones se resolvieron correctamente (Promise.all = todo o nada)</p>
        </div>
      `;
    })
    .catch(error => {
      console.error('[Taller 3] ❌ Promise.all falló:', error.message);
      container.innerHTML = `
        <div class="p-3 bg-red-950/40 border border-red-800/60 rounded-lg text-red-400 text-sm">
          <strong>Promise.all falló:</strong> si una de las peticiones falla, todo falla. Error: ${sanitizeHTML(error.message)}
        </div>
        <p class="text-xs text-slate-500 mt-2">💡 Este es el comportamiento "todo o nada". Prueba con una URL incorrecta en el reto.</p>
      `;
    });
}

// ================================================================
// TALLER 4 — Promise.allSettled() (Detective de errores)
// ================================================================

function loadSettledPosts() {
  const container = document.getElementById('settled-posts');
  if (!container) return;

  // IDs correctos + uno incorrecto (para el "detective")
  const ids = [1, 2, 3, 99, 999];
  showLoading('settled-posts', '🔍 Revisando 5 publicaciones (incluye una con número no válido)...');
  console.log('[Taller 4] ⏳ IDs a consultar:', ids);

  const promises = ids.map(id =>
    fetch(`${API}/posts/${id}`).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
  );

  Promise.allSettled(promises)
    .then(results => {
      console.log('[Taller 4] ✅ Resultados allSettled:', results);
      container.innerHTML = results.map((result, i) => {
        if (result.status === 'fulfilled') {
          return `
            <div class="bg-emerald-950/30 border border-emerald-800/60 rounded-xl p-4">
              <div class="flex items-center justify-between mb-2">
                <p class="text-emerald-400 font-bold text-sm">✅ Publicación nº ${result.value.id} — ÉXITO</p>
                <span class="text-xs text-emerald-500">funcionó</span>
              </div>
              <h3 class="text-sm font-semibold text-white">${sanitizeHTML(result.value.title)}</h3>
            </div>
          `;
        }
        return `
          <div class="bg-red-950/30 border border-red-800/60 rounded-xl p-4">
            <div class="flex items-center justify-between mb-2">
              <p class="text-red-400 font-bold text-sm">❌ Publicación nº ${ids[i]} — ERROR</p>
              <span class="text-xs text-red-500">falló</span>
            </div>
            <p class="text-sm text-red-300">${sanitizeHTML(result.reason.message)}</p>
          </div>
        `;
      }).join('');
    })
    .finally(() => {
      console.log('[Taller 4] 🎬 Revisión terminada');
    });
}

// ================================================================
// TALLER 5 — Promise.race() (Carrera contra el tiempo)
// ================================================================

function loadRaceResult() {
  const container = document.getElementById('race-result');
  if (!container) return;

  showLoading('race-result', '🏁 Comienza la carrera: la API vs un temporizador de 2 segundos...');
  console.log('[Taller 5] ⏳ Lanzando la carrera');

  const apiRequest = fetch(`${API}/posts/1`).then(r => {
    if (!r.ok) throw new Error('Error de API');
    return r.json();
  }, error => { throw error; });

  const timeout = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('⏰ Tiempo agotado: ganó el TIMEOUT (2s)')), 2000);
  });

  Promise.race([apiRequest, timeout])
    .then(post => {
      console.log('[Taller 5] 🏆 GANÓ LA API:', post);
      container.innerHTML = `
        <div class="p-4 bg-emerald-950/30 border border-emerald-800/60 rounded-lg">
          <p class="text-emerald-400 font-bold mb-2">🏆 ¡Ganó la API! (respondió antes de 2 segundos)</p>
          <h3 class="text-white font-bold">${sanitizeHTML(post.title)}</h3>
          <p class="text-slate-400 text-sm mt-2">${sanitizeHTML(post.body)}</p>
          <p class="text-xs text-slate-500 mt-2">Publicación nº ${post.id}</p>
        </div>
      `;
    })
    .catch(error => {
      console.error('[Taller 5] ⏰ GANÓ EL TIMEOUT:', error.message);
      container.innerHTML = `
        <div class="p-4 bg-amber-950/30 border border-amber-800/60 rounded-lg">
          <p class="text-amber-400 font-bold mb-2">⏰ ¡Ganó el timeout!</p>
          <p class="text-slate-300 text-sm">${sanitizeHTML(error.message)}</p>
          <p class="text-xs text-slate-500 mt-2">💡 Si aumentas el tiempo del temporizador (reto: 1s, 3s, 5s), verás que a veces gana la API.</p>
        </div>
      `;
    });
}

// ================================================================
// TALLER 6 — Promise.any() (El primer éxito)
// ================================================================

function loadAnyResult() {
  const container = document.getElementById('any-result');
  if (!container) return;

  showLoading('any-result', '🔎 Buscando la primera publicación con éxito de 3 peticiones...');
  console.log('[Taller 6] ⏳ Probando 3 peticiones');

  const requests = [
    fetch(`${API}/posts/1`).then(r => { if (!r.ok) throw new Error('post 1 falló'); return r.json(); }),
    fetch(`${API}/posts/2`).then(r => { if (!r.ok) throw new Error('post 2 falló'); return r.json(); }),
    fetch(`${API}/posts/999`).then(r => { if (!r.ok) throw new Error('post 999 falló (no existe)'); return r.json(); })
  ];

  Promise.any(requests)
    .then(firstSucceeded => {
      console.log('[Taller 6] 🥇 Primer éxito:', firstSucceeded);
      container.innerHTML = `
        <div class="p-4 bg-cyan-950/30 border border-cyan-800/60 rounded-lg">
          <p class="text-cyan-400 font-bold mb-2">🥇 Primer resultado exitoso (Promise.any)</p>
          <p class="text-xs text-slate-500 mb-2">Aunque una de las 3 peticiones falló, no importa: lo que cuenta es el primer ÉXITO.</p>
          <h3 class="text-white font-bold">Publicación nº ${firstSucceeded.id}: ${sanitizeHTML(firstSucceeded.title)}</h3>
        </div>
      `;
    })
    .catch(error => {
      console.error('[Taller 6] ❌ Todas fallaron:', error);
      container.innerHTML = `
        <div class="p-4 bg-red-950/30 border border-red-800/60 rounded-lg">
          <p class="text-red-400 font-bold mb-2">❌ Todas las peticiones fallaron</p>
          <p class="text-sm text-slate-300">Promise.any rechaza solo cuando TODAS fallan.</p>
          <p class="text-xs text-slate-500 mt-2">Error: ${sanitizeHTML(error.message)}</p>
        </div>
      `;
    });
}

// ================================================================
// TALLER 7 — LA MÁQUINA DE ESTADOS
// ================================================================

let searchInitialized = false;

const STATE = {
  IDLE: 'idle',
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected'
};

function renderState(statusEl, state, message) {
  if (!statusEl) return;
  statusEl.classList.remove('hidden');
  const styles = {
    [STATE.IDLE]: 'bg-slate-800 text-slate-300',
    [STATE.PENDING]: 'bg-yellow-950/40 border-yellow-800/60 text-yellow-300',
    [STATE.FULFILLED]: 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300',
    [STATE.REJECTED]: 'bg-red-950/40 border-red-800/60 text-red-300'
  };
  statusEl.className = `mb-3 p-3 rounded-lg text-sm font-medium ${styles[state] || ''}`;
  statusEl.innerHTML = message;
}

function setButtonState(btn, btnText, spinner, loading) {
  if (!btn) return;
  btn.disabled = loading;
  if (loading) {
    btn.classList.add('opacity-60');
    if (btnText) btnText.textContent = 'Buscando...';
    if (spinner) spinner.classList.remove('hidden');
  } else {
    btn.classList.remove('opacity-60');
    if (btnText) btnText.textContent = 'Buscar';
    if (spinner) spinner.classList.add('hidden');
  }
}

function initSearchIfNeeded() {
  if (searchInitialized) return;

  const btn = document.getElementById('search-btn');
  const input = document.getElementById('user-id-input');
  const statusEl = document.getElementById('search-status');
  const resultEl = document.getElementById('search-results');

  if (!btn || !input) return;
  searchInitialized = true;

  const btnText = document.getElementById('btn-text');
  const spinner = document.getElementById('btn-spinner');

  async function search() {
    const userId = Number(input.value);
    resultEl.innerHTML = '';

    if (!userId || userId < 1 || userId > 10) {
      renderState(statusEl, STATE.REJECTED, '❌ ERROR: introduce un número válido entre 1 y 10.');
      return;
    }

    setButtonState(btn, btnText, spinner, true);
    renderState(statusEl, STATE.PENDING, '⏳ PENDIENTE: buscando publicaciones del usuario...');

    try {
      const response = await fetch(`${API}/posts?userId=${userId}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const posts = await response.json();

      if (posts.length === 0) throw new Error('No hay publicaciones para ese usuario');

      const AUTHOR = await fetch(`${API}/users/${userId}`).then(r => r.json());

      renderState(statusEl, STATE.FULFILLED, `✅ ENCONTRADO: ${posts.length} publicaciones de ${AUTHOR.name}`);

      resultEl.innerHTML = posts.map(post => `
        <div class="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
          <h4 class="font-semibold text-white text-sm">🍕 ${sanitizeHTML(post.title)}</h4>
          <p class="text-xs text-slate-400 mt-1">${sanitizeHTML(post.body.substring(0, 120))}...</p>
          <span class="inline-block mt-2 text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300">Publicación nº ${post.id}</span>
        </div>
      `).join('');
    } catch (error) {
      console.error('[Taller 7] ❌ REJECTED:', error.message);
      renderState(statusEl, STATE.REJECTED, `❌ ERROR: ${sanitizeHTML(error.message)}`);
    } finally {
      setButtonState(btn, btnText, spinner, false);
    }
  }

  btn.addEventListener('click', search);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') search(); });
}

// ================================================================
// TALLER 8 — ASYNC Y AWAIT
// ================================================================

let asyncSearchInitialized = false;

async function fetchPostsByUserId(userId) {
  console.log(`[Taller 8] ⏳ Solicitando posts del usuario ${userId} con async/await`);
  const response = await fetch(`${API}/posts?userId=${userId}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const posts = await response.json();
  return posts;
}

function initAsyncSearchIfNeeded() {
  if (asyncSearchInitialized) return;

  const btn = document.getElementById('async-btn');
  const input = document.getElementById('async-user-id');
  const resultsEl = document.getElementById('async-results');

  if (!btn || !input) return;
  asyncSearchInitialized = true;

  btn.addEventListener('click', async () => {
    const userId = Number(input.value);
    resultsEl.innerHTML = '<p class="text-yellow-400">⏳ Cargando...</p>';

    if (!userId || userId < 1 || userId > 10) {
      resultsEl.innerHTML = '<p class="text-red-400">❌ Número inválido. Escribe un número entre 1 y 10.</p>';
      return;
    }

    try {
      const posts = await fetchPostsByUserId(userId);
      console.log(`[Taller 8] ✅ Recibimos ${posts.length} posts`);
      if (posts.length === 0) {
        resultsEl.innerHTML = '<p class="text-slate-400">No hay publicaciones para este usuario.</p>';
        return;
      }
      resultsEl.innerHTML = `
        <p class="text-emerald-400 font-semibold mb-3">✅ Se encontraron ${posts.length} publicaciones (async/await)</p>
        ${posts.map(post => `
          <div class="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
            <h4 class="font-semibold text-white text-sm">${sanitizeHTML(post.title)}</h4>
            <p class="text-xs text-slate-400 mt-1">${sanitizeHTML(post.body.substring(0, 100))}...</p>
          </div>
        `).join('')}
      `;
    } catch (error) {
      console.error('[Taller 8] ❌ Error con async/await:', error.message);
      resultsEl.innerHTML = `<p class="text-red-400">❌ Error: ${sanitizeHTML(error.message)}</p>`;
    }
  });
}

// ================================================================
// TALLER 9 — CÁMARA (getUserMedia)
// ================================================================

let cameraStream = null;
let videoInitialized = false;

function initVideos() {
  if (videoInitialized) return;

  const startBtn = document.getElementById('start-camera');
  const stopBtn = document.getElementById('stop-camera');
  const captureBtn = document.getElementById('capture-photo');
  const video = document.getElementById('video-preview');
  const canvas = document.getElementById('photo-canvas');
  const photoStatus = document.getElementById('photo-status');
  const videoInfo = document.getElementById('video-info');

  if (!startBtn || !video) return;
  videoInitialized = true;

  // Comprobar soporte del navegador
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    if (videoInfo) videoInfo.innerHTML = '<p class="text-red-400">⚠️ Tu navegador no soporta getUserMedia.</p>';
    startBtn.disabled = true;
    startBtn.textContent = 'No soportado';
    return;
  }

  startBtn.addEventListener('click', async () => {
    try {
      console.log('[Taller 9] ⏳ Solicitando permiso de cámara...');
      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });

      video.srcObject = cameraStream;
      await video.play();

      const track = cameraStream.getVideoTracks()[0];
      if (videoInfo) {
        videoInfo.innerHTML = `
          <p class="text-emerald-400">✅ Cámara iniciada</p>
          <p>📷 ${sanitizeHTML(track.label)}</p>
        `;
      }

      startBtn.classList.add('hidden');
      stopBtn.classList.remove('hidden');
      captureBtn.classList.remove('hidden');
      if (photoStatus) photoStatus.textContent = 'Cámara lista. Haz clic en "Capturar foto".';
    } catch (error) {
      console.error('[Taller 9] ❌ Error de cámara:', error);
      if (photoStatus) {
        photoStatus.innerHTML = `<span class="text-red-400">❌ No pudimos acceder a la cámara: ${sanitizeHTML(error.message)}</span>`;
      }
      if (videoInfo) {
        videoInfo.innerHTML = '<p class="text-red-400">Permiso denegado o cámara no disponible (¡por eso el navegador pide permiso!).</p>';
      }
    }
  });

  stopBtn.addEventListener('click', () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      cameraStream = null;
    }
    video.srcObject = null;
    startBtn.classList.remove('hidden');
    stopBtn.classList.add('hidden');
    captureBtn.classList.add('hidden');
    if (photoStatus) photoStatus.textContent = 'Cámara detenida.';
    if (videoInfo) videoInfo.innerHTML = '<p class="text-slate-400">Cámara apagada (liberamos el recurso).</p>';
  });

  captureBtn.addEventListener('click', () => {
    if (!cameraStream) return;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.classList.remove('hidden');
    if (photoStatus) photoStatus.textContent = '📸 ¡Foto capturada!';
    console.log('[Taller 9] 📸 Foto capturada en el canvas');
  });
}

// ================================================================
// RETO FINAL — SUPER EXPLORADOR DE APIS
// ================================================================

let retoFinalInitialized = false;

function initRetoFinalIfNeeded() {
  if (retoFinalInitialized) return;

  const btnPost = document.getElementById('reto-post');
  const btnUsers = document.getElementById('reto-users');
  const btnCombined = document.getElementById('reto-combined');
  const btnAllSettled = document.getElementById('reto-allsettled');
  const btnRace = document.getElementById('reto-race');
  const btnAny = document.getElementById('reto-any');
  const btnSearch = document.getElementById('reto-search');

  if (!btnPost) return;
  retoFinalInitialized = true;

  btnPost.addEventListener('click', async () => {
    const el = document.getElementById('reto-post-result');
    el.textContent = 'Cargando...';
    try {
      const res = await fetch(`${API}/posts/1`);
      const post = await res.json();
      el.innerHTML = `<strong>Publicación nº ${post.id}:</strong> ${sanitizeHTML(post.title)}`;
    } catch (e) { el.textContent = 'Error: ' + e.message; }
  });

  btnUsers.addEventListener('click', async () => {
    const el = document.getElementById('reto-users-result');
    el.textContent = 'Cargando...';
    try {
      const res = await fetch(`${API}/users?_limit=5`);
      const users = await res.json();
      el.innerHTML = users.map(u => `<div>• ${sanitizeHTML(u.name)} (@${sanitizeHTML(u.username)})</div>`).join('');
    } catch (e) { el.textContent = 'Error: ' + e.message; }
  });

  btnCombined.addEventListener('click', async () => {
    const el = document.getElementById('reto-combined-result');
    el.textContent = 'Cargando...';
    try {
      const [post, user, comments] = await Promise.all([
        fetch(`${API}/posts/1`).then(r => r.json()),
        fetch(`${API}/users/1`).then(r => r.json()),
        fetch(`${API}/posts/1/comments`).then(r => r.json())
      ]);
      el.innerHTML = `
        <strong>${sanitizeHTML(post.title)}</strong><br>
        <span class="text-emerald-400">👨‍🍳 ${sanitizeHTML(user.name)}</span><br>
        <span class="text-slate-400">💬 ${comments.length} comentarios</span>
      `;
    } catch (e) { el.textContent = 'Error: ' + e.message; }
  });

  btnAllSettled.addEventListener('click', async () => {
    const el = document.getElementById('reto-allsettled-result');
    el.textContent = 'Cargando...';
    const ids = [1, 5, 999, 10, 1234];
    const results = await Promise.allSettled(ids.map(id =>
      fetch(`${API}/posts/${id}`).then(r => { if (!r.ok) throw new Error('no existe'); return r.json(); })
    ));
    const ok = results.filter(r => r.status === 'fulfilled').length;
    const fail = results.filter(r => r.status === 'rejected').length;
    el.innerHTML = `<span class="text-emerald-400">✅ Éxito: ${ok}</span> · <span class="text-red-400">❌ Fallos: ${fail}</span>`;
  });

  btnRace.addEventListener('click', async () => {
    const el = document.getElementById('reto-race-result');
    el.textContent = '🏁 Carrera en curso...';
    const api = fetch(`${API}/posts/1`).then(r => r.json());
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('⏰ timeout')), 2000));
    try {
      const post = await Promise.race([api, timeout]);
      el.innerHTML = `<span class="text-emerald-400">🏆 Ganó la API:</span> ${sanitizeHTML(post.title)}`;
    } catch (e) {
      el.innerHTML = `<span class="text-amber-400">⏰ Ganó el timeout</span>`;
    }
  });

  btnAny.addEventListener('click', async () => {
    const el = document.getElementById('reto-any-result');
    el.textContent = 'Buscando primer éxito...';
    try {
      const post = await Promise.any([
        fetch(`${API}/posts/2`).then(r => r.json()),
        fetch(`${API}/posts/3`).then(r => r.json()),
        fetch(`${API}/posts/999`).then(r => { if (!r.ok) throw new Error('no'); return r.json(); })
      ]);
      el.innerHTML = `<span class="text-cyan-400">🥇 Primer éxito:</span> ${sanitizeHTML(post.title)}`;
    } catch (e) {
      el.innerHTML = '<span class="text-red-400">❌ Todas fallaron</span>';
    }
  });

  btnSearch.addEventListener('click', async () => {
    const el = document.getElementById('reto-search-result');
    el.textContent = 'Buscando...';
    try {
      const posts = await fetch(`${API}/posts?userId=2`).then(r => r.json());
      el.innerHTML = `<span class="text-emerald-400">✅ ${posts.length} publicaciones:</span> ` + posts.slice(0, 3).map(p => sanitizeHTML(p.title)).join(' · ');
    } catch (e) { el.textContent = 'Error: ' + e.message; }
  });
}

// ================================================================
// REPORTES
// ================================================================

let currentReportData = null;

function initReports() {
  const genUsersBtn = document.getElementById('gen-report-users');
  const genPostsBtn = document.getElementById('gen-report-posts');
  const genCombinedBtn = document.getElementById('gen-report-combined');
  const downloadBtn = document.getElementById('download-report');
  const printBtn = document.getElementById('print-report');
  const previewEl = document.getElementById('report-preview');

  if (!genUsersBtn) return;

  function renderReport(title, lines) {
    const timestamp = new Date().toISOString();
    const report = [
      `========================================`,
      `  REPORTE: ${title}`,
      `  Generado: ${timestamp}`,
      `========================================`,
      ``,
      ...lines,
      ``,
      `========================================`,
      `  Fin del reporte`,
      `========================================`
    ].join('\n');

    currentReportData = report;
    previewEl.textContent = report;
    downloadBtn.classList.remove('hidden');
    printBtn.classList.remove('hidden');
  }

  genUsersBtn.addEventListener('click', async () => {
    try {
      const response = await fetch(`${API}/users?_limit=5`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const users = await response.json();

      const lines = users.map((u, i) => [
        `Usuario #${i + 1}:`,
        `  Nombre:     ${u.name}`,
        `  Usuario:    ${u.username}`,
        `  Email:      ${u.email}`,
        `  Teléfono:   ${u.phone}`,
        `  Empresa:    ${u.company.name}`,
        `  Ciudad:     ${u.address.city}`,
        `  Sitio web:  ${u.website}`,
        ``
      ].join('\n')).join('');

      renderReport('Reporte de Usuarios', lines.split('\n'));
    } catch (error) {
      previewEl.innerHTML = `<p class="text-red-400">Error al generar reporte: ${sanitizeHTML(error.message)}</p>`;
    }
  });

  genPostsBtn.addEventListener('click', async () => {
    try {
      const response = await fetch(`${API}/posts?_limit=10`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const posts = await response.json();

      const lines = posts.map(p => [
        `Publicación nº ${p.id}:`,
        `  Título: ${p.title}`,
        `  Contenido: ${p.body.substring(0, 80)}...`,
        `  Autor nº: ${p.userId}`,
        ``
      ].join('\n')).join('');

      renderReport('Reporte de Posts', lines.split('\n'));
    } catch (error) {
      previewEl.innerHTML = `<p class="text-red-400">Error al generar reporte: ${sanitizeHTML(error.message)}</p>`;
    }
  });

  genCombinedBtn.addEventListener('click', async () => {
    try {
      const [usersRes, postsRes] = await Promise.all([
        fetch(`${API}/users?_limit=5`),
        fetch(`${API}/posts?_limit=5`)
      ]);
      if (!usersRes.ok || !postsRes.ok) throw new Error('Error al obtener datos');

      const users = await usersRes.json();
      const posts = await postsRes.json();

      const lines = [
        `=== REPORTE CONJUNTO ===`,
        ``,
        `--- Usuarios (${users.length}) ---`,
        ...users.map(u => `  ${u.name} (${u.username}) - ${u.email}`),
        ``,
        `--- Publicaciones (${posts.length}) ---`,
        ...posts.map(p => `  Publicación nº ${p.id}: "${p.title.substring(0, 50)}..." (Usuario ${p.userId})`),
        ``,
        `--- Resumen ---`,
        `  Total de usuarios: ${users.length}`,
        `  Total de publicaciones: ${posts.length}`,
        `  Publicaciones por usuario (promedio): ${(posts.length / users.length).toFixed(1)}`
      ];

      renderReport('Reporte Combinado', lines);
    } catch (error) {
      previewEl.innerHTML = `<p class="text-red-400">Error al generar reporte: ${sanitizeHTML(error.message)}</p>`;
    }
  });

  downloadBtn.addEventListener('click', () => {
    if (!currentReportData) return;
    const blob = new Blob([currentReportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  printBtn.addEventListener('click', () => {
    window.print();
  });
}

// ================================================================
// GEOLOCALIZACION
// ================================================================

function initGeolocation() {
  const getLocationBtn = document.getElementById('get-location');
  const geoInfo = document.getElementById('geo-info');
  const geoError = document.getElementById('geo-error');
  const mapFrame = document.getElementById('map-frame');

  if (!getLocationBtn) return;

  getLocationBtn.addEventListener('click', async () => {
    geoError.classList.add('hidden');
    geoInfo.innerHTML = `<p class="text-yellow-400">Obteniendo ubicación...</p>`;

    // La geolocalización del navegador SOLO funciona en un
    // contexto seguro (https o http://localhost). Si no lo es,
    // ni siquiera intentamos y avisamos con una solución clara.
    const seguro = window.isSecureContext;
    if (!seguro) {
      geoInfo.innerHTML = '';
      geoError.classList.remove('hidden');
      geoError.textContent = '❌ La geolocalización necesita un contexto seguro. Accede por http://localhost:3000 (o activa HTTPS) y recarga la página. Si la abres desde otro dispositivo por IP, el navegador la bloquea.';
      return;
    }

    if (!navigator.geolocation) {
      geoInfo.innerHTML = '';
      geoError.classList.remove('hidden');
      geoError.textContent = '❌ Tu navegador no soporta geolocalización.';
      return;
    }

    if (navigator.permissions && navigator.permissions.query) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        if (permission.state === 'denied') {
          geoInfo.innerHTML = '';
          geoError.classList.remove('hidden');
          geoError.textContent = '❌ Permiso de ubicación denegado. Haz clic en el ícono de candado 🔒 en la barra de direcciones, selecciona "Información del sitio", luego activa "Ubicación" y recarga la página.';
          return;
        }
      } catch (e) {
        // Si el navegador no soporta permissions.query, continuamos
      }
    }

    // Pedimos la posición. Usamos enableHighAccuracy:false para que el
    // navegador responda rápido (por GPS o por red) y no expire.
    const obtenerPosicion = (options) =>
      new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });

    const opciones = {
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 0
    };

    let position;
    try {
      position = await obtenerPosicion(opciones);
    } catch (error) {
      // Si expiró con precisión estándar, reintentamos una vez
      // con un tiempo más generoso antes de rendirnos.
      if (error.code === 3) {
        try {
          position = await obtenerPosicion({ enableHighAccuracy: false, timeout: 30000, maximumAge: 0 });
        } catch (segundoError) {
          geoInfo.innerHTML = '';
          geoError.classList.remove('hidden');
          geoError.textContent = '❌ La petición expiró. Verifica que el navegador tenga permiso de ubicación y que la red ofrezca posición, luego inténtalo de nuevo.';
          return;
        }
      } else {
        geoInfo.innerHTML = '';
        geoError.classList.remove('hidden');
        switch (error.code) {
          case 1:
            geoError.textContent = '❌ Permiso de ubicación denegado. Haz clic en el candado 🔒, activa "Ubicación" y recarga.';
            break;
          case 2:
            geoError.textContent = '❌ Ubicación no disponible. Verifica GPS o conexión a red.';
            break;
          default:
            geoError.textContent = `❌ Error desconocido: ${error.message}`;
        }
        return;
      }
    }

    const { latitude, longitude, accuracy } = position.coords;
    const { timestamp } = position;

    geoInfo.innerHTML = `
      <div class="space-y-1">
        <p><strong>Latitud:</strong> <span class="text-emerald-400">${latitude.toFixed(6)}</span></p>
        <p><strong>Longitud:</strong> <span class="text-emerald-400">${longitude.toFixed(6)}</span></p>
        <p><strong>Precisión:</strong> ±${accuracy.toFixed(1)} metros</p>
        <p><strong>Timestamp:</strong> ${new Date(timestamp).toLocaleString()}</p>
      </div>
    `;

    // Mapa gratuito de OpenStreetMap (API pública y sin clave)
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`;
    mapFrame.src = mapUrl;
  });
}

// ================================================================
// CONTROLES DE TALLERES (botones para retos 1 y 2)
// ================================================================

let workshopControlsInitialized = false;

function initWorkshopControls() {
  if (workshopControlsInitialized) return;

  const loadPostBtn = document.getElementById('load-post-btn');
  const postIdInput = document.getElementById('single-post-id');
  const loadUsersBtn = document.getElementById('load-users-btn');
  const usersLimitInput = document.getElementById('users-limit');

  if (loadPostBtn && postIdInput) {
    loadPostBtn.addEventListener('click', () => loadSinglePost(Number(postIdInput.value) || 1));
    postIdInput.addEventListener('keydown', e => { if (e.key === 'Enter') loadSinglePost(Number(postIdInput.value) || 1); });
  }

  if (loadUsersBtn && usersLimitInput) {
    loadUsersBtn.addEventListener('click', () => loadUsersList(Number(usersLimitInput.value) || 5));
    usersLimitInput.addEventListener('keydown', e => { if (e.key === 'Enter') loadUsersList(Number(usersLimitInput.value) || 5); });
  }

  workshopControlsInitialized = true;
}

// ================================================================
// SIDEBAR Y NAVEGACION
// ================================================================

function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const toggleBtn = document.getElementById('sidebar-toggle');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.querySelectorAll('.nav-link');
  const mainContent = document.getElementById('main-content');

  function isMobile() {
    return window.matchMedia('(max-width: 1023px)').matches;
  }

  function closeSidebar() {
    sidebar.classList.add('-translate-x-full');
    if (isMobile()) {
      overlay.classList.add('hidden');
    }
    if (!isMobile() && mainContent) {
      mainContent.classList.remove('ml-64');
    }
  }

  function openSidebar() {
    sidebar.classList.remove('-translate-x-full');
    if (isMobile()) {
      overlay.classList.remove('hidden');
    }
    if (!isMobile() && mainContent) {
      mainContent.classList.add('ml-64');
    }
  }

  function handleBreakpointChange() {
    if (isMobile()) {
      closeSidebar();
    } else {
      sidebar.classList.remove('-translate-x-full');
      overlay.classList.add('hidden');
      if (mainContent) {
        mainContent.classList.add('ml-64');
      }
    }
  }

  const mql = window.matchMedia('(max-width: 1023px)');

  function handleBreakpointChangeDebounced() {
    clearTimeout(handleBreakpointChange.timer);
    handleBreakpointChange.timer = setTimeout(handleBreakpointChange, 50);
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = !sidebar.classList.contains('-translate-x-full');
      if (isOpen) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', closeSidebar);
  }

  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      navigateTo(page);
      if (isMobile()) {
        closeSidebar();
      }
    });
  });

  window.addEventListener('hashchange', handleRoute);
  mql.addEventListener('change', handleBreakpointChangeDebounced);
  handleBreakpointChange();
}

// ================================================================
// INICIALIZACION
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('[App] DOM listo. Iniciando SPA...');

  initSidebar();
  initVideos();
  initReports();
  initGeolocation();
  initSearchIfNeeded();
  initAsyncSearchIfNeeded();
  initRetoFinalIfNeeded();
  initWorkshopControls();
  renderConceptCode();

  handleRoute();
});