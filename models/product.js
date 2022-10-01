const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
    name: {
        type: String,
        require: [true, 'Name is required'],
        unique: true
    },
    status: {
        type: Boolean,
        require: [true, 'Status is required'],
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        default: [true, 'Category is required']
    },
    description: { type: String },
    avaliable: { type: Boolean, default: true } 
});

ProductSchema.methods.toJSON = function() {
    const { __v, status, ...data } = this.toObject();
    return data;
}

module.exports = model('Product', ProductSchema);