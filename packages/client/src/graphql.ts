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
        let body = {
            query: `mutation {
                ${objectName}_INSERT_ONE(data:${JSON.stringify(data)})
            }`
        };
        console.log('insert body', body);
        return await this.client.doFetch(url, {method: 'POST', body: JSON.stringify(body)});
    }

    async update(objectName: string, _id: string, data){
        let url = this.client.getBaseRoute() + "/graphql";
        let body = {
            query: `mutation {
                ${objectName}_UPDATE_ONE(_id:"${_id}", data:${JSON.stringify(data)})
            }`
        };
        return await this.client.doFetch(url, {method: 'POST', body: JSON.stringify(body)});
    }

    async delete(objectName: string, _id: string){
        let url = this.client.getBaseRoute() + "/graphql";
        let body = {
            query: `mutation {
                ${objectName}_DELETE_ONE(_id:"${_id}")
            }`
        };
        return await this.client.doFetch(url, {method: 'POST', body: JSON.stringify(body)});
    }


}