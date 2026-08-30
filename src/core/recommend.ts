import productsData from '../data/products.json';
import guidesData from '../data/guides.json';
import type { Guide, Product, ProductCatalog, UserProfile } from '../types';

const catalog = productsData as ProductCatalog;
const products = catalog.products;
const guides = guidesData as Guide[];

export const PRODUCT_REVIEWED_AT = catalog.reviewedAt;
export const PRODUCT_REVIEW_INTERVAL_MONTHS = catalog.intervalMonths;

/** 추천 탭에 보여줄 'YYYY년 M월 기준' 문구 */
export function getProductReviewLabel(isoDate: string = PRODUCT_REVIEWED_AT): string {
  const [year, month] = isoDate.split('-');
  return `${Number(year)}년 ${Number(month)}월 기준`;
}

/** 프로필의 관심사·연령대에 해당하는 제품만 필터링한다. */
export function getRecommendedProducts(profile: UserProfile): Product[] {
  return products.filter(
    (product) =>
      profile.concerns.includes(product.concern) &&
      product.ageGroups.includes(profile.ageGroup),
  );
}

export function getGuides(profile: UserProfile): Guide[] {
  return guides.filter(
    (guide) =>
      profile.concerns.includes(guide.concern) &&
      guide.ageGroups.includes(profile.ageGroup),
  );
}
