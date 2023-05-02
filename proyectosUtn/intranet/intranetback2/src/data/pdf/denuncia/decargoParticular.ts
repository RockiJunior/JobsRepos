const descargoParticular = `
                  <body>

    <img src="{{ logo_large }}" alt="Logo" style="width: 45px; margin: 0; padding: 0; margin-right: 8px; display: none" />
                  <div style=" 
                    padding: 50px;
                    width: 650px;
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
                      Atento el estado de autos, y habiéndose radicado ante este Tribunal de Ética y Disciplina, una denuncia en su contra/ por parte del Sr <b>{{ datos.denunciante }} </b>  DNI: </b> {{ datos.dniDenunciante }} </b>. Contra la firma de <b> {{ datos.denunciado }} </b> deberá la misma, determinar quién ha sido el titular matriculado en CUCICBA (de haber más de uno), que haya intervenido en los hechos investigados, a fin de efectuar descargo    
                    </div>

                    <br>

                    <div style="text-align: justify">
                      A tal fin, es que mediante el presente se intima a brindar las explicaciones del caso, debiendo comparecer PERSONALMENTE, en la sede de este Colegio, el día <u><b>{{ datos.dia }} {{ datos.hora }}</b></u>, para hacer entrega del pertinente descargo por escrito, documentación que quisiera aportar y/o hacer las manifestaciones y/o ampliaciones que considere correspondientes, todo ello en original y 1 (una) copia para traslado. 
                    </div>

                    <br>
  
                    <div style="text-align: justify">
                      Sin perjuicio del carácter personal del emplazamiento, se le hace saber al aludido que podrá efectuar su presentación junto a letrado, patrocinante o apoderado, el que deberá acreditar su calidad de tal con matricula correspondiente vigente. A tales fines ponemos a su disposición copia de la documentación referida a la denuncia, para poder hacer el descargo correspondiente y ejercer su derecho de defensa (Cap. III,  art. 7 del Código de Ética Profesional para Corredores Inmobiliarios de la Caba). Pudiendo, retirar una copia de las actuaciones de manera presencial en la Sede de CUCICBA, de lunes a viernes de 10 a 17.00hrs
                      <u><b><i>
                        (previa solicitud de turno a través del siguiente mail: denuncias@colegioinmobiliario.org.ar)
                      </u></b></i>
                    </div>

                    <br>

                    <div style="text-align: justify">
                      Se le hace saber asimismo, que en su presentación  pueden ofrecer elementos probatorios, entre ellos, proponer testigos, en caso de considerar que un tercero pueda brindar testimonio que colabore a esclarecer los hechos investigados, quedando la  viabilidad de dicho testimonio sujeto a la consideración del Tribunal. En cuyo caso deberá expedirse en referencia a los hechos sobre los cuales cada uno de ellos deberá brindar su testimonio, bajo apercibimiento de tener por desistido de dicha prueba. 
                    </div>

                    <br>

                    <div style="text-align: justify">
                      En caso de silencio o incomparecencia injustificada de los mismos, entenderemos que no hará uso del derecho señalado por lo que pasarían las actuaciones a resolverse en forma directa, con los elementos probatorios glosados. 
                    </div>

                    <br>

                    <div style="text-align: justify">
                        Por último, y dentro del mismo plazo otorgado, se le solicita ratifique o rectifique el correo electrónico  oportunamente declarado en CUCICBA. 
                    </div>

                    <br>

                    <div style="text-align: justify">
                      Se encuentra a su disposición, copia del reglamento de Normas de Procedimiento que rige el trámite llevado adelante ante el presente Tribunal. 
                    </div>

                    <br>

                    <div style="text-align: justify">
                      Notifíquese al denunciado.
                    </div>

                  </div>
                  </body>
`

export default descargoParticular
