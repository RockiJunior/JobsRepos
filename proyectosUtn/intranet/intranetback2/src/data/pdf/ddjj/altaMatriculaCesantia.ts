import getBase64ImageFromURL from "../../../utils/pdf/getBase64";

const altaMatriculacionCesantiaText = `
<body style="margin-left: 60px; margin-right: 60px">
<div>

    <img src="{{ logo_large }}" alt="Logo" style="width: 45px; margin: 0; padding: 0; margin-right: 8px; display: none" />
      

  <h1 style="margin-top: 10px; text-align: center">
    Solicitud de Alta de Matricula Profesional
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
    Por medio de la presente solicito:
    <div style="border: 1px solid black; text-align: center; padding: 5px;">
      ALTA DE MATRICULACIÓN
    </div>
  </p>

  <p>
    Motiva mi solicitud haber estado <b> Cesante </b> en la matricula profesional </br>
    Aprobada por el H°. Consejo Directivo el {{ datosTramite.fechaAprobado }} por acta N° 217
  </p>

  <p>
    Solicitando el alta por: Estar preparándome para comenzar la acactividad profesional. Habiendo abonado matrícula{{ datosTramite.añosDeuda }} más fianza, más gastos de cesantía, comprometiendome a presentar Declaracion Jurada de Actividad Comercial acompañando factura de honorarios en un plazo de 5 días de comenzada la actividad profesional.-
  </p> 


  <p>
    La presente se formula con el carácter de declaración jurada, haciéndome plenamente responsable por la veracidad de su contenido comprometiendome a informar en el perentorio plazo de 5 días hábiles cualquier modificación a lo manifestado. <br />
  </p>

  <div style="margin-top: -20px; display: -webkit-flex;flex-direction: row; -webkit-flex-direction: row;justify-content: center; -webkit-justify-content: space-around;">
    <div style="width: 200px; text-align: center;"> <p style="margin-bottom: 38px;"> Firma </p> <hr> </div>
    <div style="width: 200px; text-align: center;"> <p style="margin-bottom: 38px;">Aclaracion</p> <hr> </div>
  </div>
</div>
</body>
`;

export default altaMatriculacionCesantiaText
