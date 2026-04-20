import axios from 'axios';

const BASE_URL = 'https://fakestoreapi.com';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchProducts = async () => {
  const response = await apiClient.get('/products');
  return response.data;
};

export const fetchProductById = async (id) => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
};

export const fetchCategories = async () => {
  const response = await apiClient.get('/products/categories');
  return response.data;
};

export default apiClient;
