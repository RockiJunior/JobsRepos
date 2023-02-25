export const mockUpExecuterBranchOffice = async (
	repository: any,
	data: any,
	relationRepository: any
) => {
	for (let item of data) {
		const relation = await relationRepository.findOne({
			where: {
				id: item.realEstateId,
			},
		});
		const result = await repository.create({
			branch_office_name: item.branch_office_name,
			realEstate: relation,
		});
		await repository.save(result).catch((err: any) => console.error(err));
	}
};
