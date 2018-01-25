export default (req, MongooseModel) => new Promise((resolve, reject) => {
  MongooseModel.remove({ _id: req.params.id }, (err, result) => {
    if (err) {
      return reject(err);
    }

    if (JSON.parse(result).n === 0) {
      return reject({ status: 404 }, { text: 'Not Found' });
    }

    return resolve({ status: 204 });
  });
});
