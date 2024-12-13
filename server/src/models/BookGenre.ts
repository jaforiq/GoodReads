import { DataTypes, Model, Sequelize } from "sequelize";

class BookGenre extends Model {
  public id!: Number;
  public eventId!: Number;
  public genreId!: Number;

  static initModel(sequelize: Sequelize) {
    BookGenre.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        bookId: {
          type: DataTypes.INTEGER,
          references: {
            model: "books",
            key: "id",
          },
        },
        genreId: {
          type: DataTypes.INTEGER,
          references: {
            model: "genres",
            key: "id",
          },
        },
      },
      {
        sequelize,
        tableName: "book_genres",
      }
    );
  }
}

export default BookGenre;
