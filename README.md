# 🚗 VerifiCDMX - Portal de Citas de Verificación Vehicular

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.2-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-brown)](https://github.com/pmndrs/zustand)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.3-black?logo=framer)](https://www.framer.com/motion/)

**VerifiCDMX** es una Single Page Application (SPA) moderna, rápida y altamente optimizada diseñada para facilitar el proceso de agendado y gestión de citas de verificación vehicular en la Ciudad de México.

![Hero Preview](src/assets/hero.png)

## ✨ Características Principales

-   **🏠 Homepage Interactiva:** Sección Hero animada, checklist de requisitos interactivo y catálogo de verificentros.
-   **📅 Sistema de Agendado Robusto:** Formulario con validaciones estrictas (Zod + React Hook Form), selección de horarios en tiempo real y persistencia local.
-   **📋 Gestión de Citas:** Panel completo para visualizar, reprogramar o cancelar tus citas existentes.
-   **🌓 Modo Oscuro/Claro:** Sistema de temas persistente con transiciones suaves.
-   **🚀 Optimización Extrema:**
    -   Reducción del **47%** en el tamaño del bundle.
    -   Code splitting y Lazy loading de páginas.
    -   Diseño 100% responsive y accesible.

## 🛠️ Stack Tecnológico

-   **Frontend:** React 19 + TypeScript.
-   **Estilos:** TailwindCSS 4 (Modern utility-first CSS).
-   **Estado:** Zustand (Gestión de estado ligera y persistente).
-   **Animaciones:** Framer Motion (Interacciones fluidas).
-   **Validación:** Zod + React Hook Form.
-   **Iconografía:** Lucide React.

## 📦 Instalación y Uso

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/Donovan-mata/portal-cita.git
    cd portal-cita
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Iniciar servidor de desarrollo:**
    ```bash
    npm run dev
    ```

4.  **Construir para producción:**
    ```bash
    npm run build
    ```

## 📈 Métricas de Rendimiento

| Métrica | Resultado |
| :--- | :--- |
| **Bundle Size** | ~284 KB (Reducido 47%) |
| **Gzip Size** | ~90 KB |
| **Build Time** | ~12.0s |
| **Accesibilidad** | ARIA Labels implementados |

## 🗺️ Road Map

-   [ ] Integración con API real (Backend).
-   [ ] Selector de verificentros interactivo (Mapa).
-   [ ] Sistema de notificaciones por Email/SMS.
-   [ ] Pasarela de pagos integrada.

---

Desarrollado con ❤️ para mejorar la experiencia ciudadana en la CDMX.
