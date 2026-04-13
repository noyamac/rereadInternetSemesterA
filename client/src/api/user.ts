import axios from 'axios';

const api = axios.create({
  baseURL: '/user',
  headers: { 'Content-Type': 'application/json' },
});

export const userApi = {
  getUser: (userId: string) => api.get(`/${userId}`).then((r) => r.data),
};
