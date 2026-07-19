import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'HeJinJang',

  projectId: 'b6ue7y4v',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('콘텐츠 관리')
          .items([
            S.listItem()
              .title('소개 (About)')
              .child(
                S.documentList()
                  .title('About')
                  .schemaType('page')
                  .filter('_type == "page" && navCategory == "about"')
              ),
            S.listItem()
              .title('주요 작품 (Selected Works)')
              .child(
                S.documentList()
                  .title('Selected Works')
                  .schemaType('page')
                  .filter('_type == "page" && navCategory == "works-selected"')
              ),
            S.listItem()
              .title('아카이브 작품 (Archive Works)')
              .child(
                S.documentList()
                  .title('Archive Works')
                  .schemaType('page')
                  .filter('_type == "page" && navCategory == "works-archive"')
              ),
            S.listItem()
              .title('교육 (Teaching)')
              .child(
                S.documentList()
                  .title('Teaching')
                  .schemaType('page')
                  .filter('_type == "page" && navCategory == "teaching"')
              ),
            S.listItem()
              .title('언론 및 리뷰 (Press & Reviews)')
              .child(
                S.documentList()
                  .title('Press & Reviews')
                  .schemaType('page')
                  .filter('_type == "page" && (navCategory == "press" || navCategory == "none" || path == "/press-review")')
              ),
            S.listItem()
              .title('연락처 (Contact)')
              .child(
                S.documentList()
                  .title('Contact')
                  .schemaType('page')
                  .filter('_type == "page" && navCategory == "contact"')
              ),
            S.listItem()
              .title('기타 페이지 (Other Pages)')
              .child(
                S.documentList()
                  .title('Other Pages')
                  .schemaType('page')
                  .filter('_type == "page" && !(navCategory in ["about", "works-selected", "works-archive", "teaching", "press", "contact", "none"])')
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
