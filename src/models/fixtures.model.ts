import mongoose from 'mongoose'
import { container } from 'tsyringe'

import FixturesSchema from './schema/fixtures.schema'
import { ModelNames } from '@app/shared/enums/models.enum'

const fixturesModelSchema = container.resolve(FixturesSchema)

export default mongoose.model(ModelNames.FIXTURES, fixturesModelSchema.schema)
