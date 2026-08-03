import apiClient from '../client';

export type AircraftData = {
  id?: number | null;
  model: string | null;
  capacity: number | null;
}

const getAircrafts = async () => {
  const response = await apiClient.get(`/api/aircrafts`);
  return response.data;
};

export default { getAircrafts };