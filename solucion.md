# Reto 01 – Agente Conversacional de Registro como Proveedor

# 1. Problema en una frase

El proceso actual de registro como proveedor depende de actividades manuales repetitivas, búsqueda descentralizada de información, interpretación de formatos heterogéneos y armado documental, generando retrasos, errores operativos y dependencia del conocimiento de personas específicas.

---

# 2. Resumen Ejecutivo

La solución implementa un agente conversacional basado en Agentic AI para automatizar el proceso de registro como proveedor.

El agente es capaz de:

- Interpretar solicitudes de clientes.
- Identificar formatos y requisitos documentales.
- Consultar información corporativa oficial.
- Resolver campos mediante reglas de negocio.
- Generar formularios.
- Construir paquetes listos para revisión.
- Requerir confirmación humana antes de cualquier acción final.

La IA se utiliza como mecanismo de razonamiento y orquestación, mientras que las herramientas especializadas ejecutan la lógica de negocio y acceden a las fuentes autorizadas de información.

---

# 3. Problema de Negocio

Actualmente el proceso presenta cuatro problemas principales:

## Dependencia de personas

La ubicación de información y soportes depende del conocimiento individual.

## Retrabajo

Los mismos datos corporativos se buscan y transcriben repetidamente.

## Riesgo operativo

Errores de digitación pueden afectar cuentas bancarias, identificaciones fiscales y datos corporativos.

## Escalabilidad limitada

El crecimiento del volumen incrementa linealmente el esfuerzo administrativo.

---

# 4. Arquitectura

## Arquitectura Implementada

```text
Usuario
    ↓
Chat / API
    ↓
Agent Orchestrator
(GPT‑4o + Function Calling)
    ↓
Business Tools
    • leerSolicitud()
    • mapearCampos()
    • generarFormulario()
    • armarPaquete()
    • simularEnvio()
    ↓
Enterprise Data & Document Repository
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
    ↓
Human Approval
```

## Experience Layer

Permite que la analista administrativa interactúe con el agente mediante una interfaz conversacional.

## Agent Orchestration Layer

Implementada mediante GPT‑4o y Function Calling.

Responsabilidades:

- Interpretar solicitudes.
- Seleccionar herramientas.
- Gestionar secuencias de acciones.
- Coordinar el flujo de trabajo.

El modelo no contiene datos empresariales ni reglas de negocio.

## Business Services Layer

Implementada mediante herramientas especializadas.

### leerSolicitud()

Obtiene:

- Cliente.
- País.
- Formato solicitado.
- Campos requeridos.
- Soportes exigidos.

### mapearCampos()

Resuelve:

```text
Campo solicitado
      ↓
Glosario
      ↓
Campo maestro
      ↓
Valor
```

Clasificando resultados en:

- llenos
- faltantes
- requiere_confirmacion

### generarFormulario()

Construye una representación estructurada del formulario requerido por el cliente.

### armarPaquete()

Genera el paquete documental listo para revisión y firma.

### simularEnvio()

Representa la validación final del flujo de negocio.

## Enterprise Data & Document Repository

Actúa como fuente única de verdad.

Fuentes utilizadas:

- maestro.json
- glosario-campos.json
- repositorio de soportes
- solicitudes de ejemplo

## Governance Layer

La solución implementa:

- Human-in-the-Loop
- Data Traceability
- Separation of Reasoning and Execution
- Source-of-Truth Enforcement

El modelo nunca inventa información corporativa.

Todos los valores utilizados provienen exclusivamente de fuentes autorizadas.

---

# 5. Ciclo del Agente

```text
Solicitud Cliente
      ↓
leerSolicitud()
      ↓
mapearCampos()
      ↓
generarFormulario()
      ↓
armarPaquete()
      ↓
Confirmación Humana
      ↓
simularEnvio()
```

Cada etapa produce artefactos auditables y reutilizables.

---

# 6. Modelo Utilizado

## GPT‑4o

Razones:

- Excelente soporte para Function Calling.
- Buen equilibrio entre precisión y coste.
- Alta capacidad para interpretar contexto de negocio.
- Integración sencilla.

## Rol

Actúa como:

```text
Agent Orchestrator
```

No actúa como:

```text
Fuente de datos
Motor de negocio
Repositorio documental
```

---

# 7. Herramientas Implementadas

## leerSolicitud()

Objetivo:

Interpretar la solicitud del cliente.

Entrada:

- solicitud.json
- plantilla-campos.json
- plantilla-celdas.json
- soportes-exigidos.json

Salida:

```json
{
  "pais":"...",
  "cliente":"...",
  "formato":"...",
  "campos":[...],
  "soportes":[...]
}
```

## mapearCampos()

Objetivo:

Resolver información empresarial utilizando:

- glosario-campos.json
- maestro.json

Salida:

```json
{
  "llenos":[...],
  "faltantes":[...],
  "requiere_confirmacion":[...]
}
```

## generarFormulario()

