import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import plantumlEncoder from "plantuml-encoder";

const Results = () => {
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      const access_token = location.state?.access_token;
      const repo_url = location.state?.repo_url;

      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/github/analyze`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify({
              repo_url: repo_url,
            }),
          }
        );

        const data = await response.json();
        if (data.status === "success") {
          setData(data);
          setLoading(false);
        }
      } catch (error) {
        setError("Failed to fetch analysis results. Please try again." + error);
        setLoading(false);
        return;
      }
    };
    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center bg-slate-800/70 backdrop-blur-sm p-10 rounded-2xl border border-slate-700/50 shadow-xl">
            <div className="inline-block animate-spin rounded-full h-24 w-24 border-4 border-purple-400 border-t-blue-400 mb-6"></div>
            <p className="mt-2 text-lg font-medium text-blue-300">
              Analyzing repository... Please wait
            </p>
            <p className="text-sm text-slate-400 mt-2">
              This may take a few moments
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col">
        <Header />
        <div className="container mx-auto px-6 py-8 flex-grow">
          <div className="bg-red-900/30 backdrop-blur-sm border border-red-700/50 text-red-300 px-6 py-5 rounded-xl mb-4 shadow-lg">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-3 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200 flex flex-col">
      <Header />
      <main className="container mx-auto px-6 py-8 flex-grow">
        {data && data.result && data.result[0] &&(
          <div className="bg-green-900/30 backdrop-blur-sm border border-green-700/50 text-green-300 px-6 py-4 rounded-xl mb-6 shadow-lg">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-3 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="font-medium">
                Report has been successfully sent to your email. You can check it out.
              </span>
            </div>
          </div>
        )}
        {data && data.result && data.result[0] && (
          <>
            
            <div className="flex flex-col md:flex-row justify-between items-start mb-8 bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 shadow-xl">
              <div>
                <h1 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {data.result[0].repo_url.split("/").pop()}
                </h1>
                <p className="text-slate-400">{data.result[0].repo_url}</p>
                <div className="mt-4 flex items-center">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-900/30 text-green-400 border border-green-700/50">
                    <svg
                      className="mr-1.5 h-2 w-2 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Analysis Complete
                  </span>
                  <span className="ml-3 text-sm text-slate-400">
                    ID: {data.analysis_id}
                  </span>
                </div>
              </div>
              <div className="mt-6 md:mt-0">
                <a
                  href={data.result[0].report_path ? `/report.pdf` : "#"}
                  className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-900/20 transition-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="-ml-1 mr-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download Full Report
                </a>
              </div>
            </div>

            <div className="mb-8">
              <div className="border-b border-slate-700/50">
                <nav className="-mb-px flex space-x-8">
                  <button className="border-blue-500 text-blue-400 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                     Analysis
                  </button>
                </nav>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm shadow-xl overflow-hidden rounded-2xl mb-8 border border-slate-700/50">
              <div className="px-6 py-5 sm:px-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                <h3 className="text-lg leading-6 font-medium text-blue-300 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  System Description
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-slate-400">
                  A comprehensive analysis of the System design and
                  purpose
                </p>
              </div>
              <div className="border-t border-slate-700/50 px-6 py-5 sm:p-6">
                <div className="prose prose-invert max-w-full">
                  {data.result[0].description
                    .split("\n\n")
                    .map((paragraph, idx) => (
                      <p key={idx} className="mb-4 text-slate-300">
                        {paragraph}
                      </p>
                    ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm shadow-xl overflow-hidden rounded-2xl mb-8 border border-slate-700/50">
              <div className="px-6 py-5 sm:px-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                <h3 className="text-lg leading-6 font-medium text-blue-300 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 12l3-3m0 0l3 3m-3-3v12m6-6l3 3m0 0l3-3m-3 3V6"
                    />
                  </svg>
                  System Architecture Diagram
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-slate-400">
                  Visual representation of system components and their
                  relationships
                </p>
              </div>
              <div className="border-t border-slate-700/50 px-6 py-5 sm:p-6 overflow-auto">
                {data.result[0].diagram && (
                  <div className="flex justify-center">
                    <img
                      src={`https://www.plantuml.com/plantuml/svg/${plantumlEncoder.encode(
                        data.result[0].diagram
                      )}`}
                      alt="System Architecture Diagram"
                      className="max-w-full h-auto border border-slate-700 rounded-lg shadow-xl"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm shadow-xl overflow-hidden rounded-2xl mb-8 border border-slate-700/50">
              <div className="px-6 py-5 sm:px-6 bg-gradient-to-r from-red-900/20 to-purple-900/20">
                <h3 className="text-lg leading-6 font-medium text-red-300 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Security Analysis
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-slate-400">
                  Identified security threats and recommended countermeasures
                </p>
              </div>
              <div className="border-t border-slate-700/50">
                <div className="overflow-x-auto px-4 py-4">
                  <table className="min-w-full divide-y divide-slate-700">
                    <thead className="bg-slate-800/80">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider"
                        >
                          Asset
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider"
                        >
                          Threat
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider"
                        >
                          Severity
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider"
                        >
                          Countermeasure
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {data.result[0].threats &&
                        data.result[0].threats.map((threat, idx) => (
                          <tr
                            key={idx}
                            className={
                              idx % 2 === 0
                                ? "bg-slate-800/30"
                                : "bg-slate-700/30"
                            }
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">
                              {threat.asset}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-300">
                              {threat.threat}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  threat.severity === "High"
                                    ? "bg-red-800/50 text-red-200"
                                    : threat.severity === "Medium"
                                    ? "bg-yellow-800/50 text-yellow-200"
                                    : "bg-green-800/50 text-green-200"
                                }`}
                              >
                                {threat.severity}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-300">
                              {threat.countermeasure}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-800/50 backdrop-blur-sm shadow-xl overflow-hidden rounded-2xl border border-slate-700/50 transform transition-all hover:scale-105">
                <div className="px-6 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-slate-400 truncate">
                    High Severity Threats
                  </dt>
                  <dd className="mt-2 text-3xl font-semibold text-red-400 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 mr-2 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    {
                      data.result[0].threats.filter(
                        (t) => t.severity === "High"
                      ).length
                    }
                  </dd>
                </div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm shadow-xl overflow-hidden rounded-2xl border border-slate-700/50 transform transition-all hover:scale-105">
                <div className="px-6 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-slate-400 truncate">
                    Medium Severity Threats
                  </dt>
                  <dd className="mt-2 text-3xl font-semibold text-yellow-400 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 mr-2 text-yellow-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {
                      data.result[0].threats.filter(
                        (t) => t.severity === "Medium"
                      ).length
                    }
                  </dd>
                </div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm shadow-xl overflow-hidden rounded-2xl border border-slate-700/50 transform transition-all hover:scale-105">
                <div className="px-6 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-slate-400 truncate">
                    Low Severity Threats
                  </dt>
                  <dd className="mt-2 text-3xl font-semibold text-green-400 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 mr-2 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {
                      data.result[0].threats.filter((t) => t.severity === "Low")
                        .length
                    }
                  </dd>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Results;
