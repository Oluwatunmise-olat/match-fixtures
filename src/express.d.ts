import { ObjectLiteral } from './shared/types/base.type'

declare module 'express-serve-static-core' {
	interface Request {
		user?: ObjectLiteral
	}
}
