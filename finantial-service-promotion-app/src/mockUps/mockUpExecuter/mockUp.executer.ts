export const mockUpExecuter = async (repository: any, data: any) => {
  for (let item of data) {
    const result = await repository.create(item);
    await repository
      .save(result)
      // .then(() => {
      //   console.log('mockups created successfully!');
      // })
      .catch((err: any) => console.error(err));
  }
};
