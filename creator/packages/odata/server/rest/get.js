export default (req, MongooseModel) => new Promise((resolve, reject) => {
  MongooseModel.findById(req.params.id, (err, entity) => {
    if (err) {
      return reject(err);
    }

    if (!entity) {
      return reject({ status: 404 }, { text: 'Not Found' });
    }

    return resolve({ entity });
  });
});
