import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

export const client = createClient({
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
    dataset: 'stories',
    apiVersion: '2023-03-20',
    useCdn: true,
    token: import.meta.env.VITE_SANITY_API_TOKEN,

})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
    return builder.image(source)
  }

//   const data = await client.fetch<number>(`count(*)`)
//   // data is typed as `number`
//   console.log(`Number of documents: ${data}`)