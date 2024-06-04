export type PaginationQs = { page: string; limit?: string }

export type FixtureQs = {
	status?: string
	stadium?: string
	team_id?: string
	start_date?: string
	end_date?: string
} & PaginationQs

export type TeamQs = { name?: string; coach?: string } & PaginationQs

export type UserQs = { username?: string } & PaginationQs

export type SearchQs = { query: string } & PaginationQs
