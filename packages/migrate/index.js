/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-05-24 12:32:57
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-01-13 14:21:44
 * @Description: 
 */
const migrate = require('migrate')
const path = require('path');
const validator = require('validator');

const stateStore = path.join(process.cwd(), '.steedos', '.migrate');
const migrationsDirectory = path.join(__dirname, 'migrations');

const up = async function () {

    migrate.load({
        stateStore: stateStore,
        migrationsDirectory: migrationsDirectory
    }, function (err, set) {
        if (err) {
            throw err
        }
        set.up(function (err) {
            if (err) {
                throw err
            }

        })
    })
}

const init = async function () {
    if (process.env.STEEDOS_DB_AUTO_MIGRATE !== false && process.env.STEEDOS_DB_AUTO_MIGRATE !== 'false') {
        // 如果未设置为不自动执行，则默认自动执行
        process.env.STEEDOS_DB_AUTO_MIGRATE = 'true'
    }
    const autoMigrate = validator.toBoolean(process.env.STEEDOS_DB_AUTO_MIGRATE || '', true);
    // console.log('process.env.STEEDOS_DB_AUTO_MIGRATE:', process.env.STEEDOS_DB_AUTO_MIGRATE)
    // console.log('autoMigrate:', autoMigrate)
    if (autoMigrate) {
        up();
    }
}

const down = async function () {
    migrate.load({
        stateStore: stateStore,
        migrationsDirectory: migrationsDirectory
    }, function (err, set) {
        if (err) {
            throw err
        }
        set.down(function (err) {
            if (err) {
                throw err
            }
            console.log('DB migrations down successfully.')
        })
    })
}

module.exports = {
    init: init,
    up: up,
    down: down
}