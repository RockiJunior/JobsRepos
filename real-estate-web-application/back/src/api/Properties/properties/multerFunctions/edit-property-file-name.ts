import { extname } from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export const editPropertyFileName = (req?: any, file?: any, callback?: any) => {
	const fileExtName = extname(file.originalname);
	const newName = req.params.propertyId;
	const uuid = uuidv4();
	callback(null, `./${newName}/${uuid}${fileExtName}`);
};
