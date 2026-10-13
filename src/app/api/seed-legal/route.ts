import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ConfiguracionModel from "@/models/Configuracion";

const POLITICA = `POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES
Asociación de Usuarios del Servicio de Acueducto Vereda San Jorge y Barroblanco — AUSAVESJAB
NIT: 830.041.635-2
Vereda San Jorge y Barroblanco, Zipaquirá, Cundinamarca, Colombia
Correo electrónico: ausavesjab23@gmail.com
Fecha de última actualización: octubre de 2026

1. IDENTIFICACIÓN DEL RESPONSABLE DEL TRATAMIENTO
La Asociación de Usuarios del Servicio de Acueducto Vereda San Jorge y Barroblanco — AUSAVESJAB, identificada con NIT 830.041.635-2, con domicilio en la Vereda San Jorge y Barroblanco, municipio de Zipaquirá, departamento de Cundinamarca, Colombia, actúa como Responsable del Tratamiento de los datos personales recolectados en el marco de la prestación del servicio de acueducto comunitario.

2. MARCO LEGAL
El tratamiento de datos personales se rige por la Constitución Política de Colombia (artículo 15), la Ley 1581 de 2012 «Ley de Protección de Datos Personales», el Decreto Reglamentario 1377 de 2013 y las demás normas que las complementen, modifiquen o sustituyan.

3. DATOS PERSONALES RECOLECTADOS
AUSAVESJAB recopila los siguientes datos de sus asociados y usuarios del servicio:
• Nombre completo y documento de identidad (cédula de ciudadanía o NIT).
• Dirección del predio y nombre del predio o finca.
• Número de teléfono y/o celular.
• Correo electrónico (cuando el usuario lo suministre voluntariamente).
• Sector y vereda de ubicación del predio.
• Información de consumo de agua y estado de obligaciones con la asociación.

4. FINALIDADES DEL TRATAMIENTO
Los datos personales se tratan exclusivamente para:
a) Gestionar la vinculación, inscripción y registro de asociados y usuarios del servicio.
b) Facturar, cobrar y administrar el servicio de acueducto.
c) Atender peticiones, quejas, reclamos y recursos (PQRS).
d) Cumplir obligaciones legales y regulatorias ante la Superintendencia de Servicios Públicos Domiciliarios, la DIAN y demás entidades de control competentes.
e) Comunicar al usuario información relevante sobre el servicio, cortes, mantenimientos y asambleas de la asociación.
f) Elaborar estadísticas internas de cobertura y calidad del servicio, sin identificar individualmente a los usuarios en publicaciones externas.

5. DERECHOS DEL TITULAR
Todo titular de datos personales tiene derecho a:
• Conocer, actualizar y rectificar sus datos personales.
• Solicitar prueba de la autorización otorgada.
• Ser informado sobre el uso que se ha dado a sus datos.
• Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la ley.
• Revocar la autorización y/o solicitar la supresión de sus datos, salvo que exista obligación legal o contractual que impida hacerlo.
• Acceder gratuitamente a sus datos personales que hayan sido objeto de tratamiento.

6. MECANISMOS PARA EJERCER LOS DERECHOS
El titular o su representante puede ejercer sus derechos enviando comunicación escrita o correo electrónico a ausavesjab23@gmail.com, indicando nombre completo, documento de identidad, descripción clara de la solicitud y datos de contacto para respuesta. AUSAVESJAB atenderá la solicitud dentro de los plazos establecidos por la Ley 1581 de 2012.

7. TRANSFERENCIA Y TRANSMISIÓN DE DATOS
Los datos personales no se venden, comercializan ni comparten con terceros, salvo en los siguientes casos: (i) cuando la ley o una autoridad competente lo exija expresamente; (ii) cuando sea necesario para la prestación del servicio mediante proveedores o aliados que actúan como Encargados del Tratamiento bajo acuerdo de confidencialidad.

8. SEGURIDAD DE LA INFORMACIÓN
AUSAVESJAB adopta las medidas técnicas, humanas y administrativas necesarias para garantizar la seguridad de los datos personales y evitar su adulteración, pérdida, consulta, uso o acceso no autorizado.

9. VIGENCIA
Esta Política rige a partir de su publicación y permanece vigente mientras AUSAVESJAB continúe con sus actividades. Cualquier modificación sustancial será informada a los titulares por los medios habituales de comunicación de la asociación.`;

const TERMINOS = `TÉRMINOS Y CONDICIONES DE USO DEL SITIO WEB
Asociación de Usuarios del Servicio de Acueducto Vereda San Jorge y Barroblanco — AUSAVESJAB
Fecha de última actualización: octubre de 2026

1. ACEPTACIÓN
El acceso y uso del sitio web de AUSAVESJAB implica la aceptación plena y sin reservas de los presentes Términos y Condiciones. Si no está de acuerdo con alguna de estas disposiciones, le solicitamos abstenerse de utilizar el sitio.

2. OBJETO DEL SITIO WEB
Este sitio web tiene como propósito informar a la comunidad de usuarios y asociados del acueducto sobre la organización, su historia, las juntas directivas, los documentos e informes de gestión, los avisos importantes y los canales de contacto. La información publicada es de carácter institucional y de transparencia comunitaria.

3. ACCESO AL PANEL PRIVADO
El panel de administración interno («Acceso interno») está reservado exclusivamente al equipo directivo y al personal autorizado por AUSAVESJAB. El uso no autorizado de credenciales ajenas constituye una infracción legal y podrá dar lugar a las acciones correspondientes conforme a la normativa colombiana vigente, incluyendo la Ley 1273 de 2009 sobre delitos informáticos.

4. PROPIEDAD INTELECTUAL
Los contenidos del sitio (textos, imágenes, logotipos y diseño gráfico) son propiedad de AUSAVESJAB o de sus respectivos autores y están protegidos por las normas de derechos de autor. Queda prohibida su reproducción total o parcial sin autorización escrita de la asociación.

5. EXACTITUD DE LA INFORMACIÓN
AUSAVESJAB procura mantener actualizada la información publicada; no obstante, no garantiza la exactitud, integridad o vigencia de todos los contenidos en todo momento. La información de esta página es complementaria y no reemplaza las comunicaciones oficiales directas entre la asociación y sus usuarios.

6. LIMITACIÓN DE RESPONSABILIDAD
AUSAVESJAB no se hace responsable por:
• Daños o perjuicios derivados del uso incorrecto de la información publicada.
• Interrupciones del acceso al sitio causadas por fallas técnicas, mantenimiento o causas ajenas al control de la asociación.
• Contenidos de sitios externos a los que se pueda enlazar desde este portal.

7. PROTECCIÓN DE DATOS PERSONALES
El tratamiento de datos personales se rige por la Política de Tratamiento de Datos Personales de AUSAVESJAB, disponible en este mismo sitio, de conformidad con la Ley 1581 de 2012.

8. LEY APLICABLE Y JURISDICCIÓN
Los presentes Términos y Condiciones se rigen por las leyes de la República de Colombia. Cualquier controversia derivada de su interpretación o aplicación será resuelta ante los jueces y tribunales competentes del municipio de Zipaquirá, Cundinamarca.

9. MODIFICACIONES
AUSAVESJAB se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigencia desde su publicación en el sitio web.

10. CONTACTO
Para consultas sobre estos términos, comuníquese con AUSAVESJAB a través de los canales indicados en la sección de contacto de este sitio.`;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    if (searchParams.get("key") !== "ausavesjab2026") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    await ConfiguracionModel.findOneAndUpdate(
      {},
      { politicaDatos: POLITICA, terminosCondiciones: TERMINOS },
      { upsert: true }
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
