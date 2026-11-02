import {
  leerSolicitud,
  mapearCampos,
  generarFormulario,
  armarPaquete,
  simularEnvio
}
from "./src/tools/proveedor";

function separador() {

  console.log(
    "=================================="
  );

}

async function main() {

  const caso =
    "ec-corp-andina";

  separador();

  console.log(
    `CASO: ${caso}`
  );

  separador();

  const solicitud =
    leerSolicitud(caso);

  console.log(
    "\nCliente:"
  );

  console.log(
    solicitud.cliente
  );

  console.log(
    "\nPais:"
  );

  console.log(
    solicitud.pais
  );

  console.log(
    "\nFormato:"
  );

  console.log(
    solicitud.formato
  );

  console.log(
    "\nCampos solicitados:"
  );

  console.log(
    solicitud.campos.length
  );

  console.log(
    "\nSoportes solicitados:"
  );

  console.log(
    solicitud.soportes.length
  );

  const mapeo =
    mapearCampos(
      solicitud.campos
    );

  console.log(
    "\nCampos completos:"
  );

  console.log(
    mapeo.llenos.length
  );

  console.log(
    "\nCampos faltantes:"
  );

  console.log(
    mapeo.faltantes.length
  );

  console.log(
    "\nCampos con confirmacion:"
  );

  console.log(
    mapeo.requiere_confirmacion.length
  );

  const formulario =
    generarFormulario(
      caso,
      mapeo
    );

  console.log(
    "\nFormulario:"
  );

  console.log(
    formulario.ruta
  );

  const paquete =
    armarPaquete(
      caso
    );

  console.log(
    "\nPaquete:"
  );

  console.log(
    paquete.ruta
  );

  separador();


const envio =
    simularEnvio(
      caso,
      true
    );

  console.log(
    "\nEnvio:"
  );

  console.log(
    envio.ruta
  );

  separador();

}

main();