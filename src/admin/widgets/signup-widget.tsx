import { defineWidgetConfig } from "@medusajs/admin-sdk";
import SignupForm from "../components/signup-form";
import DrawerComponent from "../components/drawer";

const SignupWidget = () => {
  const disableSignupWidget =
    //@ts-ignore
    typeof __VITE_DISABLE_SIGNUP_WIDGET__ !== "undefined"
      ? //@ts-ignore
        __VITE_DISABLE_SIGNUP_WIDGET__
      : false;

  return disableSignupWidget ? null : (
    <div className="flex flex-col">
      <p className="text-center text-sm mb-2">or</p>
      <DrawerComponent title="Sign Up" content={<SignupForm />} />
    </div>
  );
};

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "login.after",
});

export default SignupWidget;
