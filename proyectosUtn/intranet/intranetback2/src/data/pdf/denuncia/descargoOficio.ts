const descargoOficio = `
<body>
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
                      <h2> <i> Expediente {{ datos.numeroExpediente }} - CUCICBA C/ {{ datos.denunciado }} S/ Presunta infracción </i> </h2>
                    </div>

                    <br>

                    <div style="text-align: justify">
                      Atento el estado de autos, y encontrándose en curso ante este Tribunal de Ética y Disciplina, una denuncia de oficio contra el/la matriculado/a <b> {{ datos.denunciado }}</b>, matricula CUCICBA Nº <b>{{ datos.matricula }}</b>, es que mediante el presente se lo íntima a  efectuar descargo. 
                    </div>

                    <br>
    
                    <div style="text-align: justify">
                      A tal fin, <u><b> se le otorga en primer término, plazo de 15 días hábiles, contados desde la notificación del presente a los fines del retiro de copias del expediente </b></u> para su análisis y posterior ejercicio de su derecho de defensa. 
                    </div>

                    <br>
  
                    <div style="text-align: justify">
                      Para ello, deberá solicitar turno, a través del siguiente mail: <u><b>denuncias@colegioinmobiliario.org.ar</b></u>, otorgándosele fecha para concurrir de manera presencial en la Sede de CUCICBA, a los fines de hacerse de las copias. 
                    </div>

                    <br>

                    <div style="text-align: justify">
                      Por consultas relativas al curso de la tramitación de la causa, deberá específicamente indicarlo en el correo electrónico que remita, a los fines de su consideración, de lo contrario se concederá el turno únicamente para el retiro de copias. 
                    </div>

                    <br>

                    <div style="text-align: justify">
                      Vencido dicho plazo, <u><b>contará con un nuevo plazo de 15 días hábiles a los fines de presentar su descargo escrito, mediante nota debidamente rubricada</b></u>, por Mesa de Entradas se CUCICBA, lo que podrá efectuar de lunes a viernes de 09 a 17 hrs. en la sede de Alsina 1382, pudiendo además efectuar las manifestaciones y/o ampliaciones que considere correspondientes y/o aportar documental en caso de corresponder. 
                    </div>

                    <br>

                    <div style="text-align: justify">
                      De optar por ejercer su derecho de defensa de manera presencial,  deberá solicitar específicamente, se fije fecha de audiencia a tales efectos. 
                    </div>

                    <br>

                    <div style="text-align: justify">
                      Sin perjuicio del carácter personal del emplazamiento, se le hace saber al aludido que podrá efectuar su presentación junto a letrado, patrocinante o apoderado, el que deberá acreditar su calidad de tal con matricula correspondiente vigente.
                    </div>

                    <br>

                    <div style="text-align: justify">
                      Se le hace saber asimismo, que en su presentación  pueden ofrecer elementos probatorios, entre ellos, proponer testigos, en caso de considerar que un tercero pueda brindar testimonio que colabore a esclarecer los hechos investigados, quedando la  viabilidad de dicho testimonio sujeto a la consideración del Tribunal. En cuyo caso deberá expedirse en referencia a los hechos sobre los cuales cada uno de ellos deberá brindar su testimonio, bajo apercibimiento de tener por desistido de dicha prueba. En caso de silencio o incomparecencia injustificada de los mismos, entenderemos que no hará uso del derecho señalado por lo que pasarían las actuaciones a resolverse en forma directa, con los elementos probatorios glosados. 
                    </div>

                    <br>

                    <div style="text-align: justify">
                      Por último, y dentro del mismo plazo otorgado, se le solicita ratifique o rectifique el correo electrónico oportunamente declarado en CUCICBA. Notifíquese. 
                    </div>
                  </div>
</body>
`

export default descargoOficio
