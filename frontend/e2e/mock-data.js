const mockProducts = [
  {
    _id: '1',
    name: 'Test Product 1',
    description: 'Description for product 1',
    price: 29.99,
    category: 'Electronics',
    image: 'https://via.placeholder.com/200',
    stock: 10,
  },
  {
    _id: '2',
    name: 'Test Product 2',
    description: 'Description for product 2',
    price: 49.99,
    category: 'Books',
    image: 'https://via.placeholder.com/200',
    stock: 5,
  },
  {
    _id: '3',
    name: 'Test Product 3',
    description: 'Description for product 3',
    price: 9.99,
    category: 'Clothing',
    image: 'https://via.placeholder.com/200',
    stock: 20,
  },
];

const mockPaginatedResponse = (page = 1, limit = 10) => ({
  data: mockProducts,
  pagination: {
    page,
    limit,
    totalItems: mockProducts.length,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  },
});

const mockMultiPageResponse = (page = 1, limit = 2) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = mockProducts.slice(start, end);
  const totalPages = Math.ceil(mockProducts.length / limit);
  return {
    data,
    pagination: {
      page,
      limit,
      totalItems: mockProducts.length,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

module.exports = { mockProducts, mockPaginatedResponse, mockMultiPageResponse };