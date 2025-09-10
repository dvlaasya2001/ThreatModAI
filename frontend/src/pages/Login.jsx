import React from "react";
import { AuthProvider, Descope } from "@descope/react-sdk";
import { useNavigate } from "react-router-dom";
import { getSessionToken } from "@descope/react-sdk";
export default function Login() {
  const navigate = useNavigate();
  const project_Id = import.meta.env.VITE_PROJECT_ID;
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      <div className="z-10 w-full max-w-xl p-8 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tighter">
            ThreatModAI
          </h1>
          <p className="text-blue-200/70 text-sm">
            Secure your code with advanced AI-powered threat modeling
          </p>
        </div>

        <AuthProvider projectId={project_Id}>
          <Descope
            flowId="sign-up-or-in"
            theme="light"
            onSuccess={(e) => {
              const sessionToken = getSessionToken();

              fetch("http://localhost:5000/api/auth/validate", {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  Authorization: "Bearer " + sessionToken,
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data.success) {
                    sessionStorage.setItem("auth_token", sessionToken);
                    sessionStorage.setItem(
                      "user_name",
                      e.detail.user.name || "User"
                    );
                    sessionStorage.setItem("user_email", e.detail.user.email);

                    setTimeout(() => navigate("/dashboard"), 100);
                  } else {
                    console.error("Backend validation failed:", data);
                    alert(
                      "Session validation failed. Please try logging in again."
                    );
                    sessionStorage.clear();
                  }
                })
                .catch((error) => {
                  console.error("Error validating token with backend:", error);
                  setTimeout(() => navigate("/dashboard"), 100);
                });
            }}
            onError={(err) => {
              console.error("Login Error:", err);
              alert("Something went wrong. Please try again.");
            }}
          />
        </AuthProvider>
      </div>
    </div>
  );
}
