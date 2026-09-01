import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';

/** 헤더용 톱니 글리프. 아이콘 패키지 없이 View로 그린다. */
function GearGlyph() {
  return (
    <View style={styles.gear} accessibilityElementsHidden>
      <View style={[styles.spoke, styles.spoke0]} />
      <View style={[styles.spoke, styles.spoke45]} />
      <View style={[styles.spoke, styles.spoke90]} />
      <View style={[styles.spoke, styles.spoke135]} />
      <View style={styles.gearDisk}>
        <View style={styles.gearHole} />
      </View>
    </View>
  );
}

/** 헤더 우측 사용 설정 칩. 탭하면 설정 화면으로 이동한다. */
export default function SettingsHeaderButton() {
  const navigation = useNavigation();

  const openSettings = () => {
    const parent =
      navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
    if (parent) {
      parent.navigate('Settings');
      return;
    }
    (
      navigation as unknown as NativeStackNavigationProp<RootStackParamList>
    ).navigate('Settings');
  };

  return (
    <Pressable
      onPress={openSettings}
      hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
      accessibilityRole="button"
      accessibilityLabel="사용 설정"
      style={({ pressed }) => [styles.hit, pressed && styles.pressed]}
    >
      <View style={styles.chip}>
        <View style={styles.iconWell}>
          <GearGlyph />
        </View>
        <Text style={styles.label} numberOfLines={1}>
          사용 설정
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    marginRight: 2,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.97 }],
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 36,
    paddingVertical: 4,
    paddingLeft: 5,
    paddingRight: 10,
    borderRadius: 18,
    backgroundColor: colors.primary,
  },
  iconWell: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  gear: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spoke: {
    position: 'absolute',
    width: 14,
    height: 4,
    borderRadius: 1.2,
    backgroundColor: '#FFFFFF',
  },
  spoke0: {},
  spoke45: {
    transform: [{ rotate: '45deg' }],
  },
  spoke90: {
    transform: [{ rotate: '90deg' }],
  },
  spoke135: {
    transform: [{ rotate: '135deg' }],
  },
  gearDisk: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gearHole: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
});
