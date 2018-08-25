

module.exports = {
  up(queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.addColumn('tracks', 'unique_id', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    });
  },

  down(queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.removeColumn('tracks', 'unique_id');
  },
};
