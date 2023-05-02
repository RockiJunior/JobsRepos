import getBase64ImageFromURL from "../../../utils/pdf/getBase64";

const solicitudLicenciaPasividad = `
<body style="margin-left: 60px; margin-right: 60px">
<div>

    <img src="{{ logo_large }}" alt="Logo" style="width: 45px; margin: 0; padding: 0; margin-right: 8px; display: none" />
      

  <h1 style="margin-top: 10px; text-align: center">
    Solicitud de Licencia por Pasividad {{ anio }}
  </h1>
  <p style="text-align: center">
    Ciudad Autónoma de Buenos Aires, {{ dia }} de {{ mes }} del {{ anio }}
  </p>

  <p style="line-height: 30px">
    El/la que suscribe: <b>{{datosTramite.nombre}} {{datosTramite.apellido}}</b> <br />
    Tipo de Documento DNI: <b>{{ datosTramite.dni }}</b> <br />
    Matricula CUCICBA Nro: <b>{{ datosTramite.numeroMatricula }}</b> Tomo: <b>{{ datosTramite.tomoMatricula }}</b> Folio: <b>{{ datosTramite.folioMatricula }}</b> Legajo: <b>{{ datosTramite.legajoMatricula }}</b> <br />
    Domicilio Legal: <b>{{ datosTramite.domicilioLegal }}</b> <br />
    Domicilio Real: <b>{{ datosTramite.domicilioReal }}</b> <br />
    Telefono: <b>{{ datosTramite.telefonoParticular }}</b> <br />
    Mail: <b>{{ datosTramite.mailParticular }}</b> <br />
  </p>

  <p>
    Por la presente vengo a solicitar la licencia por Pasividad para el año {{ anio }}, la cual podrán tramitarla aquellos que no se enucuentren desarrollando ninguna de las actividades comprendidas en el ejercicio del corretaje inmobiliario, y no posean deudas con la institución de ningún tipo. Resolución N°20 del 29/11/2010 publicada en el BOCBA, el 29/12/2010 <b>y RESOLUCIÓN N°343. FECHA DE EMISIÓN: 18/12/2013 publicada en el BOCABA, el 02/01/2014.</b>
  </p>

  <p>
      Motiva mi solicitud de no ejercer la profesion de corredor inmobiliario en CABA: </br>
      <b> {{ datosTramite.MotivoSolicitud }} </b>
  </p>

  <p>
    La presente se formula con el carácter de declaración jurada, haciéndome plenamente responsable por la veracidad de su contenido comprometiendome a informar en el perentorio plazo de 5 días hábiles cualquier modificación a lo manifestado. <br />
    Declaro bajo juramento que si promociono a través de cualquier medio ofrecimientos inmobiliarios en el ámbito de CABA., encontrándome en goce de licencia por pasividad de mi matricula, serápasible de ser envido mi legajo al H°.T.D., estando sujeto a multas y gastos que por dicha transgresión deba abonar. <br />
    La presente no implica aceptación de lo declarado, hasta la aprobación definitiva realizada por el H°.C.D. <br />
    Se deja constancia en la presente que la <b> Credencial Profesional del Corredor Inmobiliario se encuentra en su legajo </b>. 
  </p>

  <div style="margin-top: -20px; display: -webkit-flex;flex-direction: row; -webkit-flex-direction: row;justify-content: center; -webkit-justify-content: space-around;">
    <div style="width: 200px; text-align: center;"> <p style="margin-bottom: 38px;"> Firma </p> <hr> </div>
    <div style="width: 200px; text-align: center;"> <p style="margin-bottom: 38px;">Aclaracion</p> <hr> </div>
  </div>
</div>
</body>
`;

export default solicitudLicenciaPasividad
