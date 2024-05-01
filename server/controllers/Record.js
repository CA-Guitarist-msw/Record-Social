const models = require('../models');

const { Record } = models;

const makerPage = (req, res) => res.render('app');

const makeRecord = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.level) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  const recordData = {
    name: req.body.name,
    age: req.body.age,
    level: req.body.level,
    owner: req.session.account._id,
  };

  try {
    const newRecord = new Record(recordData);
    await newRecord.save();
    const statusJSON = { name: newRecord.name, age: newRecord.age, level: newRecord.level };
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
    const docs = await Record.find(query).select('name age level').lean().exec();

    return res.json({ records: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving records!' });
  }
};

module.exports = {
  makerPage,
  makeRecord,
  getRecords,
};
