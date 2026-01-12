# Sistema de Gestión de Expedientes - CID URU

![Status](https://img.shields.io/badge/Estado-Fase_de_Construcción-orange)
![Methodology](https://img.shields.io/badge/Metodología-RUP-blue)
![Stack](https://img.shields.io/badge/Tech-Spring_Boot_%7C_React_%7C_PostgreSQL-green)

Este repositorio contiene el código fuente y la documentación del sistema de digitalización y gestión de expedientes académicos para el **Centro de Información y Documentación (CID)** de la **Universidad Rafael Urdaneta (URU)**.

El proyecto sigue el **Proceso Unificado de Rational (RUP)**, siendo un desarrollo iterativo, incremental, centrado en la arquitectura y dirigido por casos de uso [2, 3].

## 📋 Tabla de Contenidos
- [Contexto del Proyecto](#-contexto-del-proyecto)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Estructura del Monorepo](#-estructura-del-monorepo)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Ejecución](#-instalación-y-ejecución)
- [Módulos Principales](#-módulos-principales)
- [Documentación RUP](#-documentación-rup)
- [Autores](#-autores)

---

## 🧐 Contexto del Proyecto
El CID gestiona actualmente los expedientes estudiantiles en formato físico, lo que conlleva riesgos de deterioro, pérdida y lentitud en las consultas [4]. Este sistema busca:
1. **Digitalizar** la gestión de documentos obligatorios y opcionales.
2. **Centralizar** la información de estudiantes activos, no activos y egresados.
3. **Optimizar** el flujo de trabajo entre Asistentes, Verificadores y Administradores [5].

---

## 🏗 Arquitectura del Sistema
El sistema implementa una arquitectura en capas distribuida en nodos Cliente-Servidor [6, 7]:

| Capa | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Frontend (Cliente)** | **React + Vite** | Interfaz de usuario (SPA) que consume la API REST. |
| **Backend (Servidor)** | **Spring Boot (Java)** | Lógica de negocio, seguridad (Spring Security/JWT) y exposición de API. |
| **Base de Datos** | **PostgreSQL** | Persistencia de datos relacionales (Usuarios, Estudiantes, Expedientes). |
| **Almacenamiento** | **Híbrido** | Sistema de archivos local / Nube (según restricción RST-04) [8]. |

---

## 📂 Estructura del Monorepo
Este repositorio agrupa tanto el cliente como el servidor para facilitar la gestión de configuración [9].

```bash
/
├── docs/                  # Artefactos RUP (Modelos, Diagramas UML, Requisitos)
├── backend/               # Código fuente Java / Spring Boot
│   ├── src/main/java/com/cid/
│   │   ├── auth/          # LoginController, SecurityConfig
│   │   ├── users/         # Gestión de usuarios internos
│   │   ├── records/       # Gestión de Expedientes (Folder, Document)
│   │   └── verification/  # Lógica de validación y observaciones
│   └── ...
├── frontend/              # Código fuente React + Vite
│   ├── src/
│   │   ├── components/    # Vistas primitivas (Botones, Inputs)
│   │   ├── pages/         # Vistas compuestas (vAdminHome, vLogin)
│   │   └── services/      # Conexión con API REST
│   └── ...
└── README.md
