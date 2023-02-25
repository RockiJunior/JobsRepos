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
}

export enum AlertEnumTypes {
	sinAlertas = 'Sin alertas',
	inmediatas = 'Inmediatas',
	diaria = 'Diaria',
}

export enum PermissionEnumList {
	// Properties
	seeProperty = 'Ver propiedad',
	publishProperty = 'Publicar propiedad',
	editProperty = 'Editar propiedad',
	deleteProperty = 'Eliminar propiedad',
	// Messaging
	seeConversation = 'Ver conversación',
	createConversation = 'Publicar conversación',
	deleteConversation = 'Eliminar conversación',
	createMessage = 'Enviar mensajes',
	deleteMessage = 'Borrar mensajes',
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
	USD = "USD",
	ARS = "ARS",
}
