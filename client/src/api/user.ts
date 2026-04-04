import axios from 'axios';

const api = axios.create({
  baseURL: '/books',
  headers: { 'Content-Type': 'application/json' },
});

export const userApi = {
  getUser: (userId: string) => api.get(`/user/${userId}`).then((r) => r.data),
};
