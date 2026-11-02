import fs from "fs";
import path from "path";

export interface LeerSolicitudResult {

  ok: boolean;

  caso: string;

  pais: string;

  cliente: string;

  formato: string;

  campos: CampoSolicitado[];

  soportes: string[];

  solicitud?: unknown;

  error?: string;

}
export function leerSolicitud(
  caso: string
): LeerSolicitudResult {

  try {

    const ruta =
      path.join(
        process.cwd(),
        "fixtures",
        "casos",
        caso,
        "solicitud.json"
      );

    const contenido =
      fs.readFileSync(
        ruta,
        "utf8"
        
      );

      
    const solicitud =
      JSON.parse(contenido);

const soportesPath =
  path.join(
    process.cwd(),
    "fixtures",
    "casos",
    caso,
    "soportes-exigidos.json"
  );

let soportes: string[] = [];

if (
  fs.existsSync(
    soportesPath
  )
) {

  soportes =
    JSON.parse(
      fs.readFileSync(
        soportesPath,
        "utf8"
      )
    );

}

/* ===========================
   NUEVO PASO 4
=========================== */

const plantillaPdfPath =
  path.join(
    process.cwd(),
    "fixtures",
    "casos",
    caso,
    "plantilla-campos.json"
  );

const plantillaExcelPath =
  path.join(
    process.cwd(),
    "fixtures",
    "casos",
    caso,
    "plantilla-celdas.json"
  );

let campos: CampoSolicitado[] = [];

/* ===========================
   PASO 5
=========================== */

if (
  fs.existsSync(
    plantillaPdfPath
  )
) {

  campos =
    JSON.parse(
      fs.readFileSync(
        plantillaPdfPath,
        "utf8"
      )
    );

}

/* ===========================
   PASO 6
=========================== */

else if (
  fs.existsSync(
    plantillaExcelPath
  )
) {

  const plantillaExcel =
    JSON.parse(
      fs.readFileSync(
        plantillaExcelPath,
        "utf8"
      )
    );

  campos =
    plantillaExcel.map(
      (
        item: {
          etiqueta: string;
        }
      ) => ({
        etiqueta:
          item.etiqueta
      })
    );

}

/* ===========================
   RETURN
=========================== */

return {

  ok: true,

  caso,

  pais:
    solicitud.pais,

  cliente:
    solicitud.cliente,

  formato:
    solicitud.formato,

  campos,

  soportes,

  solicitud

};

}

catch (error) {

  return {

    ok: false,

    caso,

    pais: "",

    cliente: "",

    formato: "",

    campos: [],

    soportes: [],

    error:
      error instanceof Error
        ? error.message
        : "Unknown error"

  };

}

}
export interface CampoLleno {

  etiqueta: string;

  claveInterna: string;

  valor: string;

}

export interface CampoFaltante {

  etiqueta: string;

}

export interface CampoConfirmacion {

  etiqueta: string;

  motivo: string;

}

export interface MapearCamposResult {

  llenos: CampoLleno[];

  faltantes: CampoFaltante[];

  requiere_confirmacion:
    CampoConfirmacion[];

}

export interface CampoFormulario {

  etiqueta: string;

  valor: string;

}

export interface FormularioGenerado {

  caso: string;

  estado:
    "listo" |
    "pendiente_revision";

   fecha_generacion: string;

  campos_completados:
    CampoLleno[];

  campos_faltantes:
    CampoFaltante[];

  campos_con_confirmacion:
    CampoConfirmacion[];

}

export interface GenerarFormularioResult {

  ok: boolean;

  ruta: string;

  formulario:
    FormularioGenerado;

}


function getNestedValue(

  obj: Record<string, unknown>,

  path: string

): unknown {

  return path
    .split(".")
    .reduce<unknown>((acc, key) => {

      if (
        acc &&
        typeof acc === "object" &&
        key in (acc as Record<string, unknown>)
      ) {

        return (
          acc as Record<
            string,
            unknown
          >
        )[key];

      }

      return undefined;

    }, obj);

}

export function mapearCampos(

  camposSolicitados:
    CampoSolicitado[]

): MapearCamposResult {

  const maestroPath =
    path.join(

      process.cwd(),

      "fixtures",


      "repositorio",

      "maestro.json"

    );

  const glosarioPath =
    path.join(

      process.cwd(),

      "fixtures",

      

      "glosario-campos.json"

    );

  const maestro =
    JSON.parse(

      fs.readFileSync(
        maestroPath,
        "utf8"
      )

    ) as Record<
      string,
      unknown
    >;

  const glosario =
    JSON.parse(

      fs.readFileSync(
        glosarioPath,
        "utf8"
      )

    ) as Record<
      string,
      string
    >;

  const llenos:
    CampoLleno[] = [];

  const faltantes:
    CampoFaltante[] = [];

  const requiereConfirmacion:
    CampoConfirmacion[] = [];

  for (
    const campo
    of camposSolicitados
  ) {

    const claveInterna =
      glosario[
        campo.etiqueta
      ];

    if (!claveInterna) {

      faltantes.push({

        etiqueta:
          campo.etiqueta

      });

      continue;

    }

    const valor =
      getNestedValue(
        maestro,
        claveInterna
      );

    if (
      valor === undefined ||
      valor === null
    ) {

      faltantes.push({

        etiqueta:
          campo.etiqueta

      });

      continue;

    }

    if (

      campo.etiqueta ===
        "RUC" ||

      campo.etiqueta ===
        "RTN"

    ) {

      requiereConfirmacion.push({

        etiqueta:
          campo.etiqueta,

        motivo:
          "Foreign tax identifier"

      });

    }

    llenos.push({

      etiqueta:
        campo.etiqueta,

      claveInterna,

      valor:
        String(valor)

    });

  }

  return {

    llenos,

    faltantes,

    requiere_confirmacion:
      requiereConfirmacion

  };

}
export interface LeerSolicitudArgs {
  caso: string;
}
export interface CampoSolicitado {
  etiqueta: string;
  obligatorio?: boolean;
}


export function generarFormulario(

  caso: string,

  mapeo: MapearCamposResult

): GenerarFormularioResult {

  const outputDir =
    path.join(
      process.cwd(),
      "out",
      caso
    );

  if (
    !fs.existsSync(outputDir)
  ) {

    fs.mkdirSync(
      outputDir,
      { recursive: true }
    );

  }

  const formularioPath =
    path.join(
      outputDir,
      "formulario.json"
    );

 const estado:
  "listo" |
  "pendiente_revision" =

    mapeo.faltantes.length > 0 ||
    mapeo.requiere_confirmacion.length > 0

      ? "pendiente_revision"
      : "listo";

const formulario: FormularioGenerado = {

  caso,

  estado,

  fecha_generacion:
    new Date().toISOString(),

  campos_completados:
    mapeo.llenos,

  campos_faltantes:
    mapeo.faltantes,

  campos_con_confirmacion:
    mapeo.requiere_confirmacion

};


  fs.writeFileSync(

    formularioPath,

    JSON.stringify(
      formulario,
      null,
      2
    ),

    "utf8"

  );

 return {

  ok: true,

  ruta:
    formularioPath,

  formulario

};

}


export interface ChecklistItem {

  soporte: string;

  estado:
    "presente" |
    "ausente" |
    "vencido";

}

export interface ArmarPaqueteResult {

  ok: boolean;

  ruta: string;

  listo_para_firma: boolean;

  checklist:
    ChecklistItem[];

}

export interface SimularEnvioResult {

  ok: boolean;

  ruta: string;

}


export function armarPaquete(

  caso: string

): ArmarPaqueteResult {

  const outputDir =
    path.join(
      process.cwd(),
      "out",
      caso,
      "paquete"
    );

    const soportesDir =
  path.join(
    outputDir,
    "soportes"
  );

if (
  !fs.existsSync(
    soportesDir
  )
) {

  fs.mkdirSync(
    soportesDir,
    {
      recursive: true
    }
  );

}

const mapeo =
  mapearCampos([
    {
      etiqueta:
        "Nombre de la empresa"
    },
    {
      etiqueta:
        "RUC"
    },
    {
      etiqueta:
        "Banco"
    }
  ]);

const formulario =
  generarFormulario(
    caso,
    mapeo
  );

const formularioOrigen =
  formulario.ruta;

const formularioDestino =
  path.join(
    outputDir,
    "formulario.json"
  );

try {

  fs.copyFileSync(
    formularioOrigen,
    formularioDestino
  );

  

}
catch (error) {

  console.error(
    "Error copiando formulario:",
    error
  );

} 

  if (
    !fs.existsSync(outputDir)
  ) {

    fs.mkdirSync(
      outputDir,
      { recursive: true }
    );

  }

  const soportesSolicitadosPath =
path.join(
process.cwd(),
"fixtures",
"casos",
caso,
"soportes-exigidos.json"
);
 
const soportesSolicitados =
JSON.parse(
fs.readFileSync(
soportesSolicitadosPath,
"utf8"
)
) as string[];

const checklist: ChecklistItem[] =

soportesSolicitados.map(
(soporte: string) => ({

soporte,

estado:
"presente"

})
);

  const checklistPath =
    path.join(
      outputDir,
      "checklist.md"
    );


const checklistContent =

`# Checklist de Registro

## Cliente

${caso}

## Formulario

- formulario.json: ${
  fs.existsSync(
    formularioDestino
  )
    ? "PRESENTE"
    : "AUSENTE"
}

## Soportes Requeridos

${checklist
  .map(
    item =>
      `- ${item.soporte}: ${item.estado}`
  )
  .join("\n")}

## Estado

Listo para firma: ${
  checklist.every(
    item =>
      item.estado ===
      "presente"
  )
    ? "SI"
    : "NO"
}
`;

  const correoPath =
    path.join(
      outputDir,
      "borrador-correo.md"
    );

  fs.writeFileSync(

    correoPath,

`Asunto: Registro como proveedor - listo para revisión

Estimado representante legal,

Se ha preparado el paquete de registro como proveedor para el caso:

${caso}

Documentos incluidos:

- formulario.json
- checklist.md

Por favor revisar la información y validar cualquier observación antes de proceder con la firma y posterior envío al cliente.

Saludos,

Equipo Administrativo`,

    "utf8"

  );
 
fs.writeFileSync(
  checklistPath,
  checklistContent,
  "utf8"
);



  return {

    ok: true,

    ruta:
      outputDir,

    listo_para_firma: true,

    checklist

  };
}

export function simularEnvio(

  caso: string,

  confirmado: boolean

): SimularEnvioResult {

  if (!confirmado) {

    throw new Error(
      "Confirmation required"
    );

  }

  const envioPath =
    path.join(
      process.cwd(),
      "out",
      caso,
      "paquete",
      "ENVIO-SIMULADO.md"
    );

  fs.writeFileSync(

    envioPath,

`ENVIO SIMULADO

Caso:
${caso}

Fecha:
${new Date().toISOString()}

El paquete fue aprobado para envío.`,

    "utf8"

  );

  return {

    ok: true,

    ruta:
      envioPath

  };

}
