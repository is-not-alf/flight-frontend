import { z } from 'zod'
import { requiredString, requiredDate, requiredSelect } from '../common'

export const flightSchema = z.object({
  id: z.number().optional().nullable(),
  flightNumber: requiredString('Номер рейса является обязательным'),
  departureAirport: requiredSelect('Аэропорт вылета является обязательным'),
  arrivalAirport: requiredSelect('Аэропорт прилета является обязательным'),
  departureTime: requiredDate('Время вылета является обязательным'),
  arrivalTime: requiredDate('Время прилета является обязательным'),
  aircraft: requiredSelect('Самолёт является обязательным'),
})
.refine(
  (data) => {
    return data.departureTime && data.arrivalTime && data.departureTime < data.arrivalTime;
  },
  {
    message: 'Время вылета должно быть строго меньше времени прилета',
    path: ['departureTime'], 
  }
);