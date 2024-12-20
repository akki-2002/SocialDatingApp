import axios from 'axios'


const API = axios.create({ baseURL: 'http://localhost:5000' });

export const getMessages = (chatId) => API.get(`/message/${chatId}`);

export const addMessage = (message) => API.post('/message', message);