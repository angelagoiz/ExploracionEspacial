# Clima M7 – Exploración Espacial (Usuarios, Login y Estado Global)

## Sistema de usuarios

Cada usuario almacena en Vuex:
- `nombre`, `email`
- `unidad`: preferencia de temperatura (`C`, `F` o `K`)
- `favoritos`: lista de IDs de planetas guardados
- `isAuthenticated`: flag de sesión activa

Los datos se validan contra un arreglo de usuarios simulados (sin backend).

## Rutas

| Ruta | Descripción | Protegida |
|------|-------------|-----------|
| `/` | Home con grilla de planetas | No |
| `/planeta/:id` | Detalle de un planeta | No |
| `/login` | Formulario de inicio de sesión | No |
| `/favoritos` | Planetas favoritos del usuario | Sí |
| `/preferencias` | Unidad de temperatura | Sí |

Las rutas protegidas redirigen a `/login` si no hay sesión (navigation guard en el router).

## Credenciales de prueba

- ana@espacio.com / 1234 — unidad: °C, favoritos: Tierra, Marte
- pedro@espacio.com / 1234 — unidad: K, favoritos: Júpiter, Saturno

## Ejecutar el proyecto

```bash
npm install
npm run dev
```

## Repositorio
https://github.com/angelagoiz/Clima-Planetas-M7
