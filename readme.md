Endpoints - API de Numerología

Base URL local: `http://localhost:3000`
Base URL producción: `https://numerologia-api-restful.onrender.com`

Todas las peticiones y respuestas usan formato JSON. Los endpoints marcados como protegidos requieren el header:

```
Authorization: Bearer <token>
```

---

### Autenticación (`/api/v1/auth`)

# POST /api/v1/auth/register
Crea un nuevo usuario en el sistema.

**Body:**
```json
{
  "nombre_completo": "Juan Perez",
  "email": "juan@test.com",
  "password": "12345678",
  "fecha_nacimiento": "1998-05-14"
}
```

**Respuesta (201):** datos del usuario creado (sin contraseña).

**Protegido:** No

---

# POST /api/v1/auth/login
Autentica a un usuario existente y devuelve un token JWT.

**Body:**
```json
{
  "email": "juan@test.com",
  "password": "12345678"
}
```

**Respuesta (200):** token JWT y datos básicos del usuario.

**Protegido:** No

---

### Usuarios (`/api/v1/users`)

# GET /api/v1/users/me
Devuelve los datos del usuario autenticado.

**Respuesta (200):** información del usuario (sin contraseña).

**Protegido:** Sí

---

# PUT /api/v1/users/me
Actualiza datos del usuario autenticado (nombre, email, fecha de nacimiento).

**Body (campos opcionales, al menos uno requerido):**
```json
{
  "nombre_completo": "Juan Perez Actualizado",
  "email": "nuevo@test.com",
  "fecha_nacimiento": "1998-05-14"
}
```

**Respuesta (200):** usuario actualizado.

**Protegido:** Sí

---

# PUT /api/v1/users/me/password
Actualiza la contraseña del usuario autenticado.

**Body:**
```json
{
  "passwordActual": "12345678",
  "passwordNuevo": "nuevaPassword123"
}
```

**Respuesta (200):** mensaje de confirmación.

**Protegido:** Sí

---

### Gestión de Perfil Numérico (`/api/v1/numerology`)

# POST /api/v1/numerology/calculate
Calcula los números centrales (Camino de Vida, Expresión, Alma) del usuario autenticado a partir de su nombre completo y fecha de nacimiento. Guarda o actualiza el resultado en la colección NumerologyProfiles.

**Body:** No requiere body (usa los datos ya registrados del usuario).

**Respuesta (200):** perfil numerológico calculado.

**Protegido:** Sí

---

# GET /api/v1/numerology/profile
Retorna el perfil numerológico ya calculado del usuario autenticado.

**Respuesta (200):** perfil numerológico existente.

**Respuesta (404):** si el usuario aún no ha calculado su perfil.

**Protegido:** Sí

---

### Lecturas e Inteligencia Artificial (`/api/v1/readings`)

# POST /api/v1/readings/generate
Construye un prompt con el perfil numerológico del usuario, lo envía a la API de Gemini y guarda la respuesta generada en la colección Readings.

**Body:**
```json
{
  "tipo": "general"
}
```

Valores válidos para `tipo`: `diaria`, `general`, `anual`. Si no se envía, por defecto es `general`.

**Respuesta (201):** lectura generada, incluyendo el texto interpretativo de la IA.

**Protegido:** Sí

---

# GET /api/v1/readings/history
Obtiene el historial de lecturas generadas previamente por el usuario autenticado.

**Query params opcionales:**
- `tipo`: filtra por tipo de lectura (`diaria`, `general`, `anual`)
- `page`: número de página (por defecto 1)
- `limit`: cantidad de resultados por página (por defecto 10)

**Respuesta (200):** total de resultados, página actual, total de páginas y lista de lecturas.

**Protegido:** Sí

---

### Compatibilidad (`/api/v1/compatibility`)

# POST /api/v1/compatibility/check
Recibe el ID de otro usuario, compara ambos perfiles numerológicos, calcula un puntaje de compatibilidad y pide a Gemini un análisis interpretativo de la relación. Guarda el resultado en la colección CompatibilityMatches.

**Body:**
```json
{
  "otroUsuarioId": "666f1f77bcf86cd799439011"
}
```

**Respuesta (201):** puntaje de compatibilidad e interpretación generada por la IA.

**Requisitos previos:** ambos usuarios (el autenticado y el indicado en `otroUsuarioId`) deben tener un perfil numerológico calculado previamente con `POST /api/v1/numerology/calculate`.

**Protegido:** Sí

---

### Salud del servicio

# GET /api/health
Endpoint de verificación simple para confirmar que la API está en funcionamiento.

**Respuesta (200):**
```json
{
  "status": "ok",
  "mensaje": "API de numerología funcionando"
}
```

**Protegido:** No