import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

import {
  AGE_GROUP_LABELS,
  CONCERN_LABELS,
  GENDER_LABELS,
  type AgeGroup,
  type AnalysisResult,
  type Gender,
  type PhotoEntry,
} from '../types';

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const MAX_BASE64_CHARS = 3_500_000;

export interface AnalysisContext {
  recentCompletionRate: number;
  gender?: Gender;
  ageGroup: AgeGroup;
}

/**
 * AI 사진 분석 서비스.
 * 사진은 평소 기기에만 두고, 분석을 누를 때만 Gemini로 전송한다.
 */
export interface AnalysisService {
  analyze(photo: PhotoEntry, context: AnalysisContext): Promise<AnalysisResult>;
}

function getApiKey(): string {
  const key = process.env.EXPO_PUBLIC_GEMINI_API_KEY?.trim();
  if (!key) {
    throw new Error(
      'Gemini API 키가 없습니다. 프로젝트 루트 .env에 EXPO_PUBLIC_GEMINI_API_KEY를 넣고 Expo를 다시 시작해 주세요.',
    );
  }
  return key;
}

function mimeFromUri(uri: string): string {
  const lower = uri.split('?')[0].toLowerCase();
  if (lower.endsWith('.png')) {
    return 'image/png';
  }
  if (lower.endsWith('.webp')) {
    return 'image/webp';
  }
  if (lower.endsWith('.heic') || lower.endsWith('.heif')) {
    return 'image/heic';
  }
  if (lower.endsWith('.gif')) {
    return 'image/gif';
  }
  return 'image/jpeg';
}

function extractBase64FromDataUrl(dataUrl: string): { mimeType: string; data: string } {
  const match = /^data:([^;]+);base64,([\s\S]+)$/i.exec(dataUrl);
  if (!match) {
    throw new Error('사진을 읽지 못했어요.');
  }
  return { mimeType: match[1] || 'image/jpeg', data: match[2].replace(/\s+/g, '') };
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('사진을 읽지 못했어요.'));
        return;
      }
      const comma = result.indexOf(',');
      resolve((comma >= 0 ? result.slice(comma + 1) : result).replace(/\s+/g, ''));
    };
    reader.onerror = () => reject(new Error('사진을 읽지 못했어요.'));
    reader.readAsDataURL(blob);
  });
}

async function readImageInline(uri: string): Promise<{ mimeType: string; data: string }> {
  if (uri.startsWith('data:')) {
    return extractBase64FromDataUrl(uri);
  }

  const useFetch =
    Platform.OS === 'web' ||
    uri.startsWith('blob:') ||
    uri.startsWith('http://') ||
    uri.startsWith('https://');

  if (useFetch) {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error('사진을 읽지 못했어요.');
    }
    const blob = await response.blob();
    return {
      mimeType: blob.type || mimeFromUri(uri),
      data: await blobToBase64(blob),
    };
  }

  const data = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return { mimeType: mimeFromUri(uri), data: data.replace(/\s+/g, '') };
}

function buildPrompt(photo: PhotoEntry, context: AnalysisContext): string {
  const genderLabel = context.gender ? GENDER_LABELS[context.gender] : '미설정';
  const completionPct = Math.round(context.recentCompletionRate * 100);
  const focus =
    photo.concern === 'acne'
      ? '얼굴·피부(여드름, 홍조, 유분, 각질)를 관찰하세요.'
      : '두피·모발(가르마, 밀도, 각질, 붉은기)을 관찰하세요.';

  return [
    '당신은 피부·두피 케어 코치입니다. 의료 진단·처방이 아니라 생활 습관 관점의 관찰만 합니다.',
    '',
    `관심 케어: ${CONCERN_LABELS[photo.concern]} (${photo.concern})`,
    `프로필: ${genderLabel}, ${AGE_GROUP_LABELS[context.ageGroup]}`,
    `최근 7일 루틴 완료율: ${completionPct}%`,
    `촬영 시각: ${photo.takenAt}`,
    focus,
    '',
    '아래 JSON만 출력하세요.',
    '{',
    '  "score": 0부터 100 사이 정수 (높을수록 양호),',
    '  "summary": "한국어 2~3문장 요약. 병명을 단정하지 말 것.",',
    '  "tips": ["바로 실천 가능한 한국어 팁 3개"]',
    '}',
    '',
    '규칙:',
    '- 의학적 진단, 처방, 약 복용을 단정하지 마세요. 필요하면 전문의 상담만 권유하세요.',
    '- 사진이 얼굴이나 두피가 아니거나 너무 흐리면 score를 낮추고 summary에 이유를 적으세요.',
    '- 루틴 완료율은 참고만 하고, 사진에서 보이는 상태를 우선하세요.',
    '- tips는 3개, 한 문장씩, 과장 광고 문구를 쓰지 마세요.',
  ].join('\n');
}

