// /**
//  * mongodb 数据库操作类
//  */
import { MongoClient, ObjectId } from "mongodb";
import { getSteedosConfig } from '@steedos/objectql';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

const yaml = require('js-yaml');
const fs = require("fs");
const path = require('path');

export class DbManager {
    static instance: DbManager | null
    public client: MongoClient
    private session;

    connected:boolean = false;

    private url;
    private userSession;

    constructor(userSession?) {
        this.url = getSteedosConfig().datasources.default.connection.url;
        this.client = new MongoClient(this.url, {useNewUrlParser: true, useUnifiedTopology: true})
        this.setUserSession(userSession);
    }
    
    setUserSession(userSession){
        this.userSession = userSession;
    }
    getUserSession(){
        return this.userSession;
    }

    async connect() {
        if(!this.connected){
            await this.client.connect();
            this.connected = true;
        }
    }

    async close() {
        await this.client.close();
    }

    async insert(collectionName:string, doc:any, autoGenerateId = true) {
        if(autoGenerateId){

            doc['_id'] = new ObjectId().toHexString();
            doc['space'] = this.userSession.spaceId;
    
            const now = new Date()
            doc['owner'] = this.userSession.userId
            doc['created'] = now
            doc['created_by'] = this.userSession.userId
            doc['modified'] = now
            doc['modified_by'] = this.userSession.userId
        }
        return await this.client.db().collection(collectionName).insertOne(doc, {session: this.session});
    }

    async insertMany(collectionName:string, docs:any[], autoGenerateId = true) {
        if(autoGenerateId){
            for(var i=0; i<docs.length; i++){
                docs[i]['_id'] = new ObjectId().toHexString();
                docs[i]['space'] = this.userSession.spaceId;

                const now = new Date()
                docs[i]['owner'] = this.userSession.userId
                docs[i]['created'] = now
                docs[i]['created_by'] = this.userSession.userId
                docs[i]['modified'] = now
                docs[i]['modified_by'] = this.userSession.userId
            }
        }
        return await this.client.db().collection(collectionName).insertMany(docs, {session: this.session});
    }

    async delete(collectionName:string, filter:object) {
        var space = this.userSession.spaceId;
        filter['space'] = space
        return await this.client.db().collection(collectionName).deleteOne(filter, {session: this.session});
    }

    async deleteMany(collectionName:string, filter:object) {
        var space = this.userSession.spaceId;
        filter['space'] = space
        return await this.client.db().collection(collectionName).deleteMany(filter, {session: this.session});
    }

    async directUpdate(collectionName:string, filter:object, update:any) {
        var space = this.userSession.spaceId;
        filter['space'] = space

        update.$set['modified'] = new Date()
        update.$set['modified_by'] = this.userSession.userId
        return await this.client.db().collection(collectionName).updateOne(filter, update, {session: this.session});
    }

    async update(collectionName:string, filter:object, update:object) {
        var space = this.userSession.spaceId;
        filter['space'] = space

        update['modified'] = new Date()
        update['modified_by'] = this.userSession.userId
        return await this.client.db().collection(collectionName).updateOne(filter, {$set: update}, {session: this.session});
    }

    async unset(collectionName:string, filter:object, update:object) {
        var space = this.userSession.spaceId;
        filter['space'] = space
        return await this.client.db().collection(collectionName).updateOne(filter, {$unset: update}, {session: this.session});
    }
    
    async find(collectionName:string, filter:object, setSpace=true, limit?, options = {}) {
        var space = this.userSession.spaceId;
        if(setSpace){
            filter['space'] = space
        }
        let newOptions = {
            ...options,
            session: this.session
        }
        if(limit){
            return await this.client.db().collection(collectionName).find(filter, newOptions).limit(limit).toArray();
        }else{
            return await this.client.db().collection(collectionName).find(filter, newOptions).toArray();
        }
    }

    async findOne(collectionName:string, filter:object, setSpace=true, options = {}) {
        var space = this.userSession.spaceId;
        if(setSpace){
            filter['space'] = space
        }
        let newOptions = {
            ...options,
            session: this.session
        }
        return await this.client.db().collection(collectionName).findOne(filter, newOptions);
    }

    async findWithProjection(collectionName:string, filter:object, projection?:object, setSpace=true, limit?) {
        if(!projection){
            return await this.find(collectionName, filter, setSpace, limit);
        }
        var space = this.userSession.spaceId;
        if(setSpace){
            filter['space'] = space
        }
        var setting = {session: this.session};
        if(projection){
            setting['projection'] = projection
        }
        if(limit){
            return await this.client.db().collection(collectionName).find(filter, setting).limit(limit).toArray();
        }else{
            return await this.client.db().collection(collectionName).find(filter, setting).toArray();
        }
    }

    async findOneWithProjection(collectionName:string, filter:object, projection?:object, setSpace=true) {
        if(!projection){
            return await this.findOne(collectionName, filter, setSpace);
        }
        var space = this.userSession.spaceId;
        if(setSpace){
            filter['space'] = space
        }
        var setting = {session: this.session};
        if(projection){
            setting['projection'] = projection
        }
        return await this.client.db().collection(collectionName).findOne(filter, setting);
    }

    async aggregate(collectionName:string, pipeline:object[]) {
        var space = this.userSession.spaceId;

        pipeline.push({
            $match: { space }
        })
        
        return await this.client.db().collection(collectionName).aggregate(pipeline).toArray();
    }

    async startSession(){
        const session = await this.client.startSession();
        this.session = session;
        return session;
    }
    async endSession(){
        if(this.session){
            return await this.session.endSession();
        }
    }

}
