import mongoose, { Document, Schema } from "mongoose";
import connectDB from "../db";

export interface ITranslation extends Document{
    timestamp: Date;
    fromText: string;
    toText: string;
    from: string;
    to: string;
}


interface IUser extends Document{
    userId: string;
    translations: Array<ITranslation>;
}


const translationSchema = new Schema<ITranslation>({
    timestamp: { type: Date, default: Date.now() },
    fromText: String,
    toText: String,
    from: String,
    to: String,
})

const userSchema = new Schema<IUser>({
    userId: String,
    translations: [translationSchema]
})

// check if the user is already exists to prevent overwriting

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);


export async function addOrUpdateUser(userId: string, translation: {
    fromText: string;
    toText: string;
    from: string;
    to: string;
}): Promise <IUser> {
    
    const filter = { userId: userId }
    const update = {
        $set: { userId: userId },
        $push: { translations: translation }
    }

    await connectDB();

    const options = { upsert: true, new: true, setDefaultsOnInsert: true }
    
 
    try{
        const user: IUser | null = await User.findOneAndUpdate(
        filter,
        update,
        options
        );
        console.log("User added or updated: ", user)
        if(!user){
            throw new Error("User not found or not created!");
        }
        return user;
        }catch(err) {
            console.log("Error adding or updating user", err)
            throw err;
        }
}

export async function getTranslations(userId: string): Promise<Array<ITranslation>>{
    await connectDB();
    try {
        const user: IUser | null = await User.findOneAndUpdate({ userId: userId })
        if (user) {
            user.translations.sort((a: ITranslation, b: ITranslation) => b.timestamp.getTime() - a.timestamp.getTime())
            return user.translations;
        } else {
            console.log(`User with id ${userId} not found`)
            return [];
        }
    } catch (err) {
        console.log("Error getting translations: ", err)
        throw err;
    }
}

export async function removeTranslation(userId: string, translationId: string): Promise<IUser>{
    await connectDB();

    try {
        const user: IUser | null = await User.findOneAndUpdate(
            { userId: userId }, // Find the user with the given userId
            { $pull: { translations: { _id: translationId } } }, // Remove the translation with the given _id
            { new: true } // Return the updated document
        );
        if (!user) {
             throw new Error("User not found.");
        } 
        console.log("Translation removed:", user);
        
        return user;
    } catch (err) {
        console.log("Error removing translations: ", err)
        throw err;
    }
}