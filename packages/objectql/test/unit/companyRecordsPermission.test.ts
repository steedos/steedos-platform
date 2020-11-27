import { expect } from 'chai';
import { SteedosSchema } from '../../src';
var path = require('path')

describe('Test companyRecordsPermission', function () {

  let userSessions = {
    'user': {

    },
    'admin': {
      userId: 'admin1',
      spaceId: 'space1',
      name: 'admin1',
      roles: ['admin'],
      space: { _id: 'space1', name: '工作区' },
      spaces: [{ _id: 'space1', name: '工作区' }],
      company: { _id: 'company1', name: '分部' },
      companies: [{ _id: 'company1', name: '分部' }],
      organization: { _id: 'organization1', name: '组织机构', fullname: '组织机构' },
      organizations: [{ _id: 'organization1', name: '组织机构', fullname: '组织机构' }],
    },
    'workflow_admin': {
      userId: 'workflow_admin1',
      spaceId: 'space1',
      name: 'workflow_admin1',
      roles: ['workflow_admin'],
      space: { _id: 'space1', name: '工作区' },
      spaces: [{ _id: 'space1', name: '工作区' }],
      company: { _id: 'company1', name: '分部' },
      companies: [{ _id: 'company1', name: '分部' }],
      organization: { _id: 'organization1', name: '组织机构', fullname: '组织机构' },
      organizations: [{ _id: 'organization1', name: '组织机构', fullname: '组织机构' }],
    },
    'none': {

    }
  };
  let rolePermissions = {
    user: {
      allowCreate: true,
      allowDelete: true,
      allowEdit: true,
      allowRead: true,
      modifyAllRecords: false,
      viewAllRecords: true,
      modifyCompanyRecords: false,
      viewCompanyRecords: true
    },
    admin: {
      allowCreate: true,
      allowDelete: true,
      allowEdit: true,
      allowRead: true,
      modifyAllRecords: true,
      viewAllRecords: true,
      modifyCompanyRecords: true,
      viewCompanyRecords: true
    },
    workflow_admin: {
      allowCreate: true,
      allowDelete: true,
      allowEdit: true,
      allowRead: true,
      modifyAllRecords: false,
      viewAllRecords: false,
      modifyCompanyRecords: true,
      viewCompanyRecords: true
    },
    none: {
      allowCreate: false,
      allowDelete: false,
      allowEdit: false,
      allowRead: true,
      modifyAllRecords: false,
      viewAllRecords: false,
      modifyCompanyRecords: false,
      viewCompanyRecords: false
    }
  }

  let mySchema = new SteedosSchema({
    datasources: {
      defaultMongo: {
        driver: 'mongo',
        url: 'mongodb://127.0.0.1/test',
        objectFiles: [path.resolve(__dirname, "./load")],
        objects: {
          companyRecordsPermission: {
            label: 'companyRecordsPermission',
            table_name: 's.companyRecordsPermission',
            fields: {
              name: {
                label: '名称',
                type: 'text'
              },
              company_id: {
                label: '所属公司',
                type: 'text'
              },
              company_ids: {
                label: '分配公司',
                type: 'text',
                multiple: true
              }
            }
          }
        },
        objectsRolesPermission: {
          companyRecordsPermission: rolePermissions
        }
      }
    }
  })

  describe('admin', function () {
    it('insert,find,findOne,count,update,updateOne,updateMany,delete', async function () {
      mySchema.getDataSource('defaultMongo').init();

      let crpObj = mySchema.getObject('companyRecordsPermission');
      let _id = new Date().getTime() + 'admin';
      let newRecord = await crpObj.insert({
        _id: _id,
        name: '1',
        space: 'space1',
        company_id: 'company1',
        company_ids: ['company1', 'company2']
      }, userSessions.admin);
      expect(newRecord._id).to.equal(_id)

      let fRecords = await crpObj.find({ filters: `(_id eq '${_id}')` }, userSessions.admin);

      expect(fRecords[0]._id).to.equal(_id)

      let foRecord = await crpObj.findOne(_id, {}, userSessions.admin);
      expect(foRecord._id).to.equal(_id)

      let count = await crpObj.count({ filters: `(_id eq '${_id}')` }, userSessions.admin);
      expect(count).to.equal(1)

      let uRecord = await crpObj.update(_id, { name: 'newName' }, userSessions.admin);
      expect(uRecord.name).to.equal('newName')

      let uRecord2 = await crpObj.updateOne(_id, { name: 'newName2' }, userSessions.admin);
      expect(uRecord2.name).to.equal('newName2')

      let updateManyResult = await crpObj.updateMany(`(_id eq '${_id}')`, { name: 'newName3' }, userSessions.admin);
      expect(updateManyResult.result.ok).to.equal(1)

      let deleteResult = await crpObj.delete(_id, userSessions.admin);
      expect(deleteResult).to.equal(undefined)

    })
  })

  describe('workflow_admin', function () {
    it('insert,find,findOne,count,update,updateOne,updateMany,delete', async function () {
      mySchema.getDataSource('defaultMongo').init();

      let crpObj = mySchema.getObject('companyRecordsPermission');
      let _id = new Date().getTime() + 'workflow_admin';
      let newRecord = await crpObj.insert({
        _id: _id,
        name: '1',
        space: 'space1',
        company_id: 'company1',
        company_ids: ['company1', 'company2']
      }, userSessions.workflow_admin);
      expect(newRecord._id).to.equal(_id)

      let fRecords = await crpObj.find({ filters: `(_id eq '${_id}')` }, userSessions.workflow_admin);

      expect(fRecords[0]._id).to.equal(_id)

      let foRecord = await crpObj.findOne(_id, {}, userSessions.workflow_admin);
      expect(foRecord._id).to.equal(_id)

      let count = await crpObj.count({ filters: `(_id eq '${_id}')` }, userSessions.workflow_admin);
      expect(count).to.equal(1)

      let uRecord = await crpObj.update(_id, { name: 'newName' }, userSessions.workflow_admin);
      expect(uRecord.name).to.equal('newName')

      let uRecord2 = await crpObj.updateOne(_id, { name: 'newName2' }, userSessions.workflow_admin);
      expect(uRecord2.name).to.equal('newName2')

      let updateManyResult = await crpObj.updateMany(`(_id eq '${_id}')`, { name: 'newName3' }, userSessions.workflow_admin);
      expect(updateManyResult.result.ok).to.equal(1)

      let deleteResult = await crpObj.delete(_id, userSessions.workflow_admin);
      expect(deleteResult).to.equal(undefined)

    })
  })

});