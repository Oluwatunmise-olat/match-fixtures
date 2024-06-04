export type PlayersDto = {
	name: string
	number: number
	position: string
}

export type CreateTeamDto = {
	name: string
	stadium: string
	players: Array<PlayersDto>
}
