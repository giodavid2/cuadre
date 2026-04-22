# Cuadre

Aplicación web para registrar y hacer seguimiento de gastos recurrentes mes a mes, con soporte para fecha de corte de tarjeta de crédito.

---

## Iniciar en local

**Requisitos previos:** Node.js >= 18 y npm >= 9.

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd cuadre

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

La app queda disponible en `http://localhost:5173`.

### Otros comandos útiles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot-reload |
| `npm run build` | Compila y empaqueta para producción en `/dist` |
| `npm run preview` | Previsualiza el build de producción localmente |

---

## Despliegue en Vercel

El proyecto incluye `vercel.json` con la configuración de rewrite necesaria para que el enrutamiento de la SPA funcione correctamente.

1. Instala la CLI de Vercel: `npm i -g vercel`
2. Ejecuta `vercel` en la raíz del proyecto y sigue las instrucciones.
3. O conecta el repositorio directamente desde [vercel.com](https://vercel.com) — Vercel detecta automáticamente Vite como framework.

---

## Estructura de carpetas — Atomic Design

El proyecto aplica la metodología **Atomic Design** de Brad Frost, que organiza los componentes de interfaz en cinco niveles de abstracción, desde lo más simple hasta lo más complejo.

```
src/
├── components/
│   ├── atoms/           # Nivel 1 — elementos indivisibles de la UI
│   │   ├── Badge/
│   │   ├── Button/
│   │   ├── Checkbox/
│   │   ├── Input/
│   │   └── Label/
│   │
│   ├── molecules/       # Nivel 2 — combinaciones de átomos con una función concreta
│   │   ├── ChecklistItem/
│   │   ├── ExpenseCard/
│   │   └── FormField/
│   │
│   ├── organisms/       # Nivel 3 — secciones completas e independientes de la UI
│   │   ├── ChecklistPanel/
│   │   ├── CutoffDateSetting/
│   │   ├── ExpenseForm/
│   │   └── ExpenseList/
│   │
│   └── templates/       # Nivel 4 — estructura y disposición de la página
│       └── MainLayout/
│
├── pages/               # Nivel 5 — instancias concretas de los templates con datos reales
│   ├── ChecklistPage/
│   └── RegisterPage/
│
├── context/             # Estado global de la aplicación (React Context)
├── hooks/               # Hooks personalizados
├── styles/              # Variables SCSS globales y estilos base
├── types/               # Interfaces y tipos TypeScript
└── utils/               # Funciones de utilidad puras
```

### Por qué Atomic Design

| Nivel | Qué contiene | Ejemplo en este proyecto |
|---|---|---|
| **Átomos** | Un solo elemento HTML con estilos propios, sin lógica de negocio | `<Button>`, `<Input>`, `<Checkbox>` |
| **Moléculas** | Dos o más átomos que juntos cumplen una pequeña responsabilidad | `<FormField>` = Label + Input, `<ChecklistItem>` = Checkbox + Badge |
| **Organismos** | Sección autónoma de la interfaz, puede consumir estado | `<ExpenseForm>`, `<ChecklistPanel>` |
| **Templates** | Define el esqueleto de la página sin datos reales | `<MainLayout>` con navegación y `<Outlet>` |
| **Páginas** | Template instanciado con componentes y contexto reales | `<RegisterPage>`, `<ChecklistPage>` |

Esta separación permite reutilizar átomos y moléculas en cualquier parte de la app, mantener cada componente enfocado en una sola responsabilidad (principio SRP de SOLID) y escalar la interfaz sin perder coherencia visual.

Cada componente vive en su propia carpeta con su archivo `.tsx` y su archivo `.module.scss`, de modo que los estilos están encapsulados y no generan colisiones de nombres de clase.
