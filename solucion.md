Reto 01 – Agente Conversacional de Registro como Proveedor 

1. Problema en una frase 

El proceso de registro como proveedor depende de actividades repetitivas, búsqueda manual de información, interpretación de formularios heterogéneos y preparación documental dispersa, generando riesgo operativo, dependencia de conocimiento tácito y tiempos de respuesta elevados. 

 

2. Resumen Ejecutivo 

La solución propuesta implementa un agente conversacional basado en Agentic AI que automatiza la preparación del proceso de registro como proveedor, utilizando datos corporativos centralizados, reglas de negocio explícitas y validación humana antes de cualquier acción externa. 

La solución se enfoca en: 

Reducir la transcripción manual. 

Estandarizar el acceso a información corporativa. 

Mejorar la trazabilidad. 

Reducir dependencia de conocimiento individual. 

Aumentar la productividad administrativa. 

Mantener control humano sobre decisiones críticas. 

La IA se utiliza como mecanismo de razonamiento y orquestación, mientras que las herramientas especializadas ejecutan la lógica de negocio y acceden a las fuentes autorizadas de información. 

 

3. Arquitectura 

Arquitectura de solución 

Usuario 

    ↓ 

Chat 

    ↓ 

Agente IA 

    ↓ 

Herramientas de Negocio 

    ↓ 

Repositorio Corporativo 

    ↓ 

Artefactos Generados 

    ↓ 

Confirmación Humana 

Arquitectura técnica 

React + Vite 

        ↓ 

Express API 

        ↓ 

GPT‑4o 

        ↓ 

Function Calling 

        ↓ 

leerSolicitud() 

mapearCampos() 

generarFormulario() 

armarPaquete() 

simularEnvio() 

        ↓ 

Repositorio Maestro 

Separación de responsabilidades 

Experience Layer 

Responsable de la interacción con la analista administrativa. 

AI Orchestration Layer 

Responsable del razonamiento y secuenciación de acciones. 

Business Services Layer 

Responsable de ejecutar reglas de negocio. 

Enterprise Data Layer 

Responsable de actuar como fuente única de verdad. 

Governance Layer 

Responsable de control, trazabilidad y cumplimiento. 

 

4. Ciclo del Agente 

Usuario 

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

El agente no genera información de negocio. 

Todos los valores utilizados provienen de: 

maestro.json 

glosario-campos.json 

solicitud.json 

soportes-exigidos.json 

El modelo únicamente coordina el flujo de trabajo. 

 

5. Modelo Seleccionado 

Modelo 

GPT‑4o 

Razones 

Buen desempeño en Function Calling. 

Buen equilibrio entre precisión y coste. 

Capacidad para interpretar formularios heterogéneos. 

Facilidad de integración. 

Uso dentro de la arquitectura 

GPT‑4o actúa como: 

Razonador 

No actúa como: 

Fuente de verdad 

ni como: 

Motor de negocio 

 

6. Herramientas Implementadas 

leerSolicitud() 

Responsabilidad: 

Identificar cliente. 

País. 

Formato solicitado. 

Campos requeridos. 

Soportes requeridos. 

Entradas: 

solicitud.json 

plantilla-campos.json 

plantilla-celdas.json 

soportes-exigidos.json 

Salidas: 

{ 

  "pais": "...", 

  "cliente": "...", 

  "formato": "...", 

  "campos": [...], 

  "soportes": [...] 

} 

 

mapearCampos() 

Responsabilidad: 

Resolver datos corporativos. 

Flujo: 

Campo Cliente 

      ↓ 

Glosario 

      ↓ 

Campo Maestro 

      ↓ 

Valor 

Clasificación: 

llenos 

faltantes 

requiere_confirmacion 

 

generarFormulario() 

Responsabilidad: 

Construir una representación estructurada del formulario solicitado. 

Genera: 

out/<caso>/formulario.json 

Incluye: 

campos completos 

campos faltantes 

campos con confirmación 

fecha de generación 

estado 

 

armarPaquete() 

Responsabilidad: 

Construir el paquete documental. 

Genera: 

