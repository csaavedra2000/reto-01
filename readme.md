README.md
Reto 01 – Agente Conversacional de Registro como Proveedor
Descripción

La solución implementa un agente conversacional habilitado por IA para automatizar el proceso de registro como proveedor.

El agente es capaz de:

Leer solicitudes de clientes.
Identificar formato solicitado.
Resolver campos utilizando un repositorio maestro y un glosario de equivalencias.
Generar formularios estructurados.
Construir paquetes documentales para revisión y firma.
Simular el envío del paquete bajo un mecanismo de aprobación humana.
Arquitectura
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
Repositorio Corporativo
    • maestro.json
    • glosario-campos.json
    • soportes
    • solicitudes
    ↓
Artefactos
    • formulario.json
    • checklist.md
    • borrador-correo.md
    • ENVIO-SIMULADO.md

Estructura del Proyecto
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


Basado en la estructura implementada en P.txt y S.txt>.

Requisitos
Node.js

Versión recomendada:

Node 22 LTS o superior

Dependencias

Desde la raíz:

npm install

Variables de Entorno

Crear:

.env


Contenido:

OPENAI_API_KEY=<TU_API_KEY>

MODEL=gpt-4o

PORT=3000

Levantar el Backend

Desde la raíz:

npx ts-node src/server.ts


Resultado esperado:

Server running on port 3000

Validaciones
Health Check

Abrir:

http://localhost:3000/health


Resultado:

{
  "ok": true
}

Validación de Tools mediante GPT

Modificar temporalmente el contenido enviado por el endpoint:

messages: [
 {
   role:"user",
   content:
   "Read supplier request ec-corp-andina"
 }
]


y ejecutar:

http://localhost:3000/test-tool

Validación HU‑1

Devuelve:

país
cliente
formato
campos
soportes
Validación HU‑2

Modificar:

content:
"Map supplier registration fields"


Resultado esperado:

{
  "llenos":[...],
  "faltantes":[...],
  "requiere_confirmacion":[...]
}

Validación HU‑3

Endpoint:

http://localhost:3000/test-formulario


Artefacto generado:

out/
 └── ec-corp-andina/
      └── formulario.json

Validación HU‑4

Endpoint:

http://localhost:3000/test-paquete


Artefactos generados:

out/
 └── ec-corp-andina/
      └── paquete/
           ├── formulario.json
           ├── checklist.md
           ├── borrador-correo.md
           └── soportes/

Ejecución de demo.ts
Objetivo

Demostrar la lógica completa de negocio sin depender del LLM.

Flujo:

leerSolicitud()
      ↓
mapearCampos()
      ↓
generarFormulario()
      ↓
armarPaquete()
      ↓
simularEnvio()

Cómo ejecutar

Abrir una terminal en la raíz del proyecto:

cd reto-01


Ejecutar:

npx ts-node demo.ts

Resultado esperado
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
.../formulario.json

Paquete:
.../paquete

Envio:
.../ENVIO-SIMULADO.md

==================================

Artefactos Generados
Formulario
out/<caso>/formulario.json

Paquete
out/<caso>/paquete/


Contiene:

formulario.json
checklist.md
borrador-correo.md
soportes/

Envío Simulado
out/<caso>/paquete/ENVIO-SIMULADO.md

Historias Implementadas
Historia	EstadoHU‑1 Leer Solicitud	Implementada
HU‑2 Mapear Campos	Implementada
HU‑3 Generar Formulario	Implementada
HU‑4 Armar Paquete	Implementada
HU‑5 Confirmación y Envío Simulado	Implementada
Nota Final

La lógica de negocio ha sido diseñada para mantenerse desacoplada del modelo de lenguaje. Las herramientas pueden ejecutarse independientemente mediante demo.ts, permitiendo pruebas reproducibles, trazabilidad y evolución futura hacia una arquitectura Agentic AI completamente autónoma. Basado en la implementación actual de proveedor.ts y server.ts.
