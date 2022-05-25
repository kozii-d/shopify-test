import mongoose from "mongoose";

const mongoStoreSchema = new mongoose.Schema({
    id: String,
    data: Object
})

export const MongoStoreModel = mongoose.model("mongoStore", mongoStoreSchema);