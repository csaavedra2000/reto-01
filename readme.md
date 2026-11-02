# Reto 01 – Agente Conversacional de Registro como Proveedor

## Descripción

La solución implementa un agente conversacional habilitado por IA para automatizar el proceso de registro como proveedor.

El agente es capaz de:

- Leer solicitudes de clientes.
- Identificar formatos y requisitos documentales.
- Resolver campos utilizando un repositorio maestro y un glosario de equivalencias.
- Generar formularios estructurados.
- Construir paquetes documentales para revisión y firma.
- Simular el envío del paquete bajo un mecanismo de aprobación humana.

---

# Arquitectura

```text
Usuario
    ↓
Chat / API
    ↓
GPT‑4o + Function Calling
    ↓
Business Tools
    • leerSolicitud()
    • mapearCampos()
    • generarFormulario()
    • armarPaquete()
    • simularEnvio()
    ↓
Enterprise Repository
    • maestro.json
    • glosario-campos.json
    • soportes
    • solicitudes
    ↓
Business Artifacts
    • formulario.json
    • checklist.md
    • borrador-correo.md
    • ENVIO-SIMULADO.md
```

---

# Estructura del Proyecto

```text
reto-01
│
├── agent
│
├── fixtures
│   ├── casos
│   ├── repositorio
│   └── glosario-campos.json
│
├── out
│
├── src
│   ├── knowledge
│   ├── llm
│   ├── tools
│   │    └── proveedor.ts
│   └── server.ts
│
├── web
│
├── demo.ts
├── README.md
├── SOLUCION.md
├── .env
└── package.json
```

---

# Requisitos

## Node.js

Versión recomendada:

```text
Node.js 22 LTS o superior
```

## Dependencias

Instalar:

```bash
npm install
```

---

# Variables de Entorno

Crear:

```text
.env
```

Contenido:

```env
OPENAI_API_KEY=<YOUR_API_KEY>
MODEL=gpt-4o
PORT=3000
```

---

# Levantar el Backend

Desde la raíz:

```bash
npx ts-node src/server.ts
```

Resultado esperado:

```text
Server running on port 3000
```

---

# Endpoint de Salud

Abrir:

```text
http://localhost:3000/health
```

Resultado esperado:

```json
{
  "ok": true
}
```

---

# Ejecución de demo.ts

## Objetivo

Demostrar el flujo completo de negocio sin depender del LLM.

Flujo validado:

```text
leerSolicitud()
      ↓
mapearCampos()
      ↓
generarFormulario()
      ↓
armarPaquete()
      ↓
simularEnvio()
```

---

## Cómo ejecutar

Desde la raíz del proyecto:

```bash
npx ts-node demo.ts
```

---

## Resultado esperado

```text
==================================
CASO: ec-corp-andina
==================================

Cliente:
Corporación Andina de Servicios S.A.

Pais:
EC

Formato:
pdf

Campos solicitados:
15

Soportes solicitados:
5

Campos completos:
14

Campos faltantes:
1

Campos con confirmacion:
1

Formulario:
...\formulario.json

Paquete:
...\paquete

Envio:
...\ENVIO-SIMULADO.md

==================================
```

---

# Artefactos Generados

## Formulario

```text
out/<caso>/formulario.json
```

## Paquete

```text
out/<caso>/paquete/
```

Conteniendo:

```text
formulario.json
checklist.md
borrador-correo.md
soportes/
```

## Envío Simulado

```text
out/<caso>/paquete/ENVIO-SIMULADO.md
```

---

# Historias Implementadas

| Historia | Estado |
|----------|---------|
| HU‑1 Leer Solicitud | Implementada |
| HU‑2 Mapear Campos | Implementada |
| HU‑3 Generar Formulario | Implementada |
| HU‑4 Armar Paquete | Implementada |
| HU‑5 Confirmación y Envío Simulado | Implementada |

---

# Nota

La lógica de negocio está desacoplada del modelo de lenguaje. Las herramientas pueden ejecutarse independientemente mediante `demo.ts`, permitiendo pruebas reproducibles, trazabilidad y evolución futura hacia una arquitectura Agentic AI completamente autónoma.