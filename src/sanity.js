import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'dummy-id';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = '2023-05-03';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // `false` if you want to ensure fresh data
});

const builder = imageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}

// ============================================
// Sanity Data Fetching
// ============================================

/** 
 * 특정 페이지 스키마 로드 
 * Sanity에서는 GROQ 쿼리를 사용하여 데이터를 가져옵니다.
 */
export async function getPageData(path) {
  if (projectId === 'dummy-id') return null;
  try {
    const query = `*[_type == "page" && path == $path][0]{
      title,
      path,
      sections[]{
        _type,
        _key,
        content,
        level,
        attribution,
        label,
        href,
        target,
        "imageSrc": asset->url,
        alt,
        src,
        children[]{
          _type,
          _key,
          content,
          level,
          attribution
        }
      }
    }`;
    const data = await client.fetch(query, { path });
    return data;
  } catch (error) {
    console.error('Error fetching page from Sanity:', error);
    return null;
  }
}

/** 모든 페이지 목록 가져오기 */
export async function getAllPages() {
  if (projectId === 'dummy-id') return [];
  try {
    const query = `*[_type == "page"] | order(navOrder asc){
      title,
      path,
      navCategory,
      navLabel,
      navOrder
    }`;
    return await client.fetch(query);
  } catch (error) {
    console.error('Error fetching pages list:', error);
    return [];
  }
}
