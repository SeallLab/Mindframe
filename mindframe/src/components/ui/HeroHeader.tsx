// src/components/ui/HeroHeader.tsx
//
// Screen header with a scene drawn behind the title. In-flow (not
// absolutely positioned behind other content), and its sky and foreground
// hills are both the page background color — so it needs no particular
// background from the screen it sits on, and has no hard edges.

import React from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { SceneArt, SceneVariant } from "../art/SceneArt";
import { styles } from "../../styling/components/ui/HeroHeader.styles";

interface HeroHeaderProps {
  variant: SceneVariant;
  title: string;
  subtitle?: string;
  /** Rendered top-right, e.g. a close button. */
  right?: React.ReactNode;
  height?: number;
}

export function HeroHeader({ variant, title, subtitle, right, height = 148 }: HeroHeaderProps) {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.wrap, { height }]}>
      <View style={styles.art} pointerEvents="none">
        <SceneArt variant={variant} width={width} height={height} />
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.title} numberOfLines={1} accessibilityRole="header">
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}
