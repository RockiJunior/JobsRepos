import { Router } from 'express';
import { create, createObleaPDF } from '../utils/pdf';
import Exception from '../utils/Exception';
import { existsSync } from 'fs';
import dayjs from 'dayjs';
import usersServices from '../services/users.services';
import matriculaServices from '../services/matricula.services';
import errorHandler from '../utils/errorHandler';

const router = Router();

router.get('/tramite/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pdf = await create(Number(id));
    res.json(pdf);
  } catch (error) {
    errorHandler(error, res);
  }
});

router.get('/oblea/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) throw new Exception('El id es requerido');

    const usuario = await usersServices.findById(Number(id));

    if (!usuario) throw new Exception('El usuario no existe');

    const matricula = await matriculaServices.getByUserId(usuario.id);

    if (matricula) {
      if (
        !existsSync(
          `/public/archivos/${usuario.id}/oblea/${
            matricula.id
          }/oblea-${dayjs().format('YYYY')}.pdf`
        )
      ) {
        await createObleaPDF(usuario.id);
      }

      res.json(
        `${process.env.SERVER_URL}/public/archivos/${usuario.id}/oblea/${
          matricula.id
        }/oblea-${dayjs().format('YYYY')}.pdf`
      );
    } else {
      throw new Exception('El usuario no tiene matrícula');
    }
  } catch (error) {
    errorHandler(error, res);
  }
});

export default router;
