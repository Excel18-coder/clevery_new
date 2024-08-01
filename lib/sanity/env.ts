import { env } from "../env";

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||'2023-09-25' || '2023-05-30'

export const dataset = env.sanityDataset;
export const projectId = env.sanityProjectId
export const useCdn = false
 