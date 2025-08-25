import axios from "axios";
import { API_BASE_URL } from "../config";

// Check if backend is running
export async function checkBackendHealth() {
  try {
    // Try multiple possible health endpoints
    const healthEndpoints = [
      '/health',
      '/api/health', 
      '/status',
      '/ping',
      '/'
    ];
    
    for (const endpoint of healthEndpoints) {
      try {
        console.log(`Trying health check at: ${API_BASE_URL}${endpoint}`);
        const response = await axios.get(`${API_BASE_URL}${endpoint}`, { 
          timeout: 3000,
          validateStatus: (status) => status < 500 // Accept any status < 500 as "running"
        });
        console.log(`Health check successful at ${endpoint}:`, response.status);
        return { isRunning: true, data: response.data, endpoint };
      } catch (endpointError) {
        console.log(`Health check failed at ${endpoint}:`, endpointError.message);
        continue; // Try next endpoint
      }
    }
    
    // If all endpoints fail, try a simple connection test
    try {
      console.log('Trying simple connection test...');
      const response = await axios.get(`${API_BASE_URL}`, { timeout: 3000 });
      console.log('Simple connection successful:', response.status);
      return { isRunning: true, data: response.data, endpoint: '/' };
    } catch (connectionError) {
      console.log('Simple connection failed:', connectionError.message);
      return { isRunning: false, error: 'All health check endpoints failed' };
    }
    
  } catch (error) {
    console.error('Health check error:', error);
    return { isRunning: false, error: error.message };
  }
}

export async function analyzeUrl({ url, industry }) {
  const { data } = await axios.post(`${API_BASE_URL}/api/analyze`, { url, industry });
  return data; // { templateId, meta, siteContent, siteContentJs }
}

export async function analyzeSeed({ companyName, industry }) {
  const { data } = await axios.post(`${API_BASE_URL}/api/analyze`, { companyName, industry });
  return data;
}
