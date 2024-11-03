
const mongoose = require("mongoose")
const Schema = mongoose.Schema


const travelStorySchema = new Schema({

    title:{type: String,required: true},
    story:{type: String,required: true},
    visitedLocation:{type: [String],default:[]},
    isFavourite: {type: Boolean,default:false},
    createdOn: {type: Date,default: Date.now},
    imageUrl:{type:String,required:true},
    visitedDate:{type:Date,required:true},
    userId: { type: mongoose.Schema.Types.ObjectId, required: true } 

})

module.exports = mongoose.model("TravelStory",travelStorySchema)