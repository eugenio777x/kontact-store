# KONTACT — Setup & Deployment

## 1. Instalar dependencias

```bash
npm install
```

## 2. Supabase

1. Crea proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor** y pega todo el contenido de `supabase/schema.sql`
3. Copia las keys desde **Settings → API**

## 3. Variables de entorno

```bash
cp .env.example .env.local
```

Llena todos los valores en `.env.local`

## 4. Stripe

1. Crea cuenta en [stripe.com](https://stripe.com)
2. Copia las keys desde **Developers → API keys**
3. Para webhooks en producción:
   - Ve a **Developers → Webhooks**
   - URL: `https://tu-dominio.com/api/webhooks/stripe`
   - Evento: `checkout.session.completed`
   - Copia el **Webhook Secret** → `STRIPE_WEBHOOK_SECRET`

Para desarrollo local:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## 5. Tipografía Bebas Neue

Descarga `BebasNeue-Regular.ttf` y colócalo en:
```
public/fonts/BebasNeue-Regular.ttf
```

O usa Google Fonts agregando en `layout.tsx`:
```ts
import { Bebas_Neue } from 'next/font/google'
const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' })
```

## 6. Logo

Coloca `logo.png` en `/public/logo.png`

## 7. Desarrollo local

```bash
npm run dev
# → http://localhost:3000
# → http://localhost:3000/admin
```

## 8. Crear admin en Supabase

1. Ve a **Authentication → Users**
2. Click **Add user**
3. Ingresa email y contraseña del admin
4. Usa esas credenciales en `/admin/login`

## 9. Deploy en Vercel

```bash
npm i -g vercel
vercel
```

O conecta el repositorio desde [vercel.com](https://vercel.com) y agrega las variables de entorno.

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx              # Home
│   ├── shop/                 # Tienda + filtros
│   ├── product/[slug]/       # Página de producto
│   ├── checkout/             # Checkout
│   ├── order/success|cancel/ # Resultado de pago
│   ├── admin/                # Dashboard protegido
│   │   ├── login/
│   │   ├── products/
│   │   └── orders/
│   └── api/
│       ├── stripe/checkout/  # Crea sesión Stripe
│       └── webhooks/stripe/  # Recibe eventos Stripe
├── components/
│   ├── layout/Navbar.tsx
│   ├── cart/CartDrawer.tsx
│   ├── product/ProductCard.tsx
│   └── admin/AdminSidebar.tsx
├── lib/
│   ├── supabase/client.ts
│   ├── supabase/server.ts
│   ├── stripe.ts
│   ├── utils.ts
│   └── actions/              # Server Actions
│       ├── products.ts
│       └── orders.ts
├── store/cart.ts             # Zustand (persistente)
├── types/index.ts
└── middleware.ts             # Auth guard /admin
```
