
// Above is code by instructor and below is same code refined by chatgpt due to some errors


// import mongoose from "mongoose";

// const dbConnect = async () => {
//   try {
//     mongoose.set("strictQuery", false);

//     const MONGODB_URI = process.env.MONGODB_URI;

//     if (!MONGODB_URI) {
//       console.error("Error: URI not found in environment variables");
//       process.exit(1);
//     }

//     const connected = await mongoose.connect(MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log(`Mongodb Connected to ${connected.connection.host}`);
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// export default dbConnect;


import mongoose from "mongoose";
const dbConnect = async () => {
  try {
    mongoose.set("strictQuery", false);
    const connected = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Mongodb connected ${connected.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default dbConnect;