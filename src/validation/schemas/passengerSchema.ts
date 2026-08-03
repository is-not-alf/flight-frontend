import { z } from 'zod'
import { requiredString } from '../common'

export const passengerSchema = z.object({
  firstName: requiredString('Имя является обязательным'),
  lastName: requiredString('Фамилия является обязательным'),
  passportNumber: requiredString('Номер паспорта является обязательным'),
})