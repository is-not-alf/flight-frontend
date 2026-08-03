import apiClient from '../client';
import type { AirportData } from './airportService';
import type { AircraftData } from './aircraftService';
import type { PassengerData } from './passengerService';

export type FlightRequest = {
  flightNumber: string;
  arrivalTime: Date;
  departureTime: Date;
  arrivalAirportId: number;
  departureAirportId: number;
  aircraftId: number;
}

export type FlightData = {
  id?: number | null;
  flightNumber: string | null;
  arrivalTime: Date | null;
  departureTime: Date | null;
  arrivalAirport: AirportData | null;
  departureAirport: AirportData | null;
  aircraft: AircraftData | null;
}

export interface PageResponse<T> {
  content: T[]
  page: number
  rows: number
  totalElements: number
  totalPages: number
  first: boolean
}

const getFlights = async (params: { page: number, size: number }): Promise<PageResponse<FlightData>> => {
  const response = await apiClient.get(`/api/flights`, { params });
  return response.data;
};

const getFlightById = async (id: number | null): Promise<FlightData> => {
  const response = await apiClient.get<FlightData>(`/api/flights/${id}`);

  const responseData = response.data;
  responseData.arrivalTime = responseData.arrivalTime ? new Date(responseData.arrivalTime) : null;
  responseData.departureTime = responseData.departureTime ? new Date(responseData.departureTime) : null;

  return responseData;
};

const createFlight = async (data: FlightRequest) => {
  const response = await apiClient.post<FlightData>('/api/flights', data);
  return response.data;
};

const updateFlight = async (id: number, data: FlightRequest) => {
  const response = await apiClient.put<FlightData>(`/api/flights/${id}`, data);
  return response.data;
};

const createOrUpdateFlight = async (id: number | null, data: FlightData) => {
  const request: FlightRequest = {
    flightNumber: data.flightNumber as string,
    arrivalTime: data.arrivalTime as Date,
    departureTime: data.departureTime as Date,
    arrivalAirportId: data.arrivalAirport?.id as number,
    departureAirportId: data.departureAirport?.id as number,
    aircraftId: data.aircraft?.id as number,
  };
  if (id) {
    return await updateFlight(id, request);
  }
  return await createFlight(request);
};

const deleteFlight = async (id: number) => {
  const response = await apiClient.delete(`/api/flights/${id}`);
  return response.data;
};

const getPassengersByFlightId = async (id: number | null): Promise<PassengerData[]> => {
  const response = await apiClient.get(`/api/flights/${id}/passengers`);
  return response.data;
};

const createPassenger = async (flightId: number | null, data: PassengerData) => {
  const response = await apiClient.post(`/api/flights/${flightId}/passengers`, data);
  return response.data;
};

export default { getFlights, getFlightById, createFlight, updateFlight, createOrUpdateFlight, deleteFlight, getPassengersByFlightId, createPassenger };