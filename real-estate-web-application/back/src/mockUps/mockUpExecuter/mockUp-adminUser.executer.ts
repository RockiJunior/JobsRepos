import { hash } from 'bcrypt';
export const mockUpAdminUserExecuter = async (
	repository: any,
	data: any,
	relationRepository: any
) => {
	for (const item of data) {
		try {
			const password = await hash(`${item.password}`, 10);
			const relation = await relationRepository.findOne({
				relations: ['user'],
				where: {
					id: item.realEstateId,
				},
			});
			const result = await repository.create({
				...item,
				password,
			});
			await repository.save(result);
			await relationRepository.update(relation.id, {
				user: result.id,
			});
		} catch (err) {
			return err;
		}
	}
};
