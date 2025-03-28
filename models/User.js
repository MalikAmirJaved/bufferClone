import mongoose, { Schema } from 'mongoose'

const userSchema = new mongoose.Schema({
    facebookAccessToken,
    facebookPageId,
});

export const user = mongoose.model('user', userSchema);