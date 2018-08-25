module.exports = (sequelize, DataTypes) => {
  const Track = sequelize.define('track', {
    artist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unique_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  }, {
    scopes: {
      withTags: {
        include: [{
          model: sequelize.models.tag,
          attributes: ['name'],
          through: { attributes: [] },
        }],
      },
    },
  });

  Track.associate = function (models) {
    Track.belongsTo(models.artist, {
      foreignKey: 'artist_id',
    });

    Track.belongsTo(models.playlist, {
      foreignKey: 'artist_id',
    });

    Track.belongsToMany(models.tag, {
      foreignKey: 'track_id',
      through: 'track_tag',
    });
  };
  return Track;
};

