import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Name is shared across all languages',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      description: 'Slug is shared across all languages',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }
      ]
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'internationalizedArrayText',
    }),
  ],

  fieldsets: [
    {
      name: 'translations',
      title: 'Translations',
      options: { collapsible: true, collapsed: false }
    }
  ],

  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
})
