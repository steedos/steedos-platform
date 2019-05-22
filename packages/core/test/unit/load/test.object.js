module.exports = {
    name: 'test',
    label: 'js定义的对象',
    fields: {
        name: {
            type: 'text'
        },
        code: {
            type: 'number'
        },
        _obj: {
            type: 'lookup',
            reference_to: 'meetingroom'
        }
    }
}