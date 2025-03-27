import ForgotPasswordForm from "@/components/auth/forgot-password-form";

export const metadata = {
  title: "Forgot Password | LabTasker",
  description: "Reset your password for LabTasker",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}