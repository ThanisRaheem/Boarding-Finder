import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const hashedAdmin = await bcrypt.hash("Abc123", 10);
  await User.findOneAndUpdate(
    { email: "admin@gmail.com" },
    {
      name: "Campus Admin",
      email: "admin@gmail.com",
      password: hashedAdmin,
      role: "admin",
    },
    { upsert: true, new: true }
  );

  const ownerHash = await bcrypt.hash("Abc123", 10);
  await User.findOneAndUpdate(
    { email: "owner@gmail.com" },
    {
      name: "Campus Owner",
      email: "owner@gmail.com",
      password: ownerHash,
      role: "owner",
    },
    { upsert: true, new: true }
  );

  console.log(
    "Seed complete: admin@gmail.com / Abc123 · owner@gmail.com / Abc123"
  );
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
