import { Caratula } from '@prisma/client';
import caratulaServices from '../services/caratula.services';
import Exception from '../utils/Exception';
import { createCaratula } from '../utils/pdf';
import expedienteValidators from './expediente.validators';

export class CaratulaValidator {
  async getAll({
    pagina,
    limite,
    orden,
    columna,
    busqueda
  }: {
    pagina: number;
    limite: number;
    orden: string;
    columna: string;
    busqueda: string;
  }) {
    const caratulaDB = await caratulaServices.findAll({
      pagina,
      limite,
      orden,
      columna,
      busqueda
    });

    const contarCaratulas = await caratulaServices.contarTotalCaratulas(
      busqueda
    );

    const paginasTotales = Math.ceil(contarCaratulas / limite);

    const respuesta = {
      count: contarCaratulas,
      cedulas: caratulaDB,
      pagina,
      paginasTotales,
      orden,
      columna,
      busqueda,
      limite
    };

    return respuesta;
  }

  async getById(id: number) {
    if (!id) {
      throw new Exception('El id de la carátura es requerido');
    }

    const caratula = await caratulaServices.findById(id);

    if (!caratula) {
      throw new Exception('La carátula no existe');
    }
    return caratula;
  }

  async create({
    titulo,
    denunciante,
    denunciado,
    expedienteId
  }: {
    titulo: string;
    denunciante: string;
    denunciado: string;
    expedienteId: number;
  }) {
    if (!titulo) {
      throw new Exception('El titulo de la carátula es requerido');
    }
    if (!denunciante) {
      throw new Exception('El denunciante es requerido');
    }
    if (!denunciado) {
      throw new Exception('El denunciado es requerido');
    }
    if (!expedienteId) {
      throw new Exception('El expediente es requerido');
    }

    const expedienteDB = await expedienteValidators.getByIdForActions(
      expedienteId
    );

    if (expedienteDB.caratula) {
      throw new Exception('La carátula ya fue creada');
    }

    const caratula = await caratulaServices.create({
      titulo,
      denunciante,
      denunciado,
      expedienteId
    });

    const expediente = await expedienteValidators.getByIdForActions(
      expedienteId
    );

    await createCaratula({
      titulo,
      denunciante,
      denunciado,
      expedienteId: expediente.id,
      fecha: expediente.createdAt
    });

    return caratula;
  }

  async update({
    caratulaId,
    data
  }: {
    caratulaId: number;
    data: Partial<Caratula>;
  }) {
    if (!caratulaId) {
      throw new Exception('El id de la carátula es requerido');
    }

    const caratula = await caratulaServices.update({ caratulaId, data });

    return caratula;
  }

  async delete(caratulaId: number) {
    if (!caratulaId) {
      throw new Exception('El id de la carátula es requerido');
    }

    const caratula = await caratulaServices.delete(caratulaId);

    return caratula;
  }
}

export default new CaratulaValidator();
