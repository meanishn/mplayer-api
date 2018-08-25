module.exports = (sequelize, DataTypes) => {
  const Playlist = sequelize.define('playlist', {
    artist_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Playlist.associate = function (models) {
    Playlist.hasMany(models.track, {
      foreignKey: 'artist_id',
    });
  };

  return Playlist;
};

