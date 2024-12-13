import { DataTypes, Model, Sequelize } from "sequelize";

class Wishlist extends Model {
  public id!: Number;
  public bookId!: Number;
  public userId!: Number;

  static initModel(sequelize: Sequelize) {
    Wishlist.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        bookId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "books",
            key: "id",
          },
          primaryKey: true,
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
        tableName: "wishlist",
      }
    );
  }
}

export default Wishlist;
