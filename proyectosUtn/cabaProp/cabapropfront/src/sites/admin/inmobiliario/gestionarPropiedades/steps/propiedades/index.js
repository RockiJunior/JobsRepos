import { BodegaForm } from './Bodega';
import { BovedaNichoParcelaForm } from './BovedaNichoParcela';
import { CasaForm } from './Casa';
import { CocheraForm } from './Cochera';
import { ConsultorioForm } from './Consultorio';
import { DepartamentoForm } from './Departamento';
import { EdificioForm } from './Edificio';
import { FondoDeComercioForm } from './FondoDeComercio';
import { HotelForm } from './Hotel';
import { LocalForm } from './Local';
import { OficinaForm } from './Oficina';
import { PHForm } from './Ph';
import { TerrenoForm } from './Terreno';

const forms = {
  1: DepartamentoForm,
  2: CasaForm,
  3: PHForm,
  4: CocheraForm,
  5: ConsultorioForm,
  6: FondoDeComercioForm,
  7: LocalForm,
  8: OficinaForm,
  9: BodegaForm,
  10: TerrenoForm,
  11: HotelForm,
  12: EdificioForm,
  13: BovedaNichoParcelaForm
};

export default forms;
