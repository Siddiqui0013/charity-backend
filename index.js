const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const teamMemberRoutes = require("./routes/teamMemberRoutes");
const bookRoutes = require("./routes/bookRoutes");
const donationRoutes = require("./routes/donationCampaignRoutes");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

mongoose
  .connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}` )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Hello World dfffffffffffffff!");
});

app.use("/api", teamMemberRoutes);
app.use("/api", bookRoutes);
app.use("/api", donationRoutes);

app.listen(process.env.PORT, () => {
console.clear()
  console.log(`Server is running on port ${process.env.PORT}`);
});