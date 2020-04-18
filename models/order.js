const { Schema, model } = require('mongoose');

const orderScema = new Schema({
    courses: [{
        course: {
            type: Object,
            require: true,
        },
        count: {
            type: Number,
            require: true
        }
    }],
    user:{
        name: String,
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});


module.exports = model('Order', orderScema);