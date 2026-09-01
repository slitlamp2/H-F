/** 연령대 구분. 온보딩에서 선택하며 추천·가이드 개인화에 사용된다. */
export type AgeGroup = '20s' | '30s' | '40s' | '50s+';

/** 성별. 루틴·추천·가이드를 남/여로 나눌 때 사용한다. */
export type Gender = 'male' | 'female';

/** 목록이 비어 있거나 없으면 전원에게 해당한다. 값이 없으면 공통 항목만 통과한다. */
export function includesOrAll<T>(list: T[] | undefined, value: T | undefined): boolean {
  if (!list || list.length === 0) {
    return true;
  }
  if (value === undefined) {
    return false;
  }
  return list.includes(value);
}

/** 관심사(케어 도메인). 추후 'wrinkle' | 'scalp-aging' 등으로 확장한다. */
export type ConcernType = 'acne' | 'hair';

export type RoutineTime = 'morning' | 'evening';

/** 요일. 0=일요일 ~ 6=토요일 (JS Date.getDay()와 동일) */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const ALL_WEEKDAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  0: '일',
  1: '월',
  2: '화',
  3: '수',
  4: '목',
  5: '금',
  6: '토',
};

export interface UserProfile {
  gender?: Gender;
  ageGroup: AgeGroup;
  concerns: ConcernType[];
  createdAt: string;
}

export function isProfileComplete(
  profile: UserProfile | null,
): profile is UserProfile & { gender: Gender } {
  return (
    !!profile &&
    (profile.gender === 'male' || profile.gender === 'female') &&
    profile.concerns.length > 0
  );
}

/** 사진 기록 한 건. uri는 앱 문서 폴더로 복사된 로컬 경로다. */
export interface PhotoEntry {
  id: string;
  concern: ConcernType;
  uri: string;
  takenAt: string;
  note?: string;
  /** AI 분석 점수(0~100, 높을수록 양호). 분석 전이면 undefined. */
  aiScore?: number;
}

export interface RoutineTask {
  id: string;
  concern: ConcernType;
  title: string;
  time: RoutineTime;
  /** 이 루틴을 수행하는 요일. 매일이면 7개 전부. */
  days: Weekday[];
  /** 사용자가 직접 추가한 항목이면 true (기본 템플릿과 구분) */
  custom?: boolean;
}

/** 아침/저녁 루틴 알림 리마인더 설정 */
export interface ReminderSettings {
  morningEnabled: boolean;
  morningHour: number;
  morningMinute: number;
  eveningEnabled: boolean;
  eveningHour: number;
  eveningMinute: number;
}

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  morningEnabled: false,
  morningHour: 8,
  morningMinute: 0,
  eveningEnabled: false,
  eveningHour: 21,
  eveningMinute: 0,
};

/** 날짜(YYYY-MM-DD)별로 완료한 태스크 id 목록을 저장한다. */
export interface RoutineLog {
  date: string;
  completedTaskIds: string[];
}

/** 올리브영에서 구하기 쉬운 비슷한 제품 예시 */
export interface OliveYoungExample {
  name: string;
  /** 동일 성분이 아닐 때 안내 (예: 미녹시딜은 약국 전용) */
  note?: string;
}

export interface ProductCatalog {
  /** YYYY-MM-DD. 대표 브랜드·올리브영 예시를 마지막으로 검토한 날 */
  reviewedAt: string;
  intervalMonths: number;
  products: Product[];
}

export interface Product {
  id: string;
  concern: ConcernType;
  ageGroups: AgeGroup[];
  /** 생략하면 남녀 공통 */
  genders?: Gender[];
  name: string;
  /** 해당 카테고리에서 알아보기 쉬운 대표 브랜드 예시 1개 */
  brand: string;
  category: string;
  keyIngredients: string[];
  description: string;
  oliveYoung: OliveYoungExample;
}

export interface Guide {
  id: string;
  concern: ConcernType;
  ageGroups: AgeGroup[];
  /** 생략하면 남녀 공통 */
  genders?: Gender[];
  title: string;
  body: string;
}

/** AI 사진 분석 결과. Gemini 비전 호출이 채운다. 의료 진단이 아니다. */
export interface AnalysisResult {
  score: number;
  summary: string;
  tips: string[];
}

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  '20s': '20대',
  '30s': '30대',
  '40s': '40대',
  '50s+': '50대 이상',
};

export const GENDER_LABELS: Record<Gender, string> = {
  male: '남성',
  female: '여성',
};

export const CONCERN_LABELS: Record<ConcernType, string> = {
  acne: '여드름 케어',
  hair: '탈모 케어',
};
