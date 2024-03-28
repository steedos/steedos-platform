/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-03-26 16:43:43
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-28 15:38:18
 * @Description: 
 */
require('dotenv-flow').config({path: process.cwd(),silent: true});

const { exec } = require('node:child_process')
const _ = require('lodash');
const { ROOT_URL, API_KEY, K6_VUS, K6_DURATION } = process.env; 

const filePath = _.last(process.argv);

async function run(){
    runTest(filePath).then((stdout)=>{
        console.log(`test: `, stdout)
    })
}

async function runTest(item) {
    
    let com = `k6 run --out json=${filePath}_${new Date().getTime()}.k6.results.json`

    if(process.env.K6_PROMETHEUS_RW_SERVER_UR){
        com = `K6_PROMETHEUS_RW_SERVER_URL=${process.env.K6_PROMETHEUS_RW_SERVER_UR} \ k6 run -o experimental-prometheus-rw`
    }

    return new Promise((resolve, reject) => {
        console.log(`${com} -e ROOT_URL=${ROOT_URL} -e API_KEY=${API_KEY} -e VUS=${K6_VUS} -e DURATION=${K6_DURATION} ${item}`)
        exec(`${com} -e ROOT_URL=${ROOT_URL} -e API_KEY=${API_KEY} -e VUS=${K6_VUS} -e DURATION=${K6_DURATION} ${item}`, (error, stdout, stderr)=>{
            if (error) {
                reject(error)
            }
            resolve(stdout)
        });
    })
}


run()