import { expect } from 'chai';
import { SteedosSchema } from '../../src';
import { Dictionary } from '@salesforce/ts-types';
var path = require('path')

describe('Test Permission', () => {

    let userSessionStorage: Dictionary<any> = {}

    userSessionStorage['0'] = {
        userId: 0,
        spaceId: 'XXX',
        roles: ['guest'],
        name: '游客'
    }

    userSessionStorage['1'] = {
        userId: 1,
        spaceId: 'XXX',
        roles: ['user'],
        name: '用户'
    }

    userSessionStorage['2'] = {
        userId: 2,
        spaceId: 'XXX',
        roles: ['admin'],
        name: '管理员'
    }

    userSessionStorage['3'] = {
        userId: 3,
        spaceId: 'XXX',
        roles: ['user', 'admin'],
        name: "用户&游客"
    }

    userSessionStorage['4'] = {
        userId: 4,
        spaceId: 'XXX',
        roles: ['user2'],
        name: "用户2"
    }

    let mySchema = new SteedosSchema({
        datasources: {
            default: {
                driver: 'mongo', 
                url: 'mongodb://127.0.0.1/steedos',
                objectFiles: [path.resolve(__dirname, "./load")],
                objects: {
                    test2: {
                        label: 'Test2',
                        tableName: 'test2.cccccc',
                        fields: {
                            name: {
                                label: '名称',
                                type: 'text'
                            },
                            no: {
                                label: '编号',
                                type: 'number'
                            }
                        }
                    }
                },
                objectsRolesPermission: {
                    test2: {
                        user: {
                            allowCreate: false,
                            allowRead: true,
                            allowEdit: false,
                            allowDelete: false,
                            unreadable_fields: ['name']
                        },
                        user2: {
                            allowCreate: false,
                            allowRead: true,
                            allowEdit: true,
                            allowDelete: false,
                            uneditable_fields: ['no']
                        },
                        admin: {
                            allowCreate: true,
                            allowRead: true,
                            allowEdit: true,
                            allowDelete: true,
                            
                        }
                    }
                }
            }
        }
    })

    it('guest: 权限测试', async () => {
        let userSession = userSessionStorage['0'];
        let insertOK = true, updateOK=true, findOk=true, deleteOK=true;

        // permission_test 的 guest role没有任何权限
        let permissionTest = mySchema.getObject('permission_test')

        try {
            await permissionTest.insert({_id: 'test', name: 'test'}, userSession)
        } catch (error) {
            if(error.message == 'not find permission'){
                insertOK = false
            }
        }

        try {
            await permissionTest.update('-1', {_id: 'test', name: 'test'}, userSession)
        } catch (error) {
            if(error.message == 'not find permission'){
                updateOK = false
            }
        }

        try {
            await permissionTest.find({fields: ['_id']}, userSession)
        } catch (error) {
            if(error.message == 'not find permission'){
                findOk = false
            }
        }

        try {
            await permissionTest.delete('-1', userSession)
        } catch (error) {
            if(error.message == 'not find permission'){
                deleteOK = false
            }
        }

        expect(insertOK || updateOK || findOk || deleteOK).to.equal(false)

    });

    it('user: 权限测试', async () => {
        let userSession = userSessionStorage['1'];
        let insertOK = true, updateOK=true, findOk=true, deleteOK=true;

        // permission_test 的 user role 只有查看权限
        let permissionTest = mySchema.getObject('permission_test')

        try {
            await permissionTest.insert({_id: 'test', name: 'test'}, userSession)
        } catch (error) {
            if(error.message == 'not find permission'){
                insertOK = false
            }
        }

        try {
            await permissionTest.update('-1', {_id: 'test', name: 'test'}, userSession)
        } catch (error) {
            if(error.message == 'not find permission'){
                updateOK = false
            }
        }

        try {
            await permissionTest.find({fields: ['_id']}, userSession)
        } catch (error) {
            if(error.message == 'not find permission'){
                findOk = false
            }
        }

        try {
            await permissionTest.delete('-1', userSession)
        } catch (error) {
            if(error.message == 'not find permission'){
                deleteOK = false
            }
        }
        expect(findOk).to.equal(true) && expect(insertOK || updateOK ||  deleteOK).to.equal(false)

    });

    it('admin: 权限测试', async () => {
        let userSession = userSessionStorage['2'];
        let insertOK = true, updateOK=true, findOk=true, deleteOK=true;

        // permission_test 的 admin role 有所有权限
        let permissionTest = mySchema.getObject('permission_test')

        try {
            await permissionTest.insert({_id: 'test', name: 'test'}, userSession)
        } catch (error) {
            if(error.message == 'not find permission'){
                insertOK = false
            }
        }

        try {
            await permissionTest.update('-1', {_id: 'test', name: 'test'}, userSession)
        } catch (error) {
            if(error.message == 'not find permission'){
                updateOK = false
            }
        }

        try {
            await permissionTest.find({fields: ['_id']}, userSession)
        } catch (error) {
            if(error.message == 'not find permission'){
                findOk = false
            }
        }

        try {
            await permissionTest.delete('test', userSession)
        } catch (error) {
            if(error.message == 'not find permission'){
                deleteOK = false
            }
        }

        expect(insertOK && updateOK &&  deleteOK && findOk).to.equal(true)

    });

    it('user && admin: 权限测试', async () => {
        let userSession = userSessionStorage['3'];
        let insertOK = true, updateOK=true, findOk=true, deleteOK=true;

        // permission_test 的 user只有查看权限， admin 有所有权限
        let permissionTest = mySchema.getObject('permission_test')

        try {
            await permissionTest.insert({_id: 'test', name: 'test'}, userSession)
        } catch (error) {
            if(error.message == 'not find permission'){
                insertOK = false
            }
        }

        try {
            await permissionTest.update('-1', {_id: 'test', name: 'test'}, userSession)
        } catch (error) {
            if(error.message == 'not find permission'){
                updateOK = false
            }
        }

        try {
            await permissionTest.find({fields: ['_id']}, userSession)
        } catch (error) {
            if(error.message == 'not find permission'){
                findOk = false
            }
        }

        try {
            await permissionTest.delete('test', userSession)
        } catch (error) {
            if(error.message == 'not find permission'){
                deleteOK = false
            }
        }

        expect(insertOK && updateOK &&  deleteOK && findOk).to.equal(true)

    });

    it('schema.datasource.objects -> user 权限测试', async () => {
        let userSession = userSessionStorage['1'];
        let insertOK = true, updateOK=true, findOk=true, deleteOK=true;

        // permission_test 的 user只有查看权限， admin 有所有权限
        let permissionTest = mySchema.getObject('test2')

        try {
            await permissionTest.insert({_id: 'test2', name: 'test2'}, userSession)
        } catch (error) {
            if(error.message == 'not find permission'){
                insertOK = false
            }
        }

        try {
            await permissionTest.update('-1', {_id: 'test2', name: 'test2'}, userSession)
        } catch (error) {
            if(error.message == 'not find permission'){
                updateOK = false
            }
        }

        try {
            await permissionTest.find({fields: ['_id']}, userSession)
        } catch (error) {
            if(error.message == 'not find permission'){
                findOk = false
            }
        }

        try {
            await permissionTest.delete('test2', userSession)
        } catch (error) {
            if(error.message == 'not find permission'){
                deleteOK = false
            }
        }

        expect(findOk).to.equal(true) && expect(insertOK || updateOK ||  deleteOK).to.equal(false)

    });

    it('unreadable_fields：不可见字段权限测试', async()=>{
        let userSession1 = userSessionStorage['1'];
        let userSession2 = userSessionStorage['2'];
        let test = mySchema.getObject('test2');
        let random = new Date().getTime();
        let id = `test2019_${random}`;
        await test.insert({_id: id, name: 'test2019 name', no: 666}, userSession2)
        
        let userDoc = await test.findOne(id, {fields: ['name','no']}, userSession1)
        
        let adminDoc = await test.findOne(id, {fields: ['name','no']}, userSession2)
        
        await test.delete(id, userSession2)
        
        expect(userDoc.name).to.undefined && expect(adminDoc.name).to.equal('test2019 name')
    })

    it('uneditable_fields：不可编辑字段权限测试', async()=>{
        let userSession4 = userSessionStorage['4'];
        let userSession2 = userSessionStorage['2'];
        let test = mySchema.getObject('test2');
        let random = new Date().getTime();
        let id = `test2019_${random}`;
        await test.insert({_id:id, name: 'test2019 name', no: 666})
        
        let userUpdateOK = false

        try {
            await test.update(id, {no: 111, name: 'N111'}, userSession4)
        } catch (error) {
            if(error.message === 'no permissions to edit fields no'){
                userUpdateOK = true
            }
        }
        
        // let userDoc = await test.findOne(id, {fields: ['name','no']}, '4')
        
        await test.update(id, {no: 222, name: 'N222'}, userSession2)
        let adminDoc = await test.findOne(id, {fields: ['name','no']}, userSession2)
        
        await test.delete(id)
        
        expect(userUpdateOK).to.equal(true) && expect(adminDoc.no).to.equal(222)
    })

  });