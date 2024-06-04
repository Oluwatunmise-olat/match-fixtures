export const setPaginationLimit = (limit?: string | number) => {
	let _limit_ = limit ? Number(limit) : 20

	if (_limit_ > 50) _limit_ = 100

	return _limit_
}
