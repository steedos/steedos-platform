module.exports = {

    name: 'accountsTriggers',

    listenTo: 'accounts3',

    afterInsert: async function () {
        console.log('afterInsert');        
    },
    afterUpdate: async function () {
        console.log('afterUpdate');        
    },
    afterDelete: async function () {
        console.log('afterDelete');  
    }
}