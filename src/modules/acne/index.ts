import type { ConcernModule } from '../types';

export const acneModule: ConcernModule = {
  type: 'acne',
  label: '여드름 케어',
  emoji: '🧴',
  tagline: '피부 상태를 사진으로 추적하고 매일 루틴을 지켜요',
  photoTip:
    '매일 같은 시간, 같은 조명에서 정면·좌측·우측을 촬영하면 변화를 정확히 비교할 수 있어요.',
  routineTemplates: [
    { key: 'morning-cleanse', title: '아침 약산성 세안', time: 'morning' },
    { key: 'moisturizer', title: '수분 크림 바르기', time: 'morning' },
    { key: 'sunscreen', title: '자외선 차단제 바르기', time: 'morning' },
    {
      key: 'evening-cleanse',
      title: '저녁 약산성 세안',
      time: 'evening',
      genders: ['male'],
    },
    {
      key: 'evening-cleanse',
      title: '저녁 이중 세안 (클렌징 + 폼)',
      time: 'evening',
      genders: ['female'],
    },
    {
      key: 'spot-treatment',
      title: '트러블 부위 스팟 케어',
      time: 'evening',
      ageGroups: ['20s', '30s'],
    },
    {
      key: 'bp-spot',
      title: '벤조일퍼옥사이드 스팟 케어',
      time: 'evening',
      ageGroups: ['20s', '30s'],
      genders: ['male'],
    },
    {
      key: 'shave-soothe',
      title: '면도 후 진정 바르기',
      time: 'morning',
      ageGroups: ['20s', '30s'],
      genders: ['male'],
    },
    {
      key: 'no-touch',
      title: '손으로 만지지 않기 체크',
      time: 'evening',
      ageGroups: ['20s', '30s'],
    },
    {
      key: 'pillow-cover',
      title: '베개 커버 교체 (주 2회)',
      time: 'evening',
      ageGroups: ['20s', '30s'],
      days: [0, 3],
    },
    {
      key: 'niacinamide',
      title: '나이아신아마이드 세럼 바르기',
      time: 'evening',
      ageGroups: ['20s', '30s', '40s', '50s+'],
    },
    {
      key: 'barrier-cream',
      title: '세라마이드 장벽 크림 바르기',
      time: 'evening',
      ageGroups: ['40s', '50s+'],
    },
    {
      key: 'gentle-exfoliate',
      title: '저자극 각질 케어 (주 1회)',
      time: 'evening',
      ageGroups: ['30s', '40s', '50s+'],
      days: [6],
    },
  ],
};
