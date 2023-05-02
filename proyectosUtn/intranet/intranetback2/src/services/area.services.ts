import prisma from '../config/db';

class AreaService {
  async getAll() {
    return await prisma.area.findMany({
      orderBy: {
        nombre: 'asc'
      }
    });
  }
}
export default new AreaService();
