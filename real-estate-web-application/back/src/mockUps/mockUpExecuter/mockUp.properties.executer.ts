import * as fs from 'fs';
import { PropertyEnumStatus } from 'src/config/enum-types';

export const mockUpPropertiesExecuter = async (
	propertySchema: any,
	data: any
) => {
	for (const item of data) {
		const propertyCreated = await propertySchema.create(item);
		const newName = propertyCreated._id;
		// preguntar si tambien las imagenes de las finalizadas se guardan
		if (item.status !== PropertyEnumStatus.deleted) {
			fs.mkdir(
				`./uploads/properties/${newName}`,
				{ recursive: true },
				(err) => {
					if (err) {
						return err;
					}
				}
			);
		}
	}
};
