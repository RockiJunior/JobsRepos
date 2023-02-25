export const allCharacteristics = {
    ambience: 0,
    bedrooms: 0,
    bathrooms: 0,
    toilettes: 0,
    garages: 0,
    floors: 0,
    covered: false,
    lift: false,
    underground: false,
    building: false
}

export const allExtras = {
    generalCharacteristics: {
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
    },
    characteristics: {
        11: false,
        12: false,
        13: false,
        14: false,
        15: false,
        16: false,
        17: false,
        18: false,
        19: false,
        20: false,
        21: false,
        22: false,
        23: false,
        24: false,
        25: false,
        26: false,
        27: false,
        49: false,
        50: false,
        51: false,
        54: false,
    },
    services: {
        28: false,
        29: false,
        30: false,
    },
    ambience: {
        31: false,
        32: false,
        33: false,
        34: false,
        35: false,
        36: false,
        37: false,
        38: false,
        39: false,
        40: false,
        41: false,
        42: false,
        43: false,
        44: false,
        45: false,
        46: false,
        47: false,
        48: false,
        52: false,
        53: false,
    }
}

export const apartmentExtras = {
    property_type: 1,
    caracteristicasGenerales: [ //(char) => prop.caracteristicas[char.id] === true ?? return <div></div> : null
        { id: 1, name: "Acceso para personas con discapacidad" },
        { id: 2, name: "Parrilla" },
        { id: 3, name: "Solarium" },
        { id: 4, name: "Apto profesional" },
        { id: 5, name: "Permite mascotas" },
        { id: 6, name: "Uso comercial" },
        { id: 7, name: "Gimnasio" },
        { id: 8, name: "Pileta" },
        { id: 9, name: "Hidromasaje" },
        { id: 10, name: "Sala de juegos" },
    ],
    caracteristicas: [
        { id: 11, name: "Aire acondicionado" },
        { id: 12, name: "Cocina equipada" },
        { id: 13, name: "SUM" },
        { id: 14, name: "Alarma" },
        { id: 15, name: "Frigobar" },
        { id: 16, name: "Sauna" },
        { id: 17, name: "Amoblado" },
        { id: 18, name: "Lavarropas" },
        { id: 19, name: "Secarropas" },
        { id: 20, name: "Caldera" },
        { id: 21, name: "Lavavajillas" },
        { id: 22, name: "Termotanque" },
        { id: 23, name: "Calefacción" },
        { id: 24, name: "Microondas" },
        { id: 25, name: "Vigilancia" },
        { id: 26, name: "Cancha deportes" },
        { id: 27, name: "Quincho" },
    ],
    servicios: [
        { id: 28, name: "Ascensor" },
        { id: 29, name: "Caja fuerte" },
        { id: 30, name: "Laundry" },
    ],
    ambientes: [
        { id: 31, name: "Balcón" },
        { id: 32, name: "Dormitorio en suite" },
        { id: 33, name: "Living comedor" },
        { id: 34, name: "Baulera" },
        { id: 35, name: "Escritorio" },
        { id: 36, name: "Patio" },
        { id: 37, name: "Cocina" },
        { id: 43, name: "Comedor de diario" },
        { id: 38, name: "Hall" },
        { id: 39, name: "Sótano" },
        { id: 40, name: "Comedor" },
        { id: 41, name: "Jardín" },
        { id: 42, name: "Terraza" },
        { id: 44, name: "Lavadero" },
        { id: 45, name: "Toilette" },
        { id: 46, name: "Dependencia de servicio" },
        { id: 47, name: "Living" },
        { id: 48, name: "Vestidor" },
    ]
}

export const houseExtras = {
    property_type: 2,
    caracteristicasGenerales: [
        { id: 1, name: "Acceso para personas con discapacidad" },
        { id: 2, name: "Parrilla" },
        { id: 3, name: "Solarium" },
        { id: 4, name: "Apto profesional" },
        { id: 5, name: "Permite mascotas" },
        { id: 6, name: "Uso comercial" },
        { id: 7, name: "Gimnasio" },
        { id: 8, name: "Pileta" },
        { id: 9, name: "Hidromasaje" },
        { id: 10, name: "Sala de juegos" },
    ],
    caracteristicas: [
        { id: 11, name: "Aire acondicionado" },
        { id: 12, name: "Cocina equipada" },
        { id: 13, name: "SUM" },
        { id: 14, name: "Alarma" },
        { id: 15, name: "Frigobar" },
        { id: 16, name: "Sauna" },
        { id: 17, name: "Amoblado" },
        { id: 18, name: "Lavarropas" },
        { id: 19, name: "Secarropas" },
        { id: 20, name: "Caldera" },
        { id: 21, name: "Lavavajillas" },
        { id: 22, name: "Termotanque" },
        { id: 23, name: "Calefacción" },
        { id: 24, name: "Microondas" },
        { id: 25, name: "Vigilancia" },
        { id: 26, name: "Cancha deportes" },
        { id: 27, name: "Quincho" },
    ],
    servicios: [
        { id: 28, name: "Ascensor" },
        { id: 29, name: "Caja fuerte" },
        { id: 30, name: "Laundry" },
    ],
    ambientes: [
        { id: 31, name: "Balcón" },
        { id: 32, name: "Dormitorio en suite" },
        { id: 33, name: "Living comedor" },
        { id: 34, name: "Baulera" },
        { id: 35, name: "Escritorio" },
        { id: 36, name: "Patio" },
        { id: 37, name: "Cocina" },
        { id: 38, name: "Hall" },
        { id: 39, name: "Sótano" },
        { id: 40, name: "Comedor" },
        { id: 41, name: "Jardín" },
        { id: 42, name: "Terraza" },
        { id: 43, name: "Comedor de diario" },
        { id: 44, name: "Lavadero" },
        { id: 45, name: "Toilette" },
        { id: 46, name: "Dependencia de servicio" },
        { id: 47, name: "Living" },
        { id: 48, name: "Vestidor" },
    ]
}

