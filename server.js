const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const teamMemberRoutes = require("./routes/teamMemberRoutes");
const bookRoutes = require("./routes/bookRoutes");
const donationRoutes = require("./routes/donationCampaignRoutes");
const socialEventRoutes = require("./routes/socialEventRoutes");
const newsArticleRoutes = require("./routes/newsArticleRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const AnalyticsRoutes = require("./routes/analyticsRoutes")
const AuthRoutes = require("./routes/authRoute");

const app = express();
dotenv.config();

// console.log(process.env);

app.use(cors());
app.use(express.json());
app.use(cookieParser());

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
app.use("/api", socialEventRoutes);
app.use("/api", newsArticleRoutes);
app.use("/api", volunteerRoutes);
app.use("/api", AnalyticsRoutes);
app.use("/api", AuthRoutes);


app.listen(process.env.PORT, () => {
console.clear()
  console.log(`Server is running on port ${process.env.PORT}`);
});

