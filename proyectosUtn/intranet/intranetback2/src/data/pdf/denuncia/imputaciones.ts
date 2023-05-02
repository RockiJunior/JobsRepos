const imputacion = `
<body>
    <img src="{{ logo_large }}" alt="Logo" style="width: 45px; margin: 0; padding: 0; margin-right: 8px; display: none" />
              <div style=" 
                display: webkit-flex;
                -webkit-flex-direction: column;
                -webkit-justify-content: space-between;
                -webkit-align-items: center;
                -webkit-vertical-align: middle;
                text-align: center;
              ">
                
                <div style="text-align: right; margin-right: 7%">
                  <p> Ciudad de Buenos Aires, {{ dia }} de {{ mes }} del {{ anio }} </p>
                </div>

                <div style="text-align: center">
                  <h2> {{ datos.titulo }} </h2>
                </div>

                <div style="text-align: justify; margin: 0 7% ">
                  A fin de evitar futuras nulidades y garantizar el derecho de defensa del corredor, hágase saber que, en virtud de las constancias obrantes en autos, se procederá a investigar en base a las siguientes imputaciones, la posible negligencia del mismo, en virtud de haber, {{ datos.motivo }}, infringiendo lo normado por los articulos:
                  <ul>
                  {{#each datos.imputaciones }}
                    <li style="list-style: none"> <b> {{ this }} </b></li>
                  {{/each}}
                  </ul>
                  
                  <br> <br>

                  En virtud de lo expuesto, pasen las actuaciones al Tribunal de Ética y Disciplina. Notifíquese
                </div>
    
              </div>
            </body>
`;

export default imputacion;
