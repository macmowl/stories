import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'navy-tapir',

  projectId: 'vp5mtbh5',
  dataset: 'stories',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