function extractJson<T>(text: string): T {
  const cleaned = text
    .trim()
    .replace(/^```json/i, '')
    .replace(/^```/, '')
    .replace(/```$/, '')
    .trim();
  return JSON.parse(cleaned) as T;
}

function parseAnalysisResult(raw: unknown): AnalysisResult {
  if (!raw || typeof raw !== 'object') {
    throw new Error('invalid');
  }
  const obj = raw as Record<string, unknown>;
  const score = Number(obj.score);
  if (!Number.isFinite(score)) {
    throw new Error('invalid');
  }
  const summary = typeof obj.summary === 'string' ? obj.summary.trim() : '';
  if (!summary) {
    throw new Error('invalid');
  }
  const tips = Array.isArray(obj.tips)
    ? obj.tips.filter((tip): tip is string => typeof tip === 'string' && tip.trim().length > 0)
    : [];
  if (tips.length === 0) {
    throw new Error('invalid');
  }
  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    summary,
    tips: tips.slice(0, 5),
  };
}

type GeminiResponse = {
  error?: { message?: string; status?: string };
  promptFeedback?: { blockReason?: string };
  candidates?: Array<{
    finishReason?: string;
    content?: { parts?: Array<{ text?: string }> };
  }>;
};

function throwForHttpError(status: number, payload: GeminiResponse): never {
  const apiStatus = payload.error?.status ?? '';
  if (status === 429 || apiStatus === 'RESOURCE_EXHAUSTED') {
    throw new Error('분석 요청이 많아요. 잠시 후 다시 시도해 주세요.');
  }
  if (status === 400 || status === 401 || status === 403 || apiStatus === 'PERMISSION_DENIED') {
    throw new Error('Gemini API 키를 확인하거나 Expo를 다시 시작해 주세요.');
  }
  throw new Error('사진을 분석하지 못했어요. 잠시 후 다시 시도해 주세요.');
}

export class GeminiAnalysisService implements AnalysisService {
  async analyze(
    photo: PhotoEntry,
    context: AnalysisContext,
  ): Promise<AnalysisResult> {
    const apiKey = getApiKey();
    const image = await readImageInline(photo.uri);
    if (image.data.length > MAX_BASE64_CHARS) {
      throw new Error('사진이 너무 큽니다. 다시 촬영하거나 작은 사진으로 시도해 주세요.');
    }

    let response: Response;
    try {
      response = await fetch(GEMINI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: buildPrompt(photo, context) },
                {
                  inline_data: {
                    mime_type: image.mimeType || 'image/jpeg',
                    data: image.data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1024,
            responseMimeType: 'application/json',
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      });
    } catch {
      throw new Error('네트워크를 확인한 뒤 다시 시도해 주세요.');
    }

    const rawBody = await response.text();
    let payload: GeminiResponse = {};
    try {
      payload = JSON.parse(rawBody) as GeminiResponse;
    } catch {
      if (!response.ok) {
        throwForHttpError(response.status, {});
      }
      throw new Error('분석 결과를 읽지 못했어요. 다시 시도해 주세요.');
    }

    if (!response.ok) {
      throwForHttpError(response.status, payload);
    }

    const candidate = payload.candidates?.[0];
    const finishReason = candidate?.finishReason ?? '';
    const blockReason = payload.promptFeedback?.blockReason;
    if (blockReason || finishReason === 'SAFETY' || finishReason === 'BLOCKLIST') {
      throw new Error('사진이 안전 필터에 걸렸어요. 다른 사진으로 시도해 주세요.');
    }

    const text =
      candidate?.content?.parts
        ?.map((part) => part.text ?? '')
        .join('')
        .trim() ?? '';
    if (!text) {
      throw new Error('분석 결과가 비어 있어요. 다시 시도해 주세요.');
    }

    try {
      return parseAnalysisResult(extractJson(text));
    } catch {
      throw new Error('분석 결과를 읽지 못했어요. 다시 시도해 주세요.');
    }
  }
}

export const analysisService: AnalysisService = new GeminiAnalysisService();
