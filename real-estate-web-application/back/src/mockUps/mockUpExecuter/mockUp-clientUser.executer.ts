import { hash } from 'bcrypt';
export const mockUpClientUserExecuter = async (repository: any, data: any) => {
	try {
		const password = await hash(`${data.password}`, 10);
		const result = await repository.create({
			...data,
			password: password,
		});
		await repository.save(result);
	} catch (err) {
		return err;
	}
};
