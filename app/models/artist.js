module.exports = (sequelize, DataTypes) => {
  const Artist = sequelize.define('artist', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    public_profiles: {
      type: DataTypes.TEXT,
    },
  });

  Artist.associate = function (models) {
    Artist.hasMany(models.track, {
      foreignKey: 'artist_id',
    });
    Artist.hasMany(models.playlist, {
      foreignKey: 'artist_id',
    });
  };
  return Artist;
};

