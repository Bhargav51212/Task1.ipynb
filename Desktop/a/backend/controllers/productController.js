const Product = require('../models/Product');
const path = require('path');

// Get all products with search and filtering
exports.getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, sort, featured } = req.query;
    const query = {};

    // Handle category filtering with proper case
    if (category) {
      // Ensure first letter is uppercase and rest is lowercase
      const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
      // Check if the category is valid according to the schema
      if (['Silk', 'Cotton', 'Georgette', 'Chiffon', 'Other'].includes(formattedCategory)) {
        query.category = formattedCategory;
      }
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (featured === 'true') {
      query.featured = true;
    }

    let sortOption = { createdAt: -1 }; // Default sort by newest first
    if (sort) {
      switch (sort) {
        case 'price_asc':
          sortOption = { price: 1 };
          break;
        case 'price_desc':
          sortOption = { price: -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    }

    console.log('Query:', query);
    const products = await Product.find(query).sort(sortOption);
    console.log(`Found ${products.length} products`);
    
    res.status(200).json(products);
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, featured, discount, material, color, size } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];

    const product = new Product({
      name,
      description,
      price,
      category,
      images,
      stock,
      featured,
      discount,
      material,
      color,
      size
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, featured, discount, material, color, size } = req.body;
    const updateData = {
      name,
      description,
      price,
      category,
      stock,
      featured,
      discount,
      material,
      color,
      size
    };

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.path);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 