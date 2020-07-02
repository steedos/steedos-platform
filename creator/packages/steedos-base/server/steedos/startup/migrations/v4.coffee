Meteor.startup ->
    Migrations.add
        version: 4
        name: '给organizations表设置sort_no'
        up: ->
            console.log 'version 4 up'
            console.time 'upgrade_organizations_sort_no'
            try
                db.organizations.direct.update({sort_no: {$exists: false}}, {$set: {sort_no: 100}}, {multi: true})
            catch e
                console.error e

            console.timeEnd 'upgrade_organizations_sort_no'
        down: ->
            console.log 'version 4 down'
