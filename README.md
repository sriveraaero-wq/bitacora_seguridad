# Bitácora de Seguridad

App web para que supervisores registren hallazgos y condiciones inseguras, con inicio de sesión por correo/contraseña asignado por un administrador. Pensada para usarse desde teléfono, tablet o laptop.

Como GitHub Pages solo sirve archivos estáticos (sin backend propio), esta versión guarda los datos en **Firebase Firestore** (base de datos en la nube de Google, capa gratuita). Necesitas crear tu propio proyecto de Firebase antes de publicar el sitio — toma unos 10 minutos y no requiere tarjeta de crédito.

## Archivos de este repositorio

- `index.html` — la aplicación completa.
- `firebase-config.js` — aquí pegas las claves de TU proyecto de Firebase (edítalo antes de publicar).
- `firestore.rules` — reglas de seguridad para pegar en la consola de Firebase.
- `manifest.json` — hace que el sitio se pueda instalar como app (PWA).
- `sw.js` — service worker: cachea el "cascarón" de la app para que cargue rápido y algo funcione sin conexión.
- `icons/` — íconos de la app para la pantalla de inicio del teléfono/tablet.
- `README.md` — esta guía.

## Paso 1: crear el proyecto de Firebase

1. Ve a [console.firebase.google.com](https://console.firebase.google.com) e inicia sesión con una cuenta de Google.
2. Clic en **"Agregar proyecto"**, ponle un nombre (ej. "bitacora-seguridad") y sigue el asistente (puedes desactivar Google Analytics, no se necesita).
3. Dentro del proyecto, ve a **Compilación → Firestore Database → Crear base de datos**. Elige la ubicación más cercana a tu equipo y arranca en **modo de producción**.
4. Ve a **Reglas** (dentro de Firestore) y reemplaza el contenido por el de `firestore.rules` de este repositorio. Clic en **Publicar**.
5. Ve a **⚙️ Configuración del proyecto** (ícono de engrane, arriba a la izquierda) → pestaña **General** → sección "Tus apps" → clic en el ícono **`</>`** (Web) para registrar una app web. Ponle un apodo y clic en **Registrar app**.
6. Firebase te mostrará un bloque `firebaseConfig = { apiKey: ..., authDomain: ..., ... }`. Copia esos valores.

## Paso 2: configurar el proyecto

Abre `firebase-config.js` en este repositorio y reemplaza los valores de ejemplo por los que copiaste en el paso anterior. Guarda el archivo.

> Estos valores no son secretos — Firebase los expone intencionalmente en el navegador. La protección real de tus datos depende de las reglas de Firestore, no de ocultar esta configuración.

## Paso 3: subir a GitHub y publicar con GitHub Pages

1. Crea un repositorio nuevo en GitHub y sube estos archivos (`index.html`, `firebase-config.js`, `firestore.rules`, `README.md`) a la raíz del repositorio.
2. En el repositorio, ve a **Settings → Pages**.
3. En "Source" elige **Deploy from a branch**, rama `main` (o `master`), carpeta `/ (root)`. Guarda.
4. Espera uno o dos minutos y GitHub te dará un enlace tipo `https://tu-usuario.github.io/tu-repositorio/`. Ese es el enlace que usará tu equipo.

## Paso 4: primer uso

1. Abre el enlace publicado. Como es la primera vez, verás **"Configurar acceso"** — define ahí la contraseña de administrador (guárdala en un lugar seguro; es la tuya).
2. Inicia sesión con la pestaña **Administrador** y esa contraseña.
3. Clic en **"Gestionar usuarios"** para dar de alta a cada supervisor: nombre, correo y una contraseña que tú le asignes. Compártesela por un medio seguro (no por este mismo README ni por chat abierto).
4. Cada supervisor entra desde el mismo enlace, pestaña **Supervisor**, con el correo y la contraseña que le diste. Su nombre queda asignado automáticamente en cada reporte que registre.

## Instalar como app (PWA)

Con `manifest.json` y `sw.js` en su lugar, el sitio se puede "instalar" para que se abra como una app propia, con su ícono, sin la barra del navegador:

- **Android (Chrome):** al abrir el enlace, aparece un aviso para "Instalar app" o "Agregar a pantalla de inicio". También se puede hacer manualmente desde el menú ⋮ → "Instalar app".
- **iPhone/iPad (Safari):** Safari no muestra un aviso automático. Cada persona debe abrir el enlace, tocar el ícono de compartir (□↑) y elegir **"Agregar a pantalla de inicio"**.
- **Laptop (Chrome/Edge):** aparece un ícono de instalación (⊕) en la barra de direcciones, o desde el menú ⋮ → "Instalar Bitácora de Seguridad...".

Una vez instalada, el ícono queda en la pantalla de inicio o el launcher como cualquier otra app. Ten en cuenta que **los datos siguen necesitando conexión a internet** (viven en Firestore); lo que el modo "app" mejora es la velocidad de apertura y que no dependa de tener el navegador abierto con pestañas.

## Limitaciones importantes de seguridad

Esta app **no tiene un servidor propio ni autenticación real de Firebase** — el inicio de sesión es una verificación hecha en el navegador contra una lista de usuarios guardada en Firestore. Esto es suficiente para identificar quién hizo cada reporte y evitar errores accidentales de un equipo interno, pero **no es seguridad de nivel empresarial**:

- Las reglas de `firestore.rules` permiten lectura y escritura sin verificación de identidad real (Firestore no distingue entre tu app y cualquier otra persona que use las mismas credenciales de proyecto). Alguien con conocimientos técnicos que inspeccione el sitio publicado podría leer o modificar la base de datos directamente, sin pasar por la pantalla de login.
- Las contraseñas se guardan hasheadas (no en texto plano), pero sin "sal" (salt) ni límite de intentos.
- No hay "recordar sesión": cada quien inicia sesión de nuevo cada vez que abre la app.

Para un uso interno de bajo riesgo (identificación de autoría, no información confidencial o legal sensible) esto es razonable. Si más adelante necesitas protección más fuerte, el siguiente paso natural es migrar a **Firebase Authentication** real con reglas de Firestore basadas en `request.auth`, lo cual requiere más configuración (incluyendo, para que el administrador pueda asignar contraseñas directamente, una función en la nube con permisos de administrador). Puedo ayudarte con eso si lo necesitas.

## Costos

Firestore tiene una capa gratuita amplia (50,000 lecturas y 20,000 escrituras al día, aprox.) que es más que suficiente para un equipo de supervisores haciendo reportes diarios. GitHub Pages es gratuito. No deberías pagar nada con un uso normal.
