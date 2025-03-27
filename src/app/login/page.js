import ScientificLoginForm from "@/components/auth/scientific-login-form";
import { Metadata } from "next";

export const metadata = {
  title: "Login | LabTasker",
  description: "Login to LabTasker - Lab Task Management for Preclinical Testing",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <ScientificLoginForm />
    </div>
  );
}
