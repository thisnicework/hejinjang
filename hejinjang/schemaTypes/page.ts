import { defineType, defineField } from 'sanity';

export const pageType = defineType({
  name: 'page',
  title: 'Page (페이지)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title (페이지 제목)',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'path',
      title: 'URL Path (URL 경로, 예: /about-bio)',
      type: 'string',
      validation: Rule => Rule.required().custom(path => {
        if (!path.startsWith('/')) return 'URL 경로는 반드시 / 로 시작해야 합니다.';
        return true;
      }),
    }),
    defineField({
      name: 'navCategory',
      title: 'Navigation Category (메뉴 분류)',
      type: 'string',
      options: {
        list: [
          { title: 'About', value: 'about' },
          { title: 'Works (Selected)', value: 'works-selected' },
          { title: 'Works (Archive)', value: 'works-archive' },
          { title: 'Teaching', value: 'teaching' },
          { title: 'Press', value: 'press' },
          { title: 'Contact', value: 'contact' },
          { title: 'None (Hidden)', value: 'none' }
        ]
      }
    }),
    defineField({
      name: 'navLabel',
      title: 'Navigation Menu Label (메뉴 표시 이름)',
      type: 'string',
    }),
    defineField({
      name: 'navOrder',
      title: 'Display Order (노출 순서)',
      type: 'number',
      initialValue: 0
    }),
    defineField({
      name: 'sections',
      title: 'Content Sections (콘텐츠 섹션)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'heading',
          title: 'Heading (제목)',
          fields: [
            { name: 'content', title: 'Content', type: 'text', rows: 2 },
            { name: 'level', title: 'Heading Level', type: 'number', options: { list: [1, 2, 3] }, initialValue: 1 }
          ]
        },
        {
          type: 'object',
          name: 'textSection',
          title: 'Text Paragraph (본문 문단)',
          fields: [
            { name: 'content', title: 'Content', type: 'text', rows: 5 }
          ]
        },
        {
          type: 'object',
          name: 'quote',
          title: 'Quote (인용구)',
          fields: [
            { name: 'content', title: 'Quote Text', type: 'text', rows: 3 },
            { name: 'attribution', title: 'Attribution (출처)', type: 'string' }
          ]
        },
        {
          type: 'object',
          name: 'credits',
          title: 'Credits (제작 크레딧)',
          fields: [
            { name: 'content', title: 'Credits List', type: 'text', rows: 6 }
          ]
        },
        {
          type: 'object',
          name: 'imageSection',
          title: 'Image (이미지)',
          fields: [
            { name: 'asset', title: 'Image Upload', type: 'image', options: { hotspot: true } },
            { name: 'alt', title: 'Alt Text', type: 'string' }
          ]
        },
        {
          type: 'object',
          name: 'video',
          title: 'YouTube Video',
          fields: [
            { name: 'src', title: 'YouTube Embed URL', type: 'url', description: '예: https://www.youtube.com/embed/VIDEO_ID' }
          ]
        },
        {
          type: 'object',
          name: 'link',
          title: 'Link (외부링크)',
          fields: [
            { name: 'content', title: 'Link Text', type: 'string' },
            { name: 'href', title: 'Link URL', type: 'url' },
            { name: 'target', title: 'Target', type: 'string', options: { list: ['_blank', '_self'] }, initialValue: '_blank' }
          ]
        },
        {
          type: 'object',
          name: 'accordion',
          title: 'Accordion (접기/펼치기)',
          fields: [
            { name: 'label', title: 'Button Label (예: 한국어 보기 +)', type: 'string' },
            {
              name: 'children',
              title: 'Inner Sections',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'textSection',
                  title: 'Text Paragraph',
                  fields: [{ name: 'content', type: 'text' }]
                },
                {
                  type: 'object',
                  name: 'quote',
                  title: 'Quote',
                  fields: [
                    { name: 'content', type: 'text' },
                    { name: 'attribution', type: 'string' }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'object',
          name: 'htmlSection',
          title: 'HTML Block (기존 콘텐츠 원본)',
          fields: [
            { name: 'content', title: 'HTML Code', type: 'text', rows: 10 }
          ]
        }
      ]
    })
  ]
});
