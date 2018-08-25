module.exports = {
  up: (queryInterface, Sequelize) =>
        queryInterface.createTable('users', {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          email: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          password: {
            type: Sequelize.STRING(128),
            allowNull: false,
          },
          role: {
            type: Sequelize.ENUM('none', 'user', 'admin'),
            allowNull: false,
          },
          hash: {
            type: Sequelize.STRING(32),
            defaultValue: null,
          },
          active: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        }),

  down: (queryInterface, Sequelize) =>
        queryInterface.dropTable('users'),
};
