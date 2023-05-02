import getBase64ImageFromURL from '../../../utils/pdf/getBase64';

const noActividadComercial = `
  <body style="padding: 24px;">
    <div>

    <img src="{{ logo_large }}" alt="Logo" style="width: 45px; margin: 0; padding: 0; margin-right: 8px; display: none" />
      
    <h1 style="text: center;">Declaración Jurada De Actividad No Comercial</h1>

    <p>Ciudad Autónoma de Buenos Aires, {{ dia }} de {{ mes }} del {{ anio }} </p>
    

    <p>
      Por medio de la presente y con carácter de Declaración Jurada, manifiesto que a la fecha <b> NO </b> estoy desarrollando actividad de intermediacion inmobiliaria de ningún tipo, en forma personal ni como titular matriculado al frente de ningún tipo de sociedad o asociacion comercial para tales fines. 
    </p>

    <p>
      Asimismo en este acto, ratifico mi domicilio legal en <u> <b> {{ datosTramite.domicilioLegal }} </b> - <b>CABA</b> / <b>CP</b> {{ datosTramite.codigoPostalLegal }} </u> y de acuerdo a lo establecido en el articulo 10 de la ley 2340, me comprometo dentro de los 5 dias de producido, informar por escrito a CUCICBA, de cualquier cambio que modifique la presente declaración.
    </p>
    <p>
      Sin otro particular, los saludo atte.
    </p>


    <p>
      Nombre completo: <b> {{ datosTramite.nombre }} {{ datosTramite.apellido }} </b> <br>
      Matriculacion CUCICBA: <b> {{ datosTramite.numeroMatricula }} </b> <br>
      Tomo <b> {{ datosTramite.tomoMatricula }} </b> Folio <b>{{ datosTramite.folioMatricula }} </b><br>
      DNI: <b> {{ datosTramite.dni }} </b> <br>
    </p>
      
    <br>
  
    <p>
    _________________ <br>
    Firma del matriculado
    </p>
    
    </div>
  </body>`;

export default noActividadComercial
