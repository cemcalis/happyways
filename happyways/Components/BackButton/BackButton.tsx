

import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "../Icons/Icons";
import { useTheme } from "../../contexts/ThemeContext";

type Props = {
  onPress: () => void;
};

const BackButton = ({ onPress }: Props) => {
  const { isDark } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ position: "absolute", top: 20, left: 20, padding: 10 }}
    >
      <Icon name="back" color={isDark ? "#fff" : "#000"} size={24} />
    </TouchableOpacity>
  );
};

export default BackButton;
