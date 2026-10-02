# Rafael Brandão Imóveis

Site institucional e catálogo de imóveis. Next.js 16 (App Router) + Neon
(PostgreSQL) + Cloudinary.

## Banco de dados Neon

1. No painel do Neon, crie um projeto PostgreSQL e copie a string em **Connect**.
2. Copie `.env.example` para `.env.local` e preencha `DATABASE_URL`.
3. No SQL Editor do Neon, execute `db/schema.sql`.
4. Defina `ADMIN_PASSWORD` antes de publicar o site — **sem ela o `/admin`
   recusa todos os logins** (não há credencial padrão em código).

## Formulário de contato por Gmail

1. Ative a verificação em duas etapas na conta Google que enviará as mensagens.
2. Em `https://myaccount.google.com/apppasswords`, crie uma senha de app para este site.
3. Copie `.env.example` para `.env.local` e preencha `GMAIL_USER`, `GMAIL_APP_PASSWORD` e `CONTACT_RECEIVER_EMAIL`.
4. Instale as dependências com `npm install` antes de iniciar ou publicar o projeto.

`GMAIL_APP_PASSWORD` deve conter a senha de app de 16 caracteres, sem espaços. Nunca publique `.env.local` nem coloque essa senha em código ou em variáveis prefixadas com `NEXT_PUBLIC_`.

O catálogo e o painel usam `DATABASE_URL` apenas no servidor; a variável não é enviada ao navegador.

## SEO

- Domínio canônico e textos padrão ficam em `src/lib/site-config.ts`.
- Metadata, canonical e Open Graph por página: `src/lib/seo.tsx`.
- `src/app/sitemap.xml` (gerado) — revalida a cada 30 min e inclui as fotos
  de cada imóvel (image sitemap).
- `src/app/robots.txt` (gerado) — libera o catálogo e bloqueia `/admin` e `/api`.
- `src/app/manifest.ts` e `src/app/opengraph-image.tsx` (imagem de
  compartilhamento gerada em runtime).
- Dados estruturados JSON-LD: `RealEstateAgent`, `WebSite`, `ItemList`,
  `SingleFamilyResidence`, `Offer` e `BreadcrumbList`.

Endpoints gerados:

| URL | Arquivo |
| --- | --- |
| `/sitemap.xml` | `src/app/sitemap.ts` |
| `/robots.txt` | `src/app/robots.ts` |
| `/manifest.webmanifest` | `src/app/manifest.ts` |
| `/opengraph-image` | `src/app/opengraph-image.tsx` |

> **Telefone e e-mail públicos** ficam em `src/lib/data.ts` (`phone`,
> `phoneRaw`, `email`, `whatsappUrl`). O mesmo valor alimenta o WhatsApp, o
> formulário de contato e o JSON-LD — trocar em um lugar só.

## Segurança

- Sem credenciais padrão: `ADMIN_USERNAME` e `ADMIN_PASSWORD` são obrigatórios.
- Senha comparada em tempo constante (`timingSafeEqual` sobre hash SHA-256).
- Cookie de sessão assinado (HMAC-SHA256) com validade de 8 h, `HttpOnly`,
  `SameSite=Lax` e `Secure` em produção.
- Captcha aritmético assinado por HMAC no login (`/api/auth/captcha`), validado
  no servidor antes de checar as credenciais.
- Rate limit por IP no login: 8 tentativas por 15 min, com bloqueio progressivo
  de até 15 min. Em serverless o limite vale por instância.
- Cabeçalhos em `next.config.ts`: CSP, HSTS, `X-Frame-Options: DENY`,
  `Referrer-Policy`, `Permissions-Policy`, `nosniff`.
- `/admin` e `/api` com `no-store` + `X-Robots-Tag: noindex` e `noindex`
  via metadata.

Opcionais (veja `.env.example`): `SESSION_SECRET` e `CAPTCHA_SECRET`.

## Desenvolvimento

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
npm run lint
```