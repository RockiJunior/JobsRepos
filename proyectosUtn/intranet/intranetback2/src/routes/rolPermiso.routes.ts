import { Router } from 'express';
import rolPermisoController from '../controllers/rolPermiso.controller';
import { validateTokenEmpleado } from '../utils/jwt';
const router = Router();

router.get(
  '/get_all_roles',
  validateTokenEmpleado,
  rolPermisoController.getAllRoles
);

router.get(
  '/get_all_permisos',
  validateTokenEmpleado,
  rolPermisoController.getAllPermisos
);

router.post(
  '/create_rol',
  validateTokenEmpleado,
  rolPermisoController.createRol
);

router.put(
  '/update_rol/:id',
  validateTokenEmpleado,
  rolPermisoController.updateRol
);

router.delete(
  '/delete_rol/:id',
  validateTokenEmpleado,
  rolPermisoController.deleteRol
);

export default router;
