const {
    Schema,
    model
} = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: String,
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            count: {
                type: Number,
                require: true,
                default: 1
            },
            courseId: {
                type: Schema.Types.ObjectId,
                ref: 'Course',
                require: true
            }
        }]
    },
    resetToken: String,
    resetTokenExp: Date,
    avatarUrl: String
})

userSchema.methods.addToCard = function (course) {
    const items = [...this.cart.items];
    const idx = items.findIndex(c => {
        return c.courseId.toString() === course._id.toString();
    })
    if (!!items[idx]) {
        items[idx].count = ++items[idx].count;
    } else {
        items.push({
            courseId: course._id,
            count: 1
        })
    }
    this.cart = {
        items
    };
    return this.save();
}

userSchema.methods.removeFromCart = function (id) {
    let items = [...this.cart.items];
    const idx = items.findIndex(c => c.courseId.toString() === id.toString());

    if(items[idx].count === 1) {
        items = items.filter(course => course.courseId.toString() !== id.toString());
    } else {
        items[idx].count--;
    }

    this.cart = {items};
    return this.save();
}

userSchema.methods.clearCart = function () {
   
    this.cart = {items: []}
    return this.save();
}

module.exports = model('User', userSchema);