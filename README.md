# Llantera Gallardo E-Commerce

Sitio de comercio electrónico para **Llantera Gallardo**, desarrollado con TanStack Start (Vite + React Router SSR) y Tailwind CSS v4.

## Desarrollo local

Requiere Node.js y Bun.

```sh
git clone <url-del-repositorio>
cd <nombre-del-repositorio>
bun install
bun run dev
```

## Publicar en Cloudflare Workers

Inicia sesión con Wrangler (`bunx wrangler login`) y publica el Worker:

```sh
bun run deploy
```

El comando compila la aplicación y la despliega usando la configuración de `wrangler.toml`. Para revisar el build localmente antes de publicar, ejecuta `bun run preview`. Los tipos para bindings de Cloudflare se generan con `bun run cf-typegen`.
