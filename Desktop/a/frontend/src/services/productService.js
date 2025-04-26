import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products';

const createProduct = async (productData) => {
  const formData = new FormData();
  
  // Append all product data to FormData
  Object.keys(productData).forEach(key => {
    if (key === 'image' && productData[key]) {
      formData.append('image', productData[key]);
    } else {
      formData.append(key, productData[key]);
    }
  });

  const response = await axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const updateProduct = async (id, productData) => {
  const formData = new FormData();
  
  // Append all product data to FormData
  Object.keys(productData).forEach(key => {
    if (key === 'image' && productData[key]) {
      formData.append('image', productData[key]);
    } else {
      formData.append(key, productData[key]);
    }
  });

  const response = await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

const getProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getProductById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export default {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
}; 