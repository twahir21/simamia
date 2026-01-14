import { Redirect } from "expo-router";

// Default redirection to home screen 
export default function Index() {
  return <Redirect href="/home" />;
}
