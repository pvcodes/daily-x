import { Stack } from "expo-router";
import { ProtectedRoute } from "@/components/ProtectedWrapper";

export default function RootLayout() {
  return <ProtectedRoute>
    <Stack />
  </ProtectedRoute>;
}
