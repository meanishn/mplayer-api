module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('tag', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Tag.associate = function (models) {
    Tag.belongsToMany(models.track, {
      foreignKey: 'tag_id',
      through: 'track_tag',
    });
  };

  return Tag;
};

