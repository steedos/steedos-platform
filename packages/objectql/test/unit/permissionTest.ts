import { expect } from 'chai';
import { SteedosSchema, SteedosIDType } from '../../src';
var path = require('path')

describe('Test Permission', () => {
    let mySchema = new SteedosSchema({
        objects: {}, 
        datasource: {driver: 'mongo', url: 'mongodb://127.0.0.1/steedos'},
        getRoles: function(userId: SteedosIDType){
            if(userId == '0'){
                return ['guest']
            }else if(userId == '1'){
                return ['user']
            }else if(userId == '2'){
                return ['admin']
            }else if(userId == '3'){
                return ['user', 'admin']
            }
        }
    })
    
    mySchema.use(path.resolve(__dirname, "./load"))

    it('guest: 权限测试', async () => {
        let userId = '0';
        let insertOK = true, updateOK=true, findOk=true, deleteOK=true;

        // permission_test 的 guest role没有任何权限
        let permissionTest = mySchema.getObject('permission_test')

        try {
            await permissionTest.insert({_id: 'test', name: 'test'}, userId)
        } catch (error) {
            if(error.message == 'not find permission'){
                insertOK = false
            }
        }

        try {
            await permissionTest.update('-1', {_id: 'test', name: 'test'}, userId)
        } catch (error) {
            if(error.message == 'not find permission'){
                updateOK = false
            }
        }

        try {
            await permissionTest.find({fields: ['_id']}, userId)
        } catch (error) {
            if(error.message == 'not find permission'){
                findOk = false
            }
        }

        try {
            await permissionTest.delete('-1', userId)
        } catch (error) {
            if(error.message == 'not find permission'){
                deleteOK = false
            }
        }

        expect(insertOK || updateOK || findOk || deleteOK).to.equal(false)

    });

    it('user: 权限测试', async () => {
        let userId = '1'
        let insertOK = true, updateOK=true, findOk=true, deleteOK=true;

        // permission_test 的 user role 只有查看权限
        let permissionTest = mySchema.getObject('permission_test')

        try {
            await permissionTest.insert({_id: 'test', name: 'test'}, userId)
        } catch (error) {
            if(error.message == 'not find permission'){
                insertOK = false
            }
        }

        try {
            await permissionTest.update('-1', {_id: 'test', name: 'test'}, userId)
        } catch (error) {
            if(error.message == 'not find permission'){
                updateOK = false
            }
        }

        try {
            await permissionTest.find({fields: ['_id']}, userId)
        } catch (error) {
            if(error.message == 'not find permission'){
                findOk = false
            }
        }

        try {
            await permissionTest.delete('-1', userId)
        } catch (error) {
            if(error.message == 'not find permission'){
                deleteOK = false
            }
        }
        expect(findOk).to.equal(true) && expect(insertOK || updateOK ||  deleteOK).to.equal(false)

    });

    it('admin: 权限测试', async () => {
        let userId = '2'
        let insertOK = true, updateOK=true, findOk=true, deleteOK=true;

        // permission_test 的 admin role 有所有权限
        let permissionTest = mySchema.getObject('permission_test')

        try {
            await permissionTest.insert({_id: 'test', name: 'test'}, userId)
        } catch (error) {
            if(error.message == 'not find permission'){
                insertOK = false
            }
        }

        try {
            await permissionTest.update('-1', {_id: 'test', name: 'test'}, userId)
        } catch (error) {
            if(error.message == 'not find permission'){
                updateOK = false
            }
        }

        try {
            await permissionTest.find({fields: ['_id']}, userId)
        } catch (error) {
            if(error.message == 'not find permission'){
                findOk = false
            }
        }

        try {
            await permissionTest.delete('test', userId)
        } catch (error) {
            if(error.message == 'not find permission'){
                deleteOK = false
            }
        }

        expect(insertOK && updateOK &&  deleteOK && findOk).to.equal(true)

    });

    it('user && admin: 权限测试', async () => {
        let userId = '3'
        let insertOK = true, updateOK=true, findOk=true, deleteOK=true;

        // permission_test 的 user只有查看权限， admin 有所有权限
        let permissionTest = mySchema.getObject('permission_test')

        try {
            await permissionTest.insert({_id: 'test', name: 'test'}, userId)
        } catch (error) {
            if(error.message == 'not find permission'){
                insertOK = false
            }
        }

        try {
            await permissionTest.update('-1', {_id: 'test', name: 'test'}, userId)
        } catch (error) {
            if(error.message == 'not find permission'){
                updateOK = false
            }
        }

        try {
            await permissionTest.find({fields: ['_id']}, userId)
        } catch (error) {
            if(error.message == 'not find permission'){
                findOk = false
            }
        }

        try {
            await permissionTest.delete('test', userId)
        } catch (error) {
            if(error.message == 'not find permission'){
                deleteOK = false
            }
        }

        expect(insertOK && updateOK &&  deleteOK && findOk).to.equal(true)

    });
  });