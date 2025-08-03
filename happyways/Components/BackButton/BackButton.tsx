import React from "react";
import { TouchableOpacity } from "react-native";
import BackButtons from "../../assets/BackButtons/backButtons.svg"; 

type Props = {
  onPress: () => void;
};

const BackButton = ({ onPress }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ position: "absolute", top: 20, left: 20, padding: 10 }}
    >
      <BackButtons width={24} height={24} />
    </TouchableOpacity>
  );
};

export default BackButton;
