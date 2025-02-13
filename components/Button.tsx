import { cn } from "@/utils";
import { Pressable, Text } from "react-native";

type Props = {
  label: string;
  disabled?: boolean
  className?: string;
  onPress?: () => void;
};

export default function Button({ label, className, onPress, disabled = false }: Props) {
  const baseClasses = 'rounded-md w-320 h-68 mx-20 items-center justify-center p-3 bg-blue-800';
  const classes = className ? cn(baseClasses, className) : baseClasses;
  return (
    <Pressable className={classes} onPress={onPress} disabled={disabled}>
      <Text className="color-white text-xl">{label}</Text>
    </Pressable>
  );
}