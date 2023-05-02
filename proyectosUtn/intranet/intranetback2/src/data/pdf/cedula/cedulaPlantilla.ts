const cedula = `<body>
<header>
  <img src="{{ logo_large }}" alt="Logo" style="width: 45px; margin: 0; padding: 0; margin-right: 8px; display: none" />
    <div style=" 
      padding: 10px;
      display: webkit-flex;
      -webkit-flex-direction: column;
      -webkit-justify-content: space-between;
      -webkit-align-items: center;
      -webkit-vertical-align: middle;
      text-align: center;
    ">
    </div>
</header>
<main style="text-align: center">
    <p style=" text-align: start; margin-left: 10%; margin-right: 10%;">
        Colegio Unico de Corredores Inmobiliarios de la Ciudad de Buenos Aires - CUCICBA
        <br />
        <br />
        <br />
        Adolfo Alsina 1382, Ciudad Autónoma de Buenos Aires
        <br />
        <br />
        <br />
    </p>
    <p style=" text-align: start; margin-left: 10%;">
        Número de Orden: {{ datos.cedulaNumero}}
        <br />
        <br />
        {{datos.usuarioNombreCompleto}}
        <br />
        <br />
        {{ datos.cuil}}
    </p>
    <h5 style="text-align: center;">
        DOMICILIO ELECTRONICO CONSTITUIDO
    </h5>
    <h5 style=" text-align: start; margin-left: 10%;">
        CARACTER:
    </h5>
    <p style=" margin-left: 10%; margin-right: 5%; text-align: justify; text-indent: 7%;">
        {{ datos.cedulaDescripcion}}
    </p>

    <p style=" text-align: start; margin: 3% 0 0 10%;">
        Queda Usted debidamente notificado.
    </p>
</main>
<footer>
    <div style="text-align: left; margin-left: 10%;">
        <p> Ciudad de Buenos Aires, {{ dia }} de {{ mes }} del {{ anio }} </p>
    </div>
</footer>
</body>`;

export default cedula;
