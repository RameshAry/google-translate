
import mongoose from "mongoose";
const connectionString = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@google-translate.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000`

if (!connectionString) {
    throw new Error("Please define a MONGO_DB_USERNAME and a MONGO_DB_PASSWORD inside the .env.local configuration!")
}

const connectDB = async () => {
    if (mongoose.connection?.readyState >= 1) {
        console.log("Already connected to the MangoDB!")
        return;
    }
    try {
        await mongoose.connect(connectionString);
    } catch (err) {
        console.log("Error connecting to database: ", err)
    }
   
}

export default connectDB;