out/<caso>/paquete/ 

Contenido: 

formulario.json 

checklist.md 

borrador-correo.md 

soportes/ 

 

simularEnvio() 

Responsabilidad: 

Representar la acción externa sin ejecutarla. 

Genera: 

ENVIO-SIMULADO.md 

solo después de confirmación explícita. 

 

7. Estrategia para Portales Web 

El reto no requiere integración real. 

Para producción propondría: 

Automatización 

Playwright 

Selenium 

Power Automate Desktop 

UiPath 

Control humano 

El agente: 

prepara información. 

valida campos. 

El humano: 

ingresa credenciales. 

resuelve MFA. 

confirma envío. 

 

8. Human‑in‑the‑Loop 

Se implementa un punto de control explícito antes de cualquier acción externa. 

La filosofía es: 

La IA prepara. 

El humano decide. 

Razones: 

Cumplimiento. 

Gobierno. 

Responsabilidad. 

Prevención de errores. 

 

9. Decisiones y Trade-Offs 

Decisión 1 

Herramientas como única fuente de verdad. 

Alternativa 

Permitir al LLM completar información faltante. 

Motivo 

Reducción de alucinaciones. 

 

Decisión 2 

Human‑in‑the‑Loop obligatorio. 

Alternativa 

Automatización completa. 

Motivo 

Preservar control y trazabilidad. 

 

Decisión 3 

Persistencia basada en archivos. 

Alternativa 

Base de datos relacional. 

Motivo 

Menor complejidad para el alcance del reto. 

 

Decisión 4 

Separación estricta entre razonamiento y ejecución. 

Alternativa 

Implementar reglas dentro del prompt. 

Motivo 

Mayor mantenibilidad y auditabilidad. 

 

10. Supuestos 

Los datos maestros están actualizados. 

Los soportes representan la documentación oficial. 

Los formularios de ejemplo representan escenarios reales. 

La firma electrónica está fuera del alcance. 

Los datos contenidos en los fixtures son consistentes. 

 

11. Riesgos 

Riesgo 1 — Calidad de Datos 

Datos incorrectos en el maestro producirán formularios incorrectos. 

Mitigación 

Gobierno del dato y Data Steward. 

 

Riesgo 2 — Hallucinations 

El modelo podría intentar inferir valores faltantes. 

Mitigación 

Function Calling y herramientas como única fuente de datos. 

 

Riesgo 3 — Dependencia de IA 

El flujo podría depender excesivamente del modelo. 

Mitigación 

Reglas de negocio implementadas en herramientas. 

 

Riesgo 4 — Gestión documental 

Documentos vencidos o incompletos. 

Mitigación 

Checklist y validaciones automáticas. 

 

Riesgo 5 — Automatización sin supervisión 

Acciones externas ejecutadas incorrectamente. 

Mitigación 

Human‑in‑the‑Loop. 

 

12. Cobertura 

Historia 

Estado 

HU‑1 Leer Solicitud 

Hecho 

HU‑2 Mapear Campos 

Hecho 

HU‑3 Generar Formulario 

Hecho 

HU‑4 Armar Paquete 

Hecho 

HU‑5 Confirmación y Envío Simulado 

Hecho 

 

13. Uso de IA 

Herramientas utilizadas: 

ChatGPT 

GitHub Copilot 

Aplicaciones: 

Diseño de arquitectura. 

Refactorización. 

Tipado TypeScript. 

Revisión de calidad. 

Documentación. 

Las propuestas generadas por IA fueron revisadas, adaptadas y validadas antes de su incorporación. 

 

14. Visión de Producción 

La tecnología no es el principal desafío. 

Las principales brechas para una implementación empresarial son: 

Gobierno de datos. 

Gobierno de IA. 

Gestión documental. 

Seguridad. 

Ownership del proceso. 

Gestión del cambio. 

Escalabilidad operacional. 

La solución propuesta demuestra cómo la IA puede transformar el proceso de registro como proveedor mediante un modelo operativo más escalable, trazable y resiliente, reduciendo actividades manuales y preservando los controles necesarios para un entorno empresarial de producción. 