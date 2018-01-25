export default (req, MongooseModel) => new Promise((resolve, reject) =>
  MongooseModel.findOne({ id: req.params.id }, (err, entity) => {
    if (err) {
      return reject(err);
    }
    return MongooseModel.update({ id: req.params.id }, { ...entity, ...req.body }, (err1) => {
      if (err1) {
        return reject(err1);
      }
      return resolve({ entity: req.body, originEntity: entity });
    });
  }),
);
