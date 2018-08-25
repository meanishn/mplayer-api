module.exports = {
  up: (queryInterface, Sequelize) =>
      queryInterface.createTable('artists', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        rating: {
          type: Sequelize.INTEGER,
          defaultValue: 1,
        },
        public_profiles: {
          type: Sequelize.TEXT,
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
      queryInterface.dropTable('artists'),
};
