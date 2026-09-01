import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import GenderSelector from '../components/GenderSelector';
import { useRequiredProfile } from '../context/ProfileContext';
import { notify } from '../core/dialog';
import { saveProfile } from '../core/profile';
import { syncTasksWithProfile } from '../core/routine';
import type { Gender } from '../types';
import { colors, spacing } from '../theme';

/** 기존 프로필에 성별이 없을 때 한 번만 받는 화면 */
export default function GenderSetupScreen() {
  const { profile, setProfile } = useRequiredProfile();
  const [gender, setGender] = useState<Gender | null>(null);
  const [saving, setSaving] = useState(false);

  const handleContinue = async () => {
    if (!gender || saving) {
      return;
    }
    setSaving(true);
    const next = { ...profile, gender };
    const saved = await saveProfile(next);
    if (!saved) {
      setSaving(false);
      notify('저장 실패', '성별을 저장하지 못했어요. 다시 시도해 주세요.');
      return;
    }
    await syncTasksWithProfile(next.concerns, next.ageGroup, gender);
    setProfile(next);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.appName}>H&F app</Text>
      <Text style={styles.headline}>
        루틴과 추천을 더 맞게{'\n'}성별을 알려 주세요
      </Text>
      <Text style={styles.body}>
        남성과 여성은 세안·탈모 관리가 달라요. 선택한 정보는 기기에만 저장되며,
        설정에서 언제든 바꿀 수 있어요.
      </Text>
      <GenderSelector value={gender} onChange={setGender} />
      <TouchableOpacity
        style={[styles.button, !gender && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={!gender || saving}
      >
        <Text style={styles.buttonText}>{saving ? '준비 중...' : '계속하기'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  appName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  headline: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 34,
    marginBottom: spacing.md,
  },
  body: {
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  button: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.border,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
