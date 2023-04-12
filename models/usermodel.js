const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        userid: {
            type: Number,
            required: true
        },
        notify: {
            type: Boolean,
            required: true,
            default: 0
        },
        tempAir: {
            type: Number,
            required: true,
        },
        humidAir: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true
    }
)


const User = mongoose.model('User', userSchema);

module.exports = User;