import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "../Icons/Icons";

type Props = {
  onPress: () => void;
};

const BackButton = ({ onPress }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ position: "absolute", top: 20, left: 20, padding: 10 }}
    >
      <Icon name="back" size={24} />
    </TouchableOpacity>
  );
};

export default BackButton;
