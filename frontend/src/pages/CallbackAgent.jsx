import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CallbackAgent() {
  const [status, setStatus] = useState("Consent granted, processing...");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const stateobj = JSON.parse(state);
    let repo_url = stateobj.repo_url || "";

    if (!code) {
      setStatus("Error: No authorization code received ❌");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/callback/agent_a`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, state }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("Consent complete ✅ Redirecting...");
          setTimeout(() => {
            navigate("/results", {
              state: { repo_url: repo_url, access_token: data.access_token },
            });
          }, 1000);
        } else {
          setStatus("Error during consent " + data.message);
        }
      })
      .catch((err) => {
        setStatus("Network error" + err.message);
      });
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">{status}</h2>
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
