import apiClient from '../client';

export type AirportData = {
  id?: number | null;
  name: string | null;
  code: string | null;
  city: string | null;
}

const getAirports = async () => {
  const response = await apiClient.get(`/api/airports`);
  return response.data;
};

export default { getAirports };