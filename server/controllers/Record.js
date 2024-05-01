const models = require('../models');

const { Record } = models;

const recorderPage = (req, res) => res.render('app');

const createRecord = async (req, res) => {
  if (!req.body.albumTitle || !req.body.comments || !req.body.rating) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  const recordData = {
    albumTitle: req.body.albumTitle,
    comments: req.body.comments,
    rating: req.body.rating,
    owner: req.session.account._id,
  };

  try {
    const newRecord = new Record(recordData);
    await newRecord.save();
    const statusJSON = {
      albumTitle: newRecord.albumTitle,
      comments: newRecord.comments,
      rating: newRecord.rating
    };
    return res.status(201).json(statusJSON);
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Record already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making record!' });
  }
};

const getRecords = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Record.find(query).select('albumTitle comments rating').lean().exec();

    return res.json({ records: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving records!' });
  }
};

module.exports = {
  recorderPage,
  createRecord,
  getRecords,
};
