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
