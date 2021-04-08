

module.exports = {

  listenTo: 'contract_payments',

  beforeInsert: async function () {
    var doc = this.doc;
    var contract = await this.getObject('contracts').findOne(doc.contract, { fields: { othercompany: 1 } });
    doc.account = contract.othercompany || "";
  },

  beforeUpdate: async function () {
    var doc = this.doc;
    if (_.has(doc, 'contract')) {
      var contract = await this.getObject('contracts').findOne(doc.contract, { fields: { othercompany: 1 } });
      doc.account = contract.othercompany || "";
    }
  },
};