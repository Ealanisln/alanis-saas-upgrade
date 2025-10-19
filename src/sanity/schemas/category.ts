import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'description',
      title: 'Description',
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
      title: 'title',
    },
    prepare(selection) {
      const {title} = selection
      // Get the English title or first available title
      // Support both _key (from plugin) and language (from custom structure)
      let displayTitle = 'Untitled';

      if (typeof title === 'string') {
        displayTitle = title;
      } else if (Array.isArray(title)) {
        const enTitle = title.find((t: any) => t._key === 'en' || t.language === 'en');
        if (enTitle?.value) {
          displayTitle = typeof enTitle.value === 'string' ? enTitle.value : JSON.stringify(enTitle.value);
        } else if (title[0]?.value) {
          displayTitle = typeof title[0].value === 'string' ? title[0].value : JSON.stringify(title[0].value);
        }
      }

      return {
        title: displayTitle,
      }
    },
  },
})
