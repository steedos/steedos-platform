export default (req, MongooseModel) => new Promise((resolve, reject) => {
  if (!Object.keys(req.body).length) {
    return reject({ status: 422 });
  }

  const entity = new MongooseModel(req.body);
  return entity.save((err) => {
    if (err) {
      return reject(err);
    }
    return resolve({ status: 201, entity });
  });
});
