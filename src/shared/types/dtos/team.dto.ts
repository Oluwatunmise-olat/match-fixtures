export type PlayersDto = {
	name: string
	position: string
}

export type CreateTeamDto = {
	name: string
	stadium: string
	players: Array<PlayersDto>
}
