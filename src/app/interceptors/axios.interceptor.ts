import axios from 'axios';
import { environment } from 'src/environments/environment';

const apiClient = axios.create({
  baseURL: `${environment.apiUrl}`, // URL base da API
});

// Configurando o interceptor para adicionar o token JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt'); // Obtém o token do localStorage
    if (token && !config.url?.includes('/login')) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Rejeita caso haja erro
  },
);

export { apiClient };