export const PHExtras = {
    property_type: 3,
    caracteristicasGenerales: [
        { id: 1, name: "Acceso para personas con discapacidad" },
        { id: 2, name: "Parrilla" },
        { id: 3, name: "Solarium" },
        { id: 4, name: "Apto profesional" },
        { id: 5, name: "Permite mascotas" },
        { id: 6, name: "Uso comercial" },
        { id: 7, name: "Gimnasio" },
        { id: 8, name: "Pileta" },
        { id: 9, name: "Hidromasaje" },
        { id: 10, name: "Sala de juegos" },
    ],
    caracteristicas: [
        { id: 11, name: "Aire acondicionado" },
        { id: 12, name: "Cocina equipada" },
        { id: 14, name: "Alarma" },
        { id: 15, name: "Frigobar" },
        { id: 16, name: "Sauna" },
        { id: 17, name: "Amoblado" },
        { id: 18, name: "Lavarropas" },
        { id: 19, name: "Secarropas" },
        { id: 20, name: "Caldera" },
        { id: 21, name: "Lavavajillas" },
        { id: 22, name: "Termotanque" },
        { id: 23, name: "Calefacción" },
        { id: 24, name: "Microondas" },
        { id: 25, name: "Vigilancia" },
        { id: 27, name: "Quincho" },
    ],
    servicios: [
        { id: 28, name: "Ascensor" },
    ],
}

export const GarageExtras = {
    property_type: 4,
    caracteristicasGenerales: [
        { id: 1, name: "Acceso para personas con discapacidad" },
    ],
    caracteristicas: [
        { id: 14, name: "Alarma" },
        { id: 25, name: "Vigilancia" },
    ],
}

export const ConsultorioExtras = {
    property_type: 6,
    caracteristicasGenerales: [
        { id: 1, name: "Acceso para personas con discapacidad" },
        { id: 4, name: "Apto profesional" },
        { id: 6, name: "Uso comercial" },
    ],
    caracteristicas: [
        { id: 11, name: "Aire acondicionado" },
        { id: 14, name: "Alarma" },
        { id: 17, name: "Amoblado" },
        { id: 23, name: "Calefacción" },
        { id: 25, name: "Vigilancia" },
    ],
    servicios: [
        { id: 28, name: "Ascensor" },
    ],
    ambientes: [
        { id: 34, name: "Baulera" },
        { id: 36, name: "Patio" },
        { id: 37, name: "Cocina" },
        { id: 38, name: "Hall" },
        { id: 39, name: "Sótano" },
        { id: 52, name: "Oficinas" },
        { id: 53, name: "Vestuarios" },
    ]
}

export const BodegaExtras = {
    property_type: 7,
    caracteristicasGenerales: [
        { id: 1, name: "Acceso para personas con discapacidad" },
    ],
    caracteristicas: [
        { id: 11, name: "Aire acondicionado" },
        { id: 14, name: "Alarma" },
        { id: 23, name: "Calefacción" },
        { id: 25, name: "Vigilancia" },
        { id: 49, name: "Plaza de maniobras" },
        { id: 50, name: "Grúa" },
        { id: 51, name: "Fuerza motriz" },
        { id: 54, name: "Motores" },
        { id: 6, name: "Grupo electrógeno" },
    ],
    servicios: [
        { id: 28, name: "Ascensor" },
    ],
    ambientes: [
        { id: 52, name: "Oficinas" },
        { id: 53, name: "Vestuarios" },
    ]
}

export const FondoDeComercioExtras = {
    property_type: 7,
    caracteristicas: [
        { id: 14, name: "Alarma" },
        { id: 25, name: "Vigilancia" },
    ],
}

export const LocalExtras = {
    property_type: 6,
    caracteristicasGenerales: [
        { id: 1, name: "Acceso para personas con discapacidad" },
        { id: 4, name: "Apto profesional" },
        { id: 6, name: "Uso comercial" },
    ],
    caracteristicas: [
        { id: 11, name: "Aire acondicionado" },
        { id: 14, name: "Alarma" },
        { id: 17, name: "Amoblado" },
        { id: 23, name: "Calefacción" },
        { id: 25, name: "Vigilancia" },
    ],
    servicios: [
        { id: 28, name: "Ascensor" },
    ],
    ambientes: [
        { id: 34, name: "Baulera" },
        { id: 36, name: "Patio" },
        { id: 37, name: "Cocina" },
        { id: 38, name: "Hall" },
        { id: 39, name: "Sótano" },
        { id: 52, name: "Oficinas" },
        { id: 53, name: "Vestuarios" },
    ]
}
