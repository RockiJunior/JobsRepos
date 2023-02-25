import { extname } from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import fsExtra from 'fs-extra';

export const editAdminFileName = async (
	req?: any,
	file?: any,
	callback?: any
) => {
	const fileExtName = extname(file.originalname);
	const newName = req.params.adminId;
	const uuid = uuidv4();
	try {
		await fsExtra.emptyDirSync(`./uploads/admins/profile-pictures/${newName}`);
	} catch (err) {
		console.log(err);
	}
	await callback(null, `./${newName}/${uuid}${fileExtName}`);
};
