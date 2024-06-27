import { createClient } from '@sanity/client'

import { apiVersion,projectId,dataset, useCdn,token } from './env'

export const client = createClient({
  apiVersion,
  projectId,
  dataset,
  useCdn,
  token
})