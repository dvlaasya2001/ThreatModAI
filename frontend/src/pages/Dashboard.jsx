import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import RepoCard from "../components/RepoCard";
import RepoDetails from "../components/RepoDetails";

const Dashboard = () => {
  const [url, seturl] = useState("");
  const [directRepoUrl, setDirectRepoUrl] = useState("");
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError("");
    setRepos([]);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/github/search?query=${encodeURIComponent(url)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to search repositories");
      }

      setRepos(data.items || []);
    } catch (err) {
      setError(err.message || "Failed to search repositories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepoSelect = (repo) => setSelectedRepo(repo);

  const handleDirectAnalyze = async () => {
    if (!directRepoUrl) return;

    if (!directRepoUrl.startsWith("https://github.com/")) {
      setError(
        "Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)"
      );
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/start-analysis?repo_url=${encodeURIComponent(directRepoUrl)}`
      );
      console.log(response.url);

      if (
        response.status === 200 ||
        response.status === 302 ||
        response.status === 303
      ) {
        const redirectUrl = response.url;
        window.location.href = redirectUrl;
      }
    } catch (err) {
      setError(err.message || "Failed to analyze repository directly");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedRepo) return;

    setIsAnalyzing(true);
    try {
      const token = sessionStorage.getItem("auth_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/github/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            repo_url: selectedRepo.html_url,
            repo_name: selectedRepo.full_name,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to analyze repository");
      }

      navigate(`/results/${selectedRepo.full_name}`);
    } catch (err) {
      setError(err.message || "Failed to analyze repository");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200">
      <Header />

      <main className="container mx-auto px-6 py-10 flex-grow">
        {/* Title */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            ThreatModAI
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Advanced threat modeling for code repositories powered by AI
            analysis
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (directRepoUrl) handleDirectAnalyze();
          }}
          className="mb-8 flex flex-col md:flex-row items-center gap-4 bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-700/50 transform transition-all"
        >
          <div className="flex items-center w-full">
            <div className="text-blue-400 mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <input
              type="text"
              value={directRepoUrl}
              onChange={(e) => setDirectRepoUrl(e.target.value)}
              placeholder="Enter a GitHub repository URL (e.g. https://github.com/username/repo)"
              className="flex-grow px-5 py-3 rounded-xl border border-slate-700 bg-slate-900/70 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isAnalyzing || !directRepoUrl}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-600 w-full md:w-auto"
          >
            {isAnalyzing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Analyzing...
              </div>
            ) : (
              <div className="flex items-center justify-center">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Analyze Repository
              </div>
            )}
          </button>
        </form>

        <form
          onSubmit={handleSubmit}
          className="mb-10 flex flex-col md:flex-row items-center gap-4 bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-700/50"
        >
          <div className="flex items-center w-full">
            <div className="text-blue-400 mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => seturl(e.target.value)}
              placeholder="Search for GitHub repositories..."
              className="flex-grow px-5 py-3 rounded-xl border border-slate-700 bg-slate-900/70 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-600 w-full md:w-auto"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Searching...
              </div>
            ) : (
              <div className="flex items-center justify-center">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search
              </div>
            )}
          </button>
        </form>

        {error && (
          <div className="mb-8 p-5 rounded-xl bg-red-900/30 backdrop-blur-sm border border-red-700/50 text-red-300 flex items-center justify-center shadow-xl">
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
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-700/50">
            <h2 className="text-xl font-medium text-blue-300 mb-6 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              Code Repositories
            </h2>
            <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
              {repos.length === 0 && !isLoading ? (
                <div className="text-slate-500 text-center py-16 flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mb-4 text-slate-600/50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <p>
                    {url
                      ? "No repositories found"
                      : "Start by searching for repositories"}
                  </p>
                </div>
              ) : (
                repos.map((repo) => (
                  <RepoCard
                    key={repo.id}
                    repo={repo}
                    isSelected={selectedRepo?.id === repo.id}
                    onSelect={() => handleRepoSelect(repo)}
                  />
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-700/50">
            <h2 className="text-xl font-medium text-blue-300 mb-6 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Code Analysis Details
            </h2>
            {selectedRepo ? (
              <div>
                <RepoDetails repo={selectedRepo} />
                <div className="mt-8">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white font-medium shadow-lg shadow-green-900/20 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-600"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Analyzing...
                      </div>
                    ) : (
                      <div className="flex items-center">
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
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        Analyze Code
                      </div>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400">
                <div className="p-8 rounded-full bg-slate-700/30 border border-slate-600/30 mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-slate-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <p className="text-center text-lg mb-2">
                  No repository selected
                </p>
                <p className="text-slate-500 text-sm text-center max-w-md">
                  Search for and select a repository to begin analyzing its code
                  structure and security vulnerabilities
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
