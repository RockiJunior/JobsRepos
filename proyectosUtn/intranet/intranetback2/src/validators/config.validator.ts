import { Configuracion } from '@prisma/client';
import prisma from '../config/db';
import Exception from '../utils/Exception';

class ConfigValidator {
  async get() {
    const config = await prisma.configuracion.findFirst();

    if (!config) {
      throw new Exception('No se encontró la configuración');
    }

    return config;
  }
  async update(data: Partial<Configuracion>) {
    const config = await prisma.configuracion.findFirst();

    if (!config) {
      throw new Exception('No se encontró la configuración');
    }

    const updatedConfig = await prisma.configuracion.update({
      where: {
        id: config.id
      },
      data
    });

    return updatedConfig;
  }
}

export default new ConfigValidator();
