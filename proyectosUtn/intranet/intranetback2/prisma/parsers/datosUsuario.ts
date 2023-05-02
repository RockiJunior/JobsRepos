/* import prisma from '../../src/config/db';

const main = async () => {
  try {
    const tramites = await prisma.tramite.findMany({
      include: {
        carpeta: { include: { usuario: true } }
      }
    });

    for (const tramite of tramites) {
      let datoUsuario;

      if (tramite.carpeta?.usuario) {
        datoUsuario = await prisma.datosUsuario.create({
          data: {
            apellido: tramite.carpeta.usuario.apellido,
            dni: tramite.carpeta.usuario.dni,
            nombre: tramite.carpeta.usuario.nombre
          }
        });
      } else {
        const inputValues = await prisma.inputsValues.findMany({
          where: {
            tramiteId: tramite.id
          }
        });

        const dni = inputValues.find((iv) => iv.inputNombre === 'dni')?.value;
        const nombre = inputValues.find(
          (iv) => iv.inputNombre === 'nombre'
        )?.value;
        const apellido = inputValues.find(
          (iv) => iv.inputNombre === 'apellido'
        )?.value;

        datoUsuario = await prisma.datosUsuario.create({
          data: {
            apellido: apellido,
            dni: dni,
            nombre: nombre
          }
        });
      }

      await prisma.tramite.update({
        where: {
          id: tramite.id
        },
        data: {
          datosUsuarioId: datoUsuario.id
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); */
