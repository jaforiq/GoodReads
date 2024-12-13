import User from "./User";
import Genre from "./Genre";
import Book from "./Book";
import Review from "./Review";
import Wishlist from "./Wishlist";
import BookGenre from "./BookGenre";
import { Sequelize } from "sequelize";
import dbConfig from "../config/dbConfig";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect as any,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

User.initModel(sequelize);
Book.initModel(sequelize);
Genre.initModel(sequelize);
BookGenre.initModel(sequelize);
Review.initModel(sequelize);
Wishlist.initModel(sequelize);

//User and Event one to many
User.hasMany(Book, { foreignKey: "userId" });
Book.belongsTo(User, { foreignKey: "userId" });

// Book and Genre many to many relations
Book.belongsToMany(Genre, { through: BookGenre, foreignKey: "bookId" });
Genre.belongsToMany(Book, { through: BookGenre, foreignKey: "genreId" });

// User and Book Review many to many relations
Book.belongsToMany(User, { through: Review, foreignKey: "bookId" });
User.belongsToMany(Book, { through: Review, foreignKey: "userId" });

// User and Book many to many relations through Wishlist
Book.belongsToMany(User, { through: Wishlist, foreignKey: "bookId" });
User.belongsToMany(Book, { through: Wishlist, foreignKey: "userId" });

export default sequelize;
export { User, Book, Genre, BookGenre, Review };
