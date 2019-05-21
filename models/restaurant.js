var mongoose    = require("mongoose");
    Comment     = require("./comment");

var restaurantSchema = new mongoose.Schema({
    name: String,
    location: String,
    price: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

restaurantSchema.pre("remove", async function(){
    await Comment.remove({
        _id: {
            $in: this.comments
        }
    });
});

module.exports = mongoose.model("Restaurant", restaurantSchema);