import mongoose from "mongoose";

type ConnectOptions = {
    isConnected?: number;
};

 const connection : ConnectOptions = {};

 async function dbConnect(): Promise<void> {
    if( connection.isConnected ) {
        console.log("already connected to database");        
        return;
    }
    try {
        const db=await mongoose.connect(process.env.MONGODB_URI || "",{});
        connection.isConnected = db.connections[0].readyState;
        console.log("db conneted successfully");
        console.log(connection.isConnected);
    } catch (error) {
        console.log("error connecting to db",error);
        process.exit(1);
    }
 }
 export default dbConnect;