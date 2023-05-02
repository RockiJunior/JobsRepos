import { EstadoExpediente, EstadoTramite } from '@prisma/client';
import { Exception } from 'handlebars';
import Procedimiento from './procedimiento.interface';
import tramiteServices, { TramitesService } from '../services/tramite.services';

class TramiteClass implements Procedimiento {
  private id: number;
  private estado: EstadoTramite | undefined;
  private service: TramitesService;

  constructor(id: number) {
    this.id = id;
    this.service = tramiteServices;
  }

  public async find() {
    const data = await this.service.findById(this.id);

    if (!data) throw new Exception('Tramite not found');

    this.estado = data.estado;

    return data;
  }

  changeState(state: EstadoTramite) {
    this.estado = state;
  }

  saveInDb() {
    this.service.update(this.id, { estado: this.estado });
  }
}

const tramite = new TramiteClass(1);

tramite.find();

export default TramiteClass;
