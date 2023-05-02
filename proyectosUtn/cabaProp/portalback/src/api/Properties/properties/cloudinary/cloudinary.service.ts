import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';
import toStream from 'buffer-to-stream';

@Injectable()
export class CloudinaryService {
	async uploadImage(file: any) {
		try {
			return new Promise((resolve, reject) => {
				const upload = v2.uploader.upload_stream((error, result) => {
					if (error) return reject(error);
					resolve(result);
				});
				toStream(file.buffer).pipe(upload);
			});
		} catch (err) {
			return err;
		}
	}

	async deleteImage(file: string) {
		return new Promise((resolve, reject) => {
			v2.uploader.destroy(file, (error, result) => {
				if (error) return reject(error);
				resolve(result);
			});
		});
	}
}
