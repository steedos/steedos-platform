const _ = require('underscore');
export default class Graphql {
    client: any;
    constructor(client){
        this.client = client;
    }

    async query(query: string){
        let url = this.client.getBaseRoute() + "/graphql";
        let body = {
            query: query
        };
        return await this.client.doFetch(url, {method: 'POST', body: JSON.stringify(body)});
    }

    async insert(objectName: string, data){
        let url = this.client.getBaseRoute() + "/graphql";
        let _data = data;
        if(!_.isString(_data)){
            _data = JSON.stringify(data)
        }
        let body = {
            query: `mutation {
                ${objectName}__insert(data:${_data})
            }`
        };
        console.log('insert body', body);
        return await this.client.doFetch(url, {method: 'POST', body: JSON.stringify(body)});
    }

    async update(objectName: string, _id: string, data){
        let url = this.client.getBaseRoute() + "/graphql";
        let _data = data;
        if(!_.isString(_data)){
            _data = JSON.stringify(data)
        }
        let body = {
            query: `mutation {
                ${objectName}__update(_id:"${_id}", data:${_data})
            }`
        };
        return await this.client.doFetch(url, {method: 'POST', body: JSON.stringify(body)});
    }

    async delete(objectName: string, _id: string){
        let url = this.client.getBaseRoute() + "/graphql";
        let body = {
            query: `mutation {
                ${objectName}__delete(_id:"${_id}")
            }`
        };
        return await this.client.doFetch(url, {method: 'POST', body: JSON.stringify(body)});
    }


}