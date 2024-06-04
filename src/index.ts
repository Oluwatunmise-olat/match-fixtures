import ExpressApp from './app'
import { appConfig } from './config'

export const expressApp = new ExpressApp()

process.on('SIGINT', () => {
	expressApp.close()
	process.exit(1)
})

expressApp
	.listen(appConfig.port)
	.then(() => {
		console.info('🚀 Server is listening on port %o in %s mode', appConfig.port, appConfig.env)
	})
	.catch((error) => {
		console.error({ err: error })
		process.exit(1)
	})