Objetivo:

Construir un formulario estructurado listo para revisión.

Genera:

```text
formulario.json
```

Incluye:

- campos completos
- campos faltantes
- confirmaciones requeridas
- estado
- fecha de generación

## armarPaquete()

Objetivo:

Preparar el paquete documental.

Genera:

```text
paquete/
```

Conteniendo:

- formulario.json
- checklist.md
- borrador-correo.md
- soportes/

## simularEnvio()

Objetivo:

Representar la acción final del proceso.

Genera:

```text
ENVIO-SIMULADO.md
```

únicamente después de confirmación.

---

# 8. Human‑in‑the‑Loop

La solución mantiene explícitamente al usuario dentro del proceso.

Ejemplos:

- RUC
- RTN
- Información faltante
- Confirmaciones previas al envío

La IA prepara la decisión.

El humano la aprueba.

---

# 9. Estrategia para Portales Web

Aunque el reto no requiere implementación real, una solución productiva se apoyaría en:

- Playwright
- Selenium
- Power Automate Desktop
- UiPath

Limitaciones:

- CAPTCHA
- MFA
- Cambios dinámicos de interfaz

La autenticación y el envío final permanecerían bajo control humano.

---

# 10. Decisiones y Trade-Offs

## Decisión 1

Uso de herramientas como única fuente de datos.

Alternativa:

Permitir al LLM completar datos faltantes.

Motivo:

Reducir alucinaciones.

## Decisión 2

Mantener Human‑in‑the‑Loop.

Alternativa:

Automatización completa.

Motivo:

Preservar gobierno y control.

## Decisión 3

Persistencia basada en archivos.

Alternativa:

Base de datos.

Motivo:

Reducir complejidad para el alcance del reto.

## Decisión 4

Separar razonamiento y ejecución.

Alternativa:

Implementar lógica dentro del prompt.

Motivo:

Mejor trazabilidad y mantenibilidad.

---

# 11. Supuestos

- Los datos maestros están actualizados.
- Los documentos representan versiones oficiales.
- Las plantillas incluidas son representativas.
- La firma electrónica está fuera del alcance.

---

# 12. Riesgos

## Calidad de Datos

Mitigación:

- Ownership.
- Data Stewardship.

## Hallucinations

Mitigación:

- Function Calling.
- Herramientas como única fuente de verdad.

## Escalabilidad

Mitigación:

- Procesamiento asíncrono.
- Arquitectura desacoplada.

## Gestión Documental

Mitigación:

- Checklist.
- Control documental.
- Validación de evidencias.

## Automatización sin Supervisión

Mitigación:

- Human‑in‑the‑Loop.
- Confirmación explícita.

---

# 13. Cobertura

| Historia | Estado |
|-----------|--------|
| HU‑1 Leer Solicitud | Hecho |
| HU‑2 Mapear Campos | Hecho |
| HU‑3 Generar Formulario | Hecho |
| HU‑4 Armar Paquete | Hecho |
| HU‑5 Confirmación y Envío Simulado | Hecho |

---

# 14. Uso de IA

Herramientas utilizadas:

- ChatGPT
- GitHub Copilot

Aplicaciones:

- Diseño arquitectónico.
- Refactorización.
- Tipado TypeScript.
- Revisión de calidad.
- Documentación.

Las propuestas fueron revisadas y adaptadas antes de incorporarlas.

---

# 15. Limitaciones del Prototipo y Evolución hacia un Agente Autónomo

La implementación actual valida completamente la lógica de negocio mediante una ejecución determinística:

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

Este enfoque se adoptó deliberadamente para garantizar:

- reproducibilidad,
- trazabilidad,
- pruebas independientes del modelo,
- aislamiento de la lógica de negocio.

La capacidad de Agentic AI ya está parcialmente implementada mediante GPT‑4o y Function Calling, aunque la orquestación autónoma completa del flujo aún no ha sido desarrollada.

## Arquitectura Objetivo

```text
Usuario
    ↓
GPT‑4o
    ↓
leerSolicitud()
    ↓
GPT‑4o
    ↓
mapearCampos()
    ↓
GPT‑4o
    ↓
generarFormulario()
    ↓
GPT‑4o
    ↓
armarPaquete()
    ↓
GPT‑4o
    ↓
Confirmación Humana
    ↓
simularEnvio()
```

En una versión productiva, GPT actuaría como un verdadero orquestador dinámico del flujo.

---

# 16. Visión de Producción

Los mayores desafíos para una implementación empresarial no son tecnológicos:

- Gobierno de datos.
- Gobierno de IA.
- Gestión documental.
- Seguridad.
- Ownership del proceso.
- Gestión del cambio.
- Escalabilidad operacional.

La solución demuestra cómo un patrón Agentic AI puede transformar un proceso administrativo altamente manual en una capacidad empresarial escalable, trazable y gobernada, reduciendo dependencia de conocimiento individual y mejorando significativamente la productividad operativa.
