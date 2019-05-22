module.exports = {

  name: 'clashRemind',

  listenTo: 'meeting',

  beforeInsert: async function(){
    var clashs;
    var doc = this.doc
    var userId = this.userId

    if (doc.end <= doc.start) {
        throw new Error("开始时间需小于结束时间");
    }

    var getObject = this.getObject

    var clashRemind = async function(_id,room,start,end){
      var meetings = await getObject("meeting").find({
        filters: [
          [
            ['_id', '<>', _id],
            ['room', '=', room]
          ], 
          'and' ,  
          [
            [
              ['start', '<=', start], 'and', ['end', '>', start]
            ], 'or',
            [
              ['start', '<', end], 'and', ['end', '>=', end]
            ], 'or',
            [
              ['start', '>=', start], 'and', ['end', '<=', end]
            ]
          ]
        ],
        fields: ["_id"]
      })
      return meetings.length
    }

    clashs = await clashRemind(this.id, doc.room, doc.start, doc.end);

    /* from base code */
    doc.created = new Date();
    doc.modified = new Date();
    if(userId){
      doc.owner = userId
      doc.created_by = userId;
      doc.modified_by = userId; 
    }

    if (clashs) {
        throw new Error("该时间段的此会议室已被占用");
    }
  },

  beforeUpdate: async function(){
    var doc = this.doc
    var clashs, room, start, end;

    if(doc.start || doc.end){

      var currentDoc = await this.getObject('meeting').findOne(this.id, {fields: ['room', 'start', 'end']})

      room = doc.room || currentDoc.room
      start = doc.start || currentDoc.start
      end = doc.end || currentDoc.end

      if (end <= start) {
        throw new Error("开始时间不能大于结束时间");
      }
  
      var getObject = this.getObject
  
      var clashRemind = async function(_id,room,start,end){
        var meetings = await getObject("meeting").find({
          filters: [
            [
              ['_id', '<>', _id],
              ['room', '=', room]
            ], 
            'and' ,  
            [
              [
                ['start', '<=', start], 'and', ['end', '>', start]
              ], 'or',
              [
                ['start', '<', end], 'and', ['end', '>=', end]
              ], 'or',
              [
                ['start', '>=', start], 'and', ['end', '<=', end]
              ]
            ]
          ],
          fields: ["_id"]
        })
        return meetings.length
      }
  
      clashs = await clashRemind(this.id, room, start, end);

      doc.modified = new Date();
  
      if (clashs) {
        throw new Error("该时间段的此会议室已被占用");
      }
    }
  },
  afterUpdate: async function(){
    // console.log('afterUpdate', this);
  },
  afterDelete: async function(){
    // console.log('afterDelete', this);
  }
}