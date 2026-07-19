/* ============================================
   Sanity Schema Types Guide
   --------------------------------------------
   Sanity Studio 초기화 완료 후 (예: sanity-studio/ 폴더),
   아래 스크립트들을 각각의 스키마 파일로 복사하세요.
   ============================================ */

// --------------------------------------------
// 1. schemaTypes/page.js (일반 페이지 스키마)
// --------------------------------------------
export const pageSchema = {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'path',
      title: 'URL Path (예: /about-bio)',
      type: 'string',
      validation: Rule => Rule.required().custom(path => {
        if (!path.startsWith('/')) return 'URL 경로는 반드시 / 로 시작해야 합니다.';
        return true;
      })
    },
    {
      name: 'navCategory',
      title: 'Navigation Category',
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
    },
    {
      name: 'navLabel',
      title: 'Navigation Menu Label',
      type: 'string'
    },
    {
      name: 'navOrder',
      title: 'Display Order',
      type: 'number',
      initialValue: 0
    },
    {
      name: 'sections',
      title: 'Content Sections (콘텐츠 블록)',
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
          name: 'text',
          title: 'Text Paragraph (본문)',
          fields: [
            { name: 'content', title: 'Content', type: 'text', rows: 5 }
          ]
        },
        {
          type: 'object',
          name: 'quote',
          title: 'Quote (인용문)',
          fields: [
            { name: 'content', title: 'Quote Text', type: 'text', rows: 3 },
            { name: 'attribution', title: 'Attribution (출처)', type: 'string' }
          ]
        },
        {
          type: 'object',
          name: 'credits',
          title: 'Credits (제작 정보)',
          fields: [
            { name: 'content', title: 'Credits List', type: 'text', rows: 6 }
          ]
        },
        {
          type: 'object',
          name: 'image',
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
                  name: 'text',
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
        }
      ]
    }
  ]
};
