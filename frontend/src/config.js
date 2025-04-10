
const getApiBaseUrl = () => {
  if (window.location.hostname === "localhost" || window.location.hostname === "0.0.0.0") {
    return "http://localhost:5001/api";
  }
  return `https://${window.location.hostname}/api`;
};

export const API_BASE_URL = getApiBaseUrl();
