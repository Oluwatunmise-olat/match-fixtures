import dayjs from 'dayjs'

export const formatDate = (date: string | Date, format: string) => {
	return dayjs(date).format(format)
}
