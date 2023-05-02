import getBase64ImageFromURL from "../../../utils/pdf/getBase64";

const bajaMatriculaProfesional = `
<body style="margin-left: 60px; margin-right: 60px">
<div>

    <img src="{{ logo_large }}" alt="Logo" style="width: 45px; margin: 0; padding: 0; margin-right: 8px; display: none" />
      

  <h1 style="margin-top: 10px; text-align: center">
    Baja Definitiva de Matricula Profesional
  </h1>
  <p style="text-align: center">
    Ciudad Autónoma de Buenos Aires, {{ dia }} de {{ mes }} del {{ anio }}
  </p>

  <p style="line-height: 30px">
    El/la que suscribe: <b>{{datosTramite.nombre}} {{datosTramite.apellido}}</b> <br />
    Tipo de Documento DNI: <b>{{ datosTramite.dni }}</b> <br />
    Matricula CUCICBA Nro: <b>{{ datosTramite.numeroMatricula }}</b> Tomo: <b>{{ datosTramite.tomoMatricula }}</b> Folio:
    <b>{{ datosTramite.folioMatricula }}</b> Legajo: <b>{{ datosTramite.legajoMatricula }}</b> <br />
    Domicilio Legal: <b>{{ datosTramite.domicilioLegal }}</b> <br />
    Domicilio Real: <b>{{ datosTramite.domicilioReal }}</b> <br />
    Telefono: <b>{{ datosTramite.telefonoParticular }}</b>
  </p>

  <p>
    Por la presente vengo a notificarme de la baja definitiva de mi
    matricula profesional, oportunamente requerida habiendo tomado
    conocimiento de la totalidad de las disposiciones atinenetes a la
    resolución por la cual me estoty notificando.
  </p>

  <hr style="border: 1px dashed black; width: 100%" />

  <p>
    * Queda Prohibida a partir de la aceptación de la solicitud la promoción
    a través de cualquier medio ofrecimiento inmobiliario en el ámbito de
    CABA, encontrándose la matricula dada de baja, sido pasible de inicio de
    expediente Administrativo en fiscalización, pudiendo elevarse el mismo
    en denuncia a la justicia penal por ejercicio ilegal y/o en infracción a
    la ley 2340 de CABA., por lo expresado en el articulo 247 del CP.-,
    estando sujeto a las multas y gastos que por dicha transgreción deba
    abonar. <br />
    La presente no implica la aceptación de lo declarado, hasta la
    aprobación definitiva realizada por el H°.C.D., haciéndose saber que la
    baja de matricula aprobada por el H°.C.D. cancela el registro de la
    misma, por lo cual en el caso de pretender ejercer nuevamente deberá
    maticularse nuevamente, abonando los aranceles actuales y cumpliendo los
    requisitos de la ley vigente a ese momento. <br />
    <b>
      "De ser aprobada mi solicitud tomo expreso conocimiento que el CUCICBA
      no me libera de la aceptación a mi pedido de baja por obligaciones
      previamente contraídas ni renuncia a iniciar ninguna acción
      administrativa y/o judicial que a su entender pueda corresponder
      entablar en mi contra, derivada de mi condición de colegiado."
    </b>
  </p>

  <div>
    <span style="font-size: 30px; text-decoration: underline; font-weight: 600;">Baja:</span>
    Definitiva por pedido del matriculado, para volver a la actiidad, deberá
    matricularse nuevamente bajo los requisitos que prevea la ley vigente.
  </div>
  <p>
    <b>
      Se deja constancia que el corredor entrega en este acto la credencial.
      En caso de manifestar extravío o robo de la misma, deberá aportar el
      comprobante de denuncia correspondiente
    </b>
  </p>

  <div style="margin-top: -20px; display: -webkit-flex;flex-direction: row; -webkit-flex-direction: row;justify-content: center; -webkit-justify-content: space-around;">
    <div style="width: 200px; text-align: center;"> <p style="margin-bottom: 38px;"> Firma </p> <hr> </div>
    <div style="width: 200px; text-align: center;"> <p style="margin-bottom: 38px;">Aclaracion</p> <hr> </div>
  </div>
</div>
</body>
`;

export default bajaMatriculaProfesional
