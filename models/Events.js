const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema(
    {
        account: {
            type: String,
            required: true
        },
        direction: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        eventCertainty: {
            type: Number,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        amountCertainty: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        dateCertainty: {
            type: Number,
            required: true
        },
        group: {
            type: String,
            default: undefined
        },
        requireGroup: {
            type: Boolean,
            default: false,
            required: true,
            // validate: {
            //     validator: function(value) {
            //         return value === 'true'
            //     }
            // },
        },
        eventDescriptor: {
            type: String,
            required: false
        },
        status: {
            type: String,
            required: true
        }
    }, 
    {
        collection: 'events'
    }
)

module.exports = mongoose.model('Events', EventSchema)