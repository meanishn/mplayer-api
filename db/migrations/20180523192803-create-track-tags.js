module.exports = {
  up: (queryInterface, Sequelize) =>
      queryInterface.createTable('track_tags', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        track_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        tag_id: {
          type: Sequelize.INTEGER,
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
      queryInterface.dropTable('track_tags'),
};
