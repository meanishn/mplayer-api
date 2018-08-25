module.exports = (sequelize, DataTypes) => {
  const TrackTag = sequelize.define('track_tag', {
    track_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tag_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return TrackTag;
};

