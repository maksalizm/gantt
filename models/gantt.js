var mongoose = require('mongoose');


var taskValuesSchema = mongoose.Schema({
    from: {type: Date, require: true, default: Date.now()},
    to: {type: Date, require: true, default: Date.now()},
    label: {type: String, require: true, default: ''}
});

var ganttSchema = mongoose.Schema({
    ganttName: {type: String, require: true},
    project: [
        {
            name: {type: String, require: true, default: ''},
            values: [taskValuesSchema],
            task: [
                {
                    desc: {type: String, require: true, default: ''},
                    values: [taskValuesSchema]
                }
            ]
        }
    ]
});


module.exports = mongoose.model('gantt', ganttSchema);