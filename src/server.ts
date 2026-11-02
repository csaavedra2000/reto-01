import express, { Request, Response } from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import {
  ChatCompletionMessageToolCall
} from "openai/resources/chat/completions";

import {
  leerSolicitud,
  mapearCampos,
  LeerSolicitudResult,
  MapearCamposResult,
  generarFormulario,
GenerarFormularioResult,
armarPaquete,
ArmarPaqueteResult
} from "./tools/proveedor";

dotenv.config();

const app = express();

app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* =====================================================
   TYPES
===================================================== */

interface LeerSolicitudArgs {
  caso: string;
}

/* =====================================================
   TOOLS DEFINITION
===================================================== */

const tools = [
   {
    type: "function" as const,

    function: {
      name: "leerSolicitud",

      description:
        "Reads a supplier registration request from a case folder",

      parameters: {
        type: "object",

        properties: {
          caso: {
            type: "string",

            description:
              "Case name located under fixtures/casos/"
          }
        },

        required: ["caso"]
      }
    }
  },
   {
    type: "function" as const,

    function: {
      name: "mapearCampos",

      description:
        "Maps supplier registration fields against master data",

      parameters: {
        type: "object",

        properties: {},

        required: []
      }
    }
  },    
  {
  type: "function" as const,

  function: {

    name: "generarFormulario",

    description:
      "Generates supplier registration form",

    parameters: {

      type: "object",

      properties: {},

      required: []

    }

  }
},
{
  type: "function" as const,

  function: {

    name: "armarPaquete",

    description:
      "Creates supplier registration package and checklist",

    parameters: {

      type: "object",

      properties: {},

      required: []

    }

  }

}
];

/* =====================================================
   HEALTH CHECK
===================================================== */

app.get("/health", (_: Request, res: Response) => {
  res.json({
    ok: true,
    service: "Agent Backend",
    model: process.env.MODEL
  });
});

/* =====================================================
   FUNCTION CALLING TEST
===================================================== */

app.get(
  "/test-tool",
  async (_: Request, res: Response) => {

    try {

      const response =
        await client.chat.completions.create({
          model: process.env.MODEL || "gpt-4o",

          messages: [
            {
              role: "user",
              content:
                //"Read supplier request ec-corp-andina"
                //"Map supplier registration fields"
                //"Generate supplier form"
                //"Create supplier package"
                "Read supplier request ec-corp-andina"
            }
          ],

          tools

        });

        console.log(
  JSON.stringify(
    response.choices[0].message,
    null,
    2
  )
);

      const toolCall =
  response.choices[0].message.tool_calls?.[0] as
  ChatCompletionMessageToolCall | undefined;

      if (!toolCall) {

        return res.json({
          message: "No tool was called"
        });

      }

      if (toolCall.type !== "function") {

        return res.json({
          message: "Unsupported tool type"
        });

      }

      const toolName =
        toolCall.function.name;

      switch (toolName) {

        case "leerSolicitud": {

          const args: LeerSolicitudArgs =
  JSON.parse(toolCall.function.arguments);

          const resultado: LeerSolicitudResult =
            leerSolicitud(args.caso);

          return res.json({
            tool: toolName,
            result: resultado
          
        });

        }

       

      case "mapearCampos": {

  const resultado =
    mapearCampos([

      {
        etiqueta:
          "Razón social"
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

  return res.json({

    tool:
      toolName,

    result:
      resultado

  });

}
case "generarFormulario": {

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

  const resultado:
    GenerarFormularioResult =
      generarFormulario(
        "ec-corp-andina",
        mapeo
      );

  return res.json({

    tool:
      toolName,

    result:
      resultado

  });

}
case "armarPaquete": {

  const resultado:
    ArmarPaqueteResult =

      armarPaquete(
        "ec-corp-andina"
      );

  return res.json({

    tool:
      toolName,

    result:
      resultado

  });

}
       default:

          return res.status(400).json({
            error:
              `Unknown tool: ${toolName}`
          });

        }

    } catch (error) {

      console.error(
        "OpenAI Error:",
        error
      );

      return res.status(500).json({
        error:
          "Error invoking OpenAI"
      });

    }

  }
);

/* =====================================================
   SERVER START
===================================================== */

const PORT =
  Number(process.env.PORT) || 3000;

app.get(
  "/test-paquete",
  (_: Request, res: Response) => {

    const resultado =
      armarPaquete(
        "ec-corp-andina"
      );

    res.json(
      resultado
    );

  }
);

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});
app.get(
  "/test-formulario",
  (_: Request, res: Response) => {

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

    const resultado =
      generarFormulario(
        "ec-corp-andina",
        mapeo
      );

    res.json(resultado);

  }
);