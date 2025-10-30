import {defineField, defineType} from 'sanity'

interface I18nArrayItem {
  _key?: string;
  language?: string;
  value: string;
}

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title.en',
        maxLength: 96,
      },
      description: 'Slug is shared across all languages',
    }),
    defineField({
      name: 'smallDescription',
      title: 'Small Description',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
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
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'internationalizedArrayBlockContent',
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
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author, title} = selection
      // Get the English title or first available title
      // Support both _key (from plugin) and language (from custom structure)
      let displayTitle = 'Untitled';

      if (typeof title === 'string') {
        displayTitle = title;
      } else if (Array.isArray(title)) {
        const enTitle = title.find((t: I18nArrayItem) => t._key === 'en' || t.language === 'en');
        if (enTitle?.value) {
          displayTitle = typeof enTitle.value === 'string' ? enTitle.value : JSON.stringify(enTitle.value);
        } else if (title[0]?.value) {
          displayTitle = typeof title[0].value === 'string' ? title[0].value : JSON.stringify(title[0].value);
        }
      }

      return {
        title: displayTitle,
        subtitle: author && `by ${author}`,
        media: selection.media
      }
    },
  },
})
