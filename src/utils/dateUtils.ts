import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

export const formatDate = (date: string) => {
  return format(new Date(date), 'dd.MM.yyyy HH:mm:ss', { locale: ru })
}