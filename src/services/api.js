const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Função auxiliar para fazer requisições
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro na requisição');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (userData) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getMe: async () => {
    return request('/auth/me');
  },
};

// Tickets API
export const ticketsAPI = {
  getAll: async () => {
    return request('/tickets');
  },

  getById: async (id) => {
    return request(`/tickets/${id}`);
  },

  create: async (ticketData) => {
    return request('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  },

  update: async (id, ticketData) => {
    return request(`/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ticketData),
    });
  },

  delete: async (id) => {
    return request(`/tickets/${id}`, {
      method: 'DELETE',
    });
  },
};

// Articles API
export const articlesAPI = {
  getAll: async () => {
    return request('/articles');
  },

  create: async (articleData) => {
    return request('/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  },

  update: async (id, articleData) => {
    return request(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(articleData),
    });
  },

  delete: async (id) => {
    return request(`/articles/${id}`, {
      method: 'DELETE',
    });
  },

  addFeedback: async (id, type) => {
    return request(`/articles/${id}/feedback`, {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    return request('/users');
  },

  getById: async (id) => {
    return request(`/users/${id}`);
  },

  getManagers: async () => {
    return request('/users/managers/list');
  },
};

