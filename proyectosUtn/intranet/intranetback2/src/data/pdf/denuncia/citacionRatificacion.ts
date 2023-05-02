const citacionRatificacion = `
  <body style="padding: 24px;">
  <img src="{{ logo_large }}" alt="Logo" style="width: 45px; margin: 0; padding: 0; margin-right: 8px; display: none" />
              <div style=" 
                padding: 50px;
                display: webkit-flex;
                -webkit-flex-direction: column;
                -webkit-justify-content: space-between;
                -webkit-align-items: center;
                -webkit-vertical-align: middle;
                text-align: center;
              ">
                <div style="text-align: right">
                  <p> Ciudad de Buenos Aires, {{ dia }} de {{ mes }} del {{ anio }} </p>
                </div>

                <div style="text-align: center">
                  <h2> <i> Expediente {{ datos.expedienteNumero }} - {{ datos.denunciante }} C/ {{ datos.denunciado }} S/ Denuncia </i> </h2>
                </div>

                <br>

                <div style="text-align: justify">
                Atento el estado de autos, y habiendo Ud. radicado una denuncia ante este Tribunal de Ética y Disciplina contra el matriculado <b> {{ datos.denunciado }} </b>, matricula CUCICBA Nº <b> {{ datos.matricula }} </b>., titular de <b> {{ datos.inmobiliaria }} </b> la cual se encuentra registrada bajo el expte. Nº <b>{{ datos.expedienteNumero }} </b>, <b>DEBERÁ LA DENUNCIANTE</b> concurrir <b>PERSONALMENTE</b> a la sede de este Colegio, sito en Adolfo Alsina 1382 de la Ciudad de Buenos Aires, el día <b>{{ datos.fecha }} {{ datos.hora }}</b>, a los efectos de ratificar su presentación y aportar la documentación que posea sobre la misma, debiendo concurrir con los originales correspondientes para su cotejo, más un juego de fotocopias para traslado (Cap. III, art. 7 del Código de Ética Profesional para Corredores Inmobiliarios de la CABA).
                </div>

                <br>

                <div style="text-align: justify">
                  Sin perjuicio del carácter personal del emplazamiento, se le hace saber que podrá efectuar dicha presentación junto a un letrado, patrocinante o apoderado, en caso de considerarlo necesario, el que deberá acreditar y exhibir su calidad de tal con matricula correspondiente vigente.  
                </div>

                <br>
  
                <div style="text-align: justify">
                  En el mismo acto pueden ofrecer y/o ampliar elementos probatorios, entre ellos, proponer testigos, en caso de considerar que un tercero pueda brindar testimonio de los hechos investigados y que colabore a esclarecer los hechos investigados, quedando la viabilidad de dicho testimonio sujeta a la consideración del Tribunal. 
                </div>

                <br>

                <div style="text-align: justify">
                  Debiendo asimismo, en caso de haber ofrecido oportunamente testigos en el formulario de denuncia, <b>expedirse en referencia a los hechos sobre los cuales cada uno de ellos deberá brindar su testimonio, bajo apercibimiento de tener por desistido de dicha prueba. </b>
                </div>

                <br>

                <div style="text-align: justify">
                  En caso de silencio o incomparecencia injustificada, se procederá al archivo de las actuaciones, para lo cual comenzarán a regir los plazos de prescripción establecidos en el art. 46 de la ley 2340. 
                </div>

                <br>

                <div style="text-align: justify">
                  Por último, y dentro del mismo plazo otorgado, se le solicita ratifique o rectifique correo electrónico oportunamente declarado en formulario de denuncias de CUCICBA.
                </div>

                <br>

                <div style="text-align: justify">
                  Se encuentra a su disposición, copia del reglamento de Normas de Procedimiento que rige el trámite llevado adelante ante el presente Tribunal. Notifíquese. 
                </div>
              </div>
</body>
`

export default citacionRatificacion