export const tablaRoles = [
    {
        name: "Avisos",
        permissions: [
            {
                id: 1,
                value: "Ver avisos",
                description: "Permite consultar los avisos publicados y su información"
            },
            {
                id: 2,
                value: "Publicar avisos",
                description: "Permite publicar nuevos avisos"
            },
            {
                id: 3,
                value: "Editar avisos",
                description: "Permite editar avisos publicados"
            },
            {
                id: 4,
                value: "Eliminar avisos",
                description: "Permite eliminar avisos publicados"
            }
        ]
    },
    {
        name: "Roles",
        permissions: [
            {
                id: 7,
                value: "Ver roles",
                description: "Permite consultar los roles creados y sus permisos asignados"
            },
            {
                id: 8,
                value: "Crear roles",
                description: "Permite crear nuevos roles y asignarles permisos habilitados"
            },
            {
                id: 9,
                value: "Editar roles",
                description: "Permite editar roles y cambiarle sus permisos"
            },
            {
                id: 10,
                value: "Eliminar roles",
                description: "Permite eliminar roles creados"
            }
        ]
    },
    {
        name: "Consultas",
        permissions: [
            {
                id: 5,
                value: "Contestar consultas",
                description: "Permite contestar consultas de clientes sobre propiedades"
            }
        ]
    },
    {
        name: "Sucursal",
        permissions: [
            {
                id: 6,
                value: "Editar sucursal",
                description: "Permite editar algunos datos de la sucursal"
            }
        ]
    },
    {
        name: "Usuarios",
        permissions: [
            {
                id: 11,
                value: "Ver usuarios",
                description: "Permite consultar los usuarios creados y sus roles asignados"
            },
            {
                id: 12,
                value: "Crear usuarios",
                description: "Permite crear nuevos usuarios y asignarles un rol"
            },
            {
                id: 13,
                value: "Editar usuarios",
                description: "Permite editar usuarios y cambiarle sus roles"
            },
            {
                id: 14,
                value: "Eliminar usuarios",
                description: "Permite eliminar usuarios"
            }
        ]
    }
]

export const listaRoles = [
    {
        name: 'Gerente',
        permissions: [1,2,3,4,5,7,8]
    },
    {
        name: 'Administrativo',
        permissions: [1,2,5,9,10]
    },
    {
        name: 'Gestor de usuarios',
        permissions: [11,12,13,14]
    },
    {
        name: 'Gestor de usuarios',
        permissions: [11,12,13,14]
    }
]

export const permissionId = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    10: false,
    11: false,
    12: false,
    13: false,
    14: false,
    15: false,
    16: false,
    17: false,
    18: false,
    19: false,
    20: false
}