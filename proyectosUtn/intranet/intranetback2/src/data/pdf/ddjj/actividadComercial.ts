import getBase64ImageFromURL from '../../../utils/pdf/getBase64';

const actividadComercial = `
  <body style="padding: 24px;">
    <div>

    <img src="{{ logo_large }}" alt="Logo" style="width: 45px; margin: 0; padding: 0; margin-right: 8px; display: none" />
      

    {{#if datosTramite.sociedad }}
      <h1 style="text-align: center;"><u> Declaración Jurada De Sociedades y Nombre De Fantasía </u></h1> 
    {{else}}
      <h1 style="text-align: center;"><u>Declaración Jurada De Actividad Comercial</u></h1>
    {{/if}}

    <p style="text-align: center;">Ciudad Autónoma de Buenos Aires, {{ dia }} de {{ mes }} del {{ anio }} </p>

    {{#if datosTramite.sociedad }}
      <p>
        Por medio de la presente y con carácter de Declaración Jurada manifiesto que a la fecha desarrollo  mi actividad comercial (como integrante de la sociedad <b> {{ datosTramite.nombreSociedad }} </b>) <b> {{ datosTramite.nombre }} {{ datosTramite.apellido }} </b> que gira en plaza bajo el nombre de fantasia <b> {{ datosTramite.nombreFantasia }} </b>, con domicilio profesional en la calle <b>{{ datosTramite.domicilioComercial }} - CABA </b> teléfono Profesional <b> {{ datosTramite.telefonoComercial }} </b> con dirección de email <b> {{ datosTramite.emailComercial }} </b>
      </p>

      <p>
        Marca Declarada: <b>{{ datosTramite.nombreSociedad }} </b> titular o Licenciatario <b> {{ datosTramite.nombre }} {{ datosTramite.apellido }} </b>
      </p>

      {{#if datosTramite.marcaRegistrada}}
        <p> 
          {{#if datosTramite.isFacturaProfesional}} Adjunto copia de mi factura profesional <br> {{/if}}
          {{#if datosTramite.isCopiaInpi}} Adjunto copia registrada de mi marca ante la INPI <br> {{/if}}
          {{#if datosTramite.isCopiaCesion}} Adjunto cesión de uso de marca certificada por Escribano Publico <br> {{/if}}
        </p>
      {{/if}}
  
      <p>
        A fin de ampliar mi declaración del día de la fecha, les manifiesto que mi tenencia accionaria en <b> {{ datosTramite.nombreSociedad }} </b> con CUIT Nro <b> {{ datosTramite.cuitCuil }} </b> es de <b>{{ datosTramite.porcentajeSociedad }}%</b>. A fin de justificar mi participación accionaria adjunto los siguientes elementos:
        <ol>
          <li>
            <u> Para las sociedades de hecho: </u>
            <br>
            Constancia de inscripción en la AFIP y copia de la factura comercial 
          </li>
          <li> 
            <u> Para las SRL y S.A. y SAS: </u>
            <br>
            Copia del estatuto de la sociedad donde figure la tenencia accionaria o instrumento que justifique la compra de acciones o cuotas partes.
          </li>
        </ol>
        <br>
        <b>
          Si estos elementos ya figuran en nuestros legajos en oportunidad de la solicitud de matricula y no han sido modificados, no es necesaria la presentación de los mismos nuevamente.
        </b>
        <br>
      </p>

      <p>
        Con carácter de declaracion jurada manifiesto que a la fecha de la presente la <b> {{ datosTramite.nombreSociedad }} </b> CUIT Nro <b> {{ datosTramite.cuitCuil }} </b> se encuentra operando las siguientes sucursales bajo mi responsabilidad:
      </p>

    {{else}}
      <p>
        Por medio de la presente, y con carácter de Declaracion Jurada, manifiesto que a la fecha me encuentro desarrollando la actividad comercial de intermediación inmobiliaria exclusivamente en forma unipersonal y que giro en plaza bajo el nombre de fantasia <b> {{ datosTramite.nombreFantasia }} </b> con domicilio profesional en <b> {{ datosTramite.domicilioComercial }} - CABA </b>, teléfono profesional <b> {{ datosTramite.telefonoComercial }} </b>, con dirección de email: <b> {{ datosTramite.emailComercial }} </b> 
      </p>

      {{#if datosTramite.marcaRegistrada}}
        <p>
          Marca declarada: <b> {{ datosTramite.marcaRegistradaNombre }} </b> (en tramite ante INPI Acta N° 3772387) titular 100% <br>
          
          {{#if datosTramite.isFacturaProfesional}} Adjunto copia de mi factura profesional <br> {{/if}}
          {{#if datosTramite.isCopiaInpi}} Adjunto copia registrada de mi marca ante la INPI <br> {{/if}}
          {{#if datosTramite.isCopiaCesion}} Adjunto cesión de uso de marca certificada por Escribano Publico <br> {{/if}}
            
        </p>
      {{/if}}

      <p>
        Asimismo en este acto, ratifico mi domicilio legal <b> {{ datosTramite.domicilioLegal }} - CABA </b> y de acuerdo a lo establecido en el articulo 10 de la ley 2340, me comprometo dentro de los 5 días de producido, informar por escrito a CUCICBA, de cualquier cambio que afecte la presente declaración.
      </p>

      <p>
        Con carácter de Declaración Jurada, manifiesto que a la fecha presente, mi negocio unipersonal se encuentra operando en plaza bajo el CUIT:  <b> {{ datosTramite.cuitCuil }} </b> con las siguientes sucursales:
      </p>
    {{/if}}

    <table style="border-collapse: collapse;">
      <tr>
        <td style="border: 1px solid #dddddd; padding: 3px"> <h4> Casa central </h4></td>
        <td style="border: 1px solid #dddddd; padding: 5px"></td>
      </tr>
      <tr>
        <td style="border: 1px solid #dddddd; padding: 3px"> Domicilio Profesional </td>
        <td style="border: 1px solid #dddddd; padding: 5px"> <b>{{ datosTramite.domicilioCasaCentral }} </b> </td>
      </tr>
      <tr>
        <td style="border: 1px solid #dddddd; padding: 3px"> Teléfono Profesional </td>
        <td style="border: 1px solid #dddddd; padding: 5px"> <b>{{ datosTramite.telefonoCasaCentral }}</b> </td>
      </tr>
      
      {{#if datosTramite.domicilioSucursal1}} 
        <tr>
          <td style="border: 1px solid #dddddd; padding: 3px"> <h4> Sucursal #1 </h4> </td>
          <td style="border: 1px solid #dddddd; padding: 5px"></td>
        </tr>
        <tr>
          <td style="border: 1px solid #dddddd; padding: 3px"> Domicilio Profesional </td>
          <td style="border: 1px solid #dddddd; padding: 5px">
            <b> {{ datosTramite.domicilioSucursal1 }} </b>
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid #dddddd; padding: 3px"> Teléfono Profesional </td>
          <td style="border: 1px solid #dddddd; padding: 5px">
              <b> {{ datosTramite.telefonoSucursal1 }} </b>
          </td>
        </tr>
      {{/if}}

      {{#if datosTramite.domicilioSucursal2}} 
        <tr>
          <td style="border: 1px solid #dddddd; padding: 3px"> <h4> Sucursal #2 </h4> </td>
          <td style="border: 1px solid #dddddd; padding: 5px"></td>
        </tr>
        <tr>
          <td style="border: 1px solid #dddddd; padding: 3px"> Domicilio Profesional </td>
          <td style="border: 1px solid #dddddd; padding: 5px">
            <b> {{ datosTramite.domicilioSucursal2 }} </b>
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid #dddddd; padding: 3px"> Teléfono Profesional </td>
          <td style="border: 1px solid #dddddd; padding: 5px">
              <b> {{ datosTramite.telefonoSucursal2 }} </b>
          </td>
        </tr>
      {{/if}}

    </table>

    <br>

    {{#if datosTramite.domicilioSucursal2}}
    <div style="page-break-before: always"> 
    {{/if}}
    <u><b> Nota importante: </b></u>

    <p>
      "Tomo conocimiento de que el registro de nombres o marcas posee fines únicamente identificatorios del matriculado, la apelación de la inscripcion a CUCICBA, en relación a solicitudes futuras, no otorga propiedad ni exclusividad de uso en función de lo dispuesto por la ley 22.362".
    </p>

    <p>
      En caso de declarar sucursales, se deberá adjuntar a esta declaracion jurada, copia de la factura comercial de cada sucursal declarada.
    </p>
    {{#if datosTramite.domicilioSucursal2}}
    </div> 
    {{/if}}

    {{#if datosTramite.desafectacionSociedad}}
      <p>
        <b>
          Asi mismo decido desafectarme como titular de la firma {{ datosTramite.nombreSociedad }} desde la presentación del presente
        </b>
      </p>
    {{/if}}

    <p>
      "La presente Declaracion Jurada de Actividad Profesional, junto con la documental adjunta, se encuentran sujetas a verificación, Inspeccion y Aprobación".
    </p>

    <p>
      Sin otro particular, saludos atte.
    </p>


    
    {{#if datosTramite.domicilioSucursal2}}
      <div> 
    {{else}}
      <div style="page-break-before: always; margin-top: 20px">
    {{/if}}

      <p>
        Nombre completo: <b> {{ datosTramite.nombre }} {{ datosTramite.apellido }} </b> <br>
        Matriculacion CUCICBA: <b> {{ datosTramite.numeroMatricula }} </b> <br>
        Tomo: <b> {{ datosTramite.tomoMatricula }} </b> Folio: <b>{{ datosTramite.folioMatricula }} </b><br>
        DNI: <b> {{ datosTramite.dni }} </b> <br>
      </p>
      
      
      <br>
  
      <p>
        _________________ <br>
        Firma del matriculado
        </p>
    </div>


    <div style="padding: 20px;">
      <table style="width: 100%; border-collapse: collapse">
        <tr>
          <td style="border: 1px solid black; text-align: center;"> Recibió Formulario </td>
          <td style="border: 1px solid black; text-align: center;"> Fecha </td>
        </tr>
        <tr>
        <td style="border: 1px solid black; padding: 20px"></td>
        <td style="border: 1px solid black; padding: 20px"></td>
        </tr>
        <tr>
          <td style="border: 1px solid black; text-align: center;">  Controlo firma con registros </td>
          <td style="border: 1px solid black; text-align: center;">  Fecha </td>
        </tr>
        <tr>
        <td style="border: 1px solid black; padding: 20px"></td>
        <td style="border: 1px solid black; padding: 20px"></td>
        </tr>
        <tr>
          <td style="border: 1px solid black; text-align: center;">  Actualizó base de datos </td>
          <td style="border: 1px solid black; text-align: center;">  Fecha </td>
        </tr>
        <tr>
          <td style="border: 1px solid black; padding: 20px"></td>
          <td style="border: 1px solid black; padding: 20px"></td>
        </tr>
      </table>
    </div>

    <p>
      Este formulario debe ser archivado en el legajo personal de cada matriculado. El legajo de este matriculado es el N° {{ datosTramite.legajo }}.
    </p>


    </div>
  </body>`;

export default actividadComercial