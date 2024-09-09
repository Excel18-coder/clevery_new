import { forwardRef } from 'react';
import { Text as DefaultText, View as DefaultView } from 'react-native';
import Colors from '../constants';
import { useThemeStore } from '@/lib';
import { useColorScheme } from 'nativewind';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
  className?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { mode: theme } = useThemeStore();
  const defaultMode = useColorScheme();

  const lightmode = () => {
    if (theme === 'default') return defaultMode.colorScheme;
    return theme;
  };

  const colorFromProps = props[lightmode()];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[lightmode()][colorName];
  }
}

// Wrap Text component with forwardRef
export const Text = forwardRef<DefaultText, TextProps>((props, ref) => {
  const { style, lightColor, darkColor, className, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <DefaultText
      ref={ref}
      className={className}
      style={[{ color }, style]}
      {...otherProps}
    />
  );
});

// Wrap View component with forwardRef
export const View = forwardRef<DefaultView, ViewProps>((props, ref) => {
  const { style, lightColor, darkColor, className, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return (
    <DefaultView
      ref={ref}
      className={className}
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
});