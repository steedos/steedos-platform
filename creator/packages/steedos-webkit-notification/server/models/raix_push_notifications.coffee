
# db.raix_push_notifications = new Mongo.Collection('_raix_push_notifications');

db.raix_push_notifications = Push.notifications

if Meteor.isServer
    Meteor.publish 'raix_push_notifications', ->

        unless this.userId
            return this.ready()

        # appName = "workflow"
        
        query = {query: {$regex:"{\"userId\":\"" + this.userId + "\","},createdAt:{$gt: new Date()}}

        return db.raix_push_notifications.find(query, {fields: {badge:1, from:1, title: 1, text:1, payload:1}, sort:{createdAt:-1},limit:5})