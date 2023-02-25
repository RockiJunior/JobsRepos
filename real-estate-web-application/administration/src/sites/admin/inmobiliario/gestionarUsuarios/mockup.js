export const tablaSucursales =[
  {
    branchOfficeId: 1,
    active: false,
    roleId: null
  },
  {
    branchOfficeId: 2,
    active: false,
    roleId: null
  },
  {
    branchOfficeId: 3,
    active: false,
    roleId: null
  }
]

export const myProfile = {
  firstName: 'Juani',
  lastName: 'Sabbatini',
  email: 'juanisabbatini@gmail.com',
  dni: '4064965',
  phone: "+541138554938",
  password: 'juani123',
  roles: [
    {
      sucursalId: 5,
      sucursalName: '1',
      roleId: 33,
      roleName: 'Gerente'
    },
    {
      sucursalId: 7,
      sucursalName: '2',
      roleId: 29,
      roleName: 'Administrador'
    }
  ]
};

export const myRoles = [
  { roleId: 23, roleName: 'Gerente', sucursalId: 15, sucursalName: 'Sucursal 28', permissions: ["Crear avisos", "Eliminar Avisos", "Crear usuarios"] },
  { roleId: 22, roleName: 'Inmobiliario', sucursalId: 5, sucursalName: 'Sucursal 20', permissions: ["Editar avisos", "Responder mensajes", "Crear avisos"] }
]