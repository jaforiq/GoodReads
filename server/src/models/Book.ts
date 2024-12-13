import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface BookAttributes {
  id: number;
  title: string;
  details: string;
  thumbnailUrl: string;
  AuthorName: string;
  PublisherName: string;
  userId: Number;
}

interface BookCreationAttributes extends Optional<BookAttributes, "id"> {}

class Book
  extends Model<BookAttributes, BookCreationAttributes>
  implements BookAttributes
{
  public id!: number;
  public title!: string;
  public details!: string;
  public thumbnailUrl!: string;
  public AuthorName!: string;
  public PublisherName!: string;
  public userId!: number; // Foreign key for User

  static initModel(sequelize: Sequelize) {
    Book.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        details: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        thumbnailUrl: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        AuthorName: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        PublisherName: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
        },
      },
      {
        sequelize,
        tableName: "books",
      }
    );
  }
}

export default Book;
