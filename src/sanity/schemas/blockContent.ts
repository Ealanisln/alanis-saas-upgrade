import {defineType, defineArrayMember} from 'sanity'

export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      // Estilos existentes
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [{title: 'Bullet', value: 'bullet'}],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    }),
    // Imagen
    defineArrayMember({
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }
      ]
    }),
    // Soporte para el tipo 'code' estándar (para usar en nuevos contenidos)
    defineArrayMember({
      name: 'code',
      title: 'Code Block',
      type: 'object',
      fields: [
        {
          name: 'code',
          title: 'Code',
          type: 'text',
        },
        {
          name: 'filename',
          title: 'Filename',
          type: 'string',
        },
        {
          name: 'language',
          title: 'Language',
          type: 'string',
          options: {
            list: [
              {title: 'JavaScript', value: 'javascript'},
              {title: 'JSX', value: 'jsx'},
              {title: 'TypeScript', value: 'typescript'},
              {title: 'TSX', value: 'tsx'},
              {title: 'HTML', value: 'html'},
              {title: 'CSS', value: 'css'},
              {title: 'Python', value: 'python'},
              {title: 'PHP', value: 'php'},
              {title: 'Shell', value: 'bash'},
              {title: 'JSON', value: 'json'},
            ],
          },
        },
      ],
      preview: {
        select: {
          title: 'filename',
          language: 'language',
          code: 'code',
        },
        prepare({title, language, code}: {title?: string, language?: string, code?: string}) {
          return {
            title: title || 'Code snippet',
            subtitle: language,
            media: () => '💻',
            description: code ? `${code.substring(0, 30)}...` : '',
          }
        },
      },
    }),
    // Soporte para myCodeField (para compatibilidad con contenido existente)
    defineArrayMember({
      name: 'myCodeField',
      title: 'Legacy Code Block',
      type: 'object',
      fields: [
        {
          name: 'code',
          title: 'Code',
          type: 'text',
        },
        {
          name: 'filename',
          title: 'Filename',
          type: 'string',
        },
        {
          name: 'language',
          title: 'Language',
          type: 'string',
          options: {
            list: [
              {title: 'JavaScript', value: 'javascript'},
              {title: 'JSX', value: 'jsx'},
              {title: 'TypeScript', value: 'typescript'},
              {title: 'TSX', value: 'tsx'},
              {title: 'HTML', value: 'html'},
              {title: 'CSS', value: 'css'},
              {title: 'Python', value: 'python'},
              {title: 'PHP', value: 'php'},
              {title: 'Shell', value: 'bash'},
              {title: 'JSON', value: 'json'},
            ],
          },
        },
      ],
      preview: {
        select: {
          title: 'filename',
          language: 'language',
          code: 'code',
        },
        prepare({title, language, code}: {title?: string, language?: string, code?: string}) {
          return {
            title: title || 'Legacy Code Block',
            subtitle: language,
            media: () => '🧩',
            description: code ? `${code.substring(0, 30)}...` : '',
          }
        },
      },
    }),
  ],
})