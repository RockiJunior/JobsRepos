import { v2 } from 'cloudinary';
import { CLOUDINARY } from '../../../../config/constants';
export const CloudinaryProvider = {
	provide: CLOUDINARY,
	useFactory: (): any => {
		return v2.config({
			cloud_name: `dvaleelub`,
			api_key: `515519527499617`,
			api_secret: `lDvqQjl78BM_hFKkqpJ8M1ZzwB8`,
		});
	},
};
