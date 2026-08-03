import { z } from 'zod'

export const requiredString = (message: string) => z.string({ 
  required_error: message, 
  invalid_type_error: message
}).min(1, message).nullable()

export const requiredNumber = (message: string) => z.number({ 
  required_error: message, 
  invalid_type_error: message
}).min(1, message).nullable()

export const requiredDate = (message: string) => z.date({ 
  required_error: message, 
  invalid_type_error: message
}).nullable()

export const requiredSelect = (message: string) => z.object({ 
  id: z.number().min(1, message).nullable(),
})
.nullable()
.refine((val) => val !== null, { message: message })