export const mockUpExecuter = async (repository: any, data: any) => {
  for (let item of data) {
    const result = await repository.create(item);
    await repository
      .save(result)
      .catch((err: any) => console.error(err));
  }
};
