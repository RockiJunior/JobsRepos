export enum UserEnumStatus {
	expired = 'expired',
	active = 'active',
	disabled = 'disabled',
	pending = 'pending',
	deleted = 'deleted',
}
// expired, active, disabled, pending
export enum ClientEnumStatus {
	expired = 'expired',
	active = 'active',
	disabled = 'disabled',
	pending = 'pending',
}

export enum PropertyEnumStatus {
	pending = 'pending',
	paused = 'paused',
	published = 'published',
	finished = 'finished',
	deleted = 'deleted',
}

export enum TypeOfUser {
	collabUser = 'collab',
	adminUser = 'admin',
	clientUser = 'client',
}

export enum AlertEnumTypes {
	sinAlertas = 'Sin alertas',
	inmediatas = 'Inmediatas',
	diaria = 'Diaria',
}

export enum PermissionEnumList {
	// Properties
	publishProperty = 'Publicar propiedad',
	editProperty = 'Editar propiedad',
	deleteProperty = 'Eliminar propiedad',
	// Messaging
	seeConversation = 'Ver conversación',
	deleteConversation = 'Eliminar conversación',
	createMessage = 'Enviar mensaje',
	deleteMessage = 'Eliminar mensaje',
	// Users
	seeUsers = 'Ver usuarios',
	editUsers = 'Editar usuarios',
	createUsers = 'Publicar usuarios',
	deleteUsers = 'Eliminar usuarios',
	// Roles
	seeRoles = 'Ver roles',
	editRoles = 'Editar roles',
	createRoles = 'Publicar roles',
	deleteRoles = 'Eliminar roles',
}

export enum SurfaceEnumType {
	totalSurface = 'totalSurface',
	coveredSurface = 'coveredSurface',
}

export enum CurrencyEnumNumbers {
	USD = 'USD',
	ARS = 'ARS',
}

export enum PropertyTypesEnum {
	departamento = 'Departamento',
	casa = 'Casa',
	PH = 'PH',
	cochera = 'Cochera',
	consultorio = 'Consultorio',
	fondoDeComercio = 'Fondo de Comercio',
	localComercial = 'Local Comercial',
	oficinaComercial = 'Oficina Comercial',
	bodegaGalponDeposito = 'Bodega/Galpón/Depósito',
	terreno = 'Terreno',
	hotel = 'Hotel',
	edificio = 'Edificio',
	bovedaNichoParecela = 'Bóveda/Nicho/Parecela',
}

export enum OperationTypesEnum {
	venta = 'Venta',
	alquiler = 'Alquiler',
	temporario = 'Temporario',
}

export enum FindOptionsPropertyEnum {
	price = 'price.total',
	createdAt = 'created_at',
}

export enum FindOptionsSort {
	asc = 'asc',
	desc = 'desc',
}

export enum FindOptionsSortAdmin {
	address = 'location.street',
	price = 'price.total',
	operation = 'operation_type',
	type = 'property_type',
	status = 'status',
	updated_at = 'updated_at',
}