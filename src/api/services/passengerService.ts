import apiClient from '../client';

export type PassengerData = {
  id?: number | null;
  firstName: string | null;
  lastName: string | null;
  passportNumber: string | null;
  flightId: number | null;
}

const getPassengers = async () => {
  const response = await apiClient.get(`/api/passengers`);
  return response.data;
};

const deletePassenger = async (id: number) => {
  const response = await apiClient.delete(`/api/passengers/${id}`);
  return response.data;
};

export default { getPassengers, deletePassenger };