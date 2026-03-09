# FitSync Pro - Registro de Errores y Soluciones (Troubleshooting)

Este documento registra los errores técnicos recurrentes encontrados durante el desarrollo del proyecto, sus causas raíz y los pasos exactos para resolverlos. **Consultar este archivo antes de realizar depuraciones profundas.**

---

## 1. Errores de Conexión a Base de Datos (Prisma/Supabase)

### Error: `FATAL: Tenant or user not found` o `Internal Server Error (500)` en endpoints de BD.
- **Causa:** El puerto directo de Supabase (`5432`) a veces falla por resolución de IPv6 o restricciones de DNS en el entorno local, o el *connection pooler* ha cambiado.
- **Solución:** 
  1. Asegurarse de que el `DATABASE_URL` en `apps/api/.env` use el puerto `6543` con los parámetros `?pgbouncer=true&connection_limit=1`.
  2. Verificar que el usuario en el string de conexión sea el correcto (usualmente `postgres.[PROYECTO_REF]`).
  3. Si persiste, intentar alternar temporalmente al puerto `5432` solo para comandos de `npx prisma db push`, pero volver a `6543` para el servidor NestJS.

### Error: `PrismaClientInitializationError` (Tabla no encontrada)
- **Causa:** Se han añadido modelos al `schema.prisma` pero no se ha sincronizado la base de datos real o no se han regenerado los tipos de TypeScript.
- **Solución:**
  1. Ejecutar `npx prisma db push` desde `apps/api` (usar `--accept-data-loss` si se está seguro de los cambios).
  2. Ejecutar **siempre** `npx prisma generate` después del push para actualizar el cliente local.
  3. Reiniciar el servidor del backend.

---

## 2. Errores de Servidor y Puertos (EADDRINUSE)

### Error: `Error: listen EADDRINUSE: address already in use 0.0.0.0:3000`
- **Causa:** Una instancia anterior del backend quedó colgada en segundo plano o el proceso no se cerró correctamente al fallar.
- **Solución (Windows PowerShell):**
  ```powershell
  $port = 3000
  $processId = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue).OwningProcess
  if ($processId) { Stop-Process -Id $processId -Force }
  ```
  O un comando global: `Get-Process | Where-Object { $_.Name -match "node" } | Stop-Process -Force`.

---

## 3. Errores de Autenticación (Supabase JWT)

### Error: `401 Unauthorized` en llamadas de API desde el Frontend.
- **Causa:** El token enviado en el header `Authorization` ha expirado o el `Refresh Token` de Supabase en el navegador no es válido (Refresh Token Not Found).
- **Solución:**
  1. El usuario debe cerrar sesión y volver a entrar en la web para obtener un nuevo par de tokens.
  2. Verificar en el backend que el `SupabaseAuthGuard` esté configurado y que el `jwt.strategy.ts` extraiga correctamente el `sub` del payload.

---

## 4. Problemas de Registro/Logs del Backend

### Error: Los logs de NestJS no muestran el error detallado (Stack Trace).
- **Causa:** La terminal de desarrollo a veces trunca el output o NestJS intercepta excepciones globales.
- **Solución:**
  1. Redirigir la salida a un archivo para inspección completa: `npm run dev > backend.log 2>&1`.
  2. Usar comandos de lectura de texto plano (`Get-Content`) para evitar errores de codificación (UTF-16LE vs UTF-8).

---

## 5. Errores de Despliegue en Render (Render/Build)

### Error: `Error: Cannot find module '/opt/render/project/src/apps/api/dist/main'` (MODULE_NOT_FOUND)
- **Causa 1:** El comando `nest build` requiere herramientas como `@nestjs/cli` y `typescript`. Si estas se encuentran en `devDependencies`, Render (al estar en modo producción) no las instala y el build falla silenciosamente sin generar la carpeta `/dist`.
- **Causa 2:** Si existen archivos de prueba o scripts `.ts` fuera de la carpeta `src/`, el compilador `tsc` intenta replicar la estructura de carpetas en el output, moviendo el archivo principal a `dist/src/main.js` en lugar de `dist/main.js`.
- **Solución:**
  1. **Mover dependencias de build:** Pasar `@nestjs/cli`, `typescript`, `@types/node`, `@types/express` y `@nestjs/schematics` de `devDependencies` a `dependencies` en `apps/api/package.json`.
  2. **Configurar `postinstall`:** Añadir `"postinstall": "npm run build:api"` en el `package.json` de la raíz para asegurar que la API se compile automáticamente tras instalar paquetes.
  3. **Forzar estructura de salida:** En `apps/api/tsconfig.json`, añadir explicitly:
     ```json
     "include": ["src/**/*"],
     "exclude": ["node_modules", "dist", "**/*spec.ts"]
     ```
     Esto garantiza que `main.js` se genere siempre en la raíz de la carpeta `dist/`.
  4. **Usar `tsc` si NestJS falla:** Si `nest build` sigue fallando localmente sin errores claros, cambiar el script de build a `tsc -p tsconfig.json` para obtener una depuración más transparente.
  5. **El secreto final `.renderignore`**: Render, por defecto, ELIMINA entre la fase de "Build" y la de "Deploy" todos los archivos y carpetas que pertenezcan al `.gitignore` original (como `apps/api/dist/`). Se debe crear un archivo vacío llamado \`.renderignore\` en la raíz del proyecto para sobrescribir esto y que **Render no borre la carpeta `/dist` compilada** tras hacer el script de compilado.

