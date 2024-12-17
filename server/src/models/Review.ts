import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface ReviewAttributes {
  id: number;
  rating: number;
  review: Text;
  userId: number;
  bookId: number;
}

interface ReviewCreationAttributes extends Optional<ReviewAttributes, "id"> {}

class Review
  extends Model<ReviewAttributes, ReviewCreationAttributes>
  implements ReviewAttributes
{
  public id!: number;
  public rating!: number;
  public review!: Text;
  public userId!: number;
  public bookId!: number;

  static initModel(sequelize: Sequelize) {
    Review.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        rating: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        review: {
          type: DataTypes.TEXT,
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
        bookId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "books",
            key: "id",
          },
        },
      },
      {
        sequelize,
        tableName: "reviews",
        timestamps: true,
      }
    );
  }
}

export default Review;
