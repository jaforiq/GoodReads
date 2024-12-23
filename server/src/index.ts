import cors from "cors";
import path from "path";
import express from "express";
import sequelize from "./models/index";
import userRoutes from "./routes/userRoute";
import bookRoutes from "./routes/bookRoute";
import genreRoutes from "./routes/genreRoute";
import reviewRoutes from "./routes/reviewRoute";
import wishlistRoutes from "./routes/wishlistRoute";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const imagesPath = path.join(__dirname, "images");
app.use("/images", express.static(imagesPath));

app.use(express.json());
app.use("/api/genres", genreRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/wishlist", wishlistRoutes);

sequelize.sync({ alter: true }).then(() => {
  console.log("Database connected and all table created");
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

// import cors from "cors";
// import express from "express";
// import path from "path";
// import sequelize from "./models/index";
// import userRoutes from "./routes/userRoute";
// import bookRoutes from "./routes/bookRoute";
// import genreRoutes from "./routes/genreRoute";
// import reviewRoutes from "./routes/reviewRoute";
// import wishlistRoutes from "./routes/wishlistRoute";

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// // Middleware to parse JSON
// app.use(express.json());

// // Serve static files from the "images" directory
// app.use("/images", express.static(path.join(__dirname, "images")));

// // API Routes
// app.use("/api/genres", genreRoutes);
// app.use("/api/reviews", reviewRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/books", bookRoutes);
// app.use("/api/wishlist", wishlistRoutes);

// // Start the server and sync database
// sequelize.sync({ alter: true }).then(() => {
//   console.log("Database connected and all tables created");
//   app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
//     console.log(`Static images available at http://localhost:${PORT}/images`);
//   });
// });
