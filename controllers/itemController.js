const Item = require('../models/item');

// Retrieve all items from the database with pagination
exports.getAllItems = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1; // Get the page number from the query parameters, default to page 1
  const limit = parseInt(req.query.limit) || 10; // Get the limit from the query parameters, default to 10 items per page

  try {
    const totalItems = await Item.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    const items = await Item.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      page,
      limit,
      totalPages,
      totalItems,
      items,
    });
  } catch (error) {
    next(error);
  }
};

// Retrieve a specific item by its ID
exports.getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
};

// Create a new item in the database
exports.createItem = async (req, res, next) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    next(error);
  }
};

// Update an existing item by its ID
exports.updateItem = async (req, res, next) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
};

// Delete an item by its ID
exports.deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
