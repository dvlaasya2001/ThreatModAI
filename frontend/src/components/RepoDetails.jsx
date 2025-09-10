const RepoDetails = ({ repo }) => {
  return (
    <div>
      <div className="flex justify-between items-start mb-6 border-b border-slate-700 pb-4">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          {repo.name}
        </h3>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-3 py-2 bg-slate-700/50 hover:bg-blue-700/30 rounded-lg transition-colors text-slate-200 hover:text-blue-300"
        >
          <span className="mr-2 font-medium">View on GitHub</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
        </a>
      </div>

      <p className="text-slate-300 mb-6 bg-slate-700/30 p-5 rounded-xl border-l-4 border-blue-500/50">
        {repo.description || "No description available"}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-800/70 rounded-xl border border-slate-700/50 p-5 shadow-lg">
        <div>
          <h4 className="text-sm font-medium text-blue-300 mb-2">Owner</h4>
          <div className="flex items-center">
            <img
              src={repo.owner.avatar_url}
              alt={repo.owner.login}
              className="w-8 h-8 rounded-full mr-2 border-2 border-blue-500/50 shadow-md"
            />
            <span className="font-medium text-slate-200">
              {repo.owner.login}
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-blue-300 mb-2">Language</h4>
          <span className="text-slate-200">
            {repo.language || "Not specified"}
          </span>
        </div>

        <div>
          <h4 className="text-sm font-medium text-blue-300 mb-2">Created</h4>
          <span className="text-slate-200">
            {new Date(repo.created_at).toLocaleDateString()}
          </span>
        </div>

        <div>
          <h4 className="text-sm font-medium text-blue-300 mb-2">
            Last Updated
          </h4>
          <span className="text-slate-200">
            {new Date(repo.updated_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex gap-4 mb-6 justify-center">
        <div className="flex items-center bg-yellow-900/30 px-4 py-2 rounded-lg border border-yellow-800/30 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-400 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-medium text-yellow-300">
            {repo.stargazers_count} stars
          </span>
        </div>

        <div className="flex items-center bg-blue-900/30 px-4 py-2 rounded-lg border border-blue-800/30 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-400 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 00-.707.293l-4 4a1 1 0 101.414 1.414L10 5.414l3.293 3.293a1 1 0 001.414-1.414l-4-4A1 1 0 0010 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium text-blue-300">
            {repo.forks_count} forks
          </span>
        </div>

        <div className="flex items-center bg-red-900/30 px-4 py-2 rounded-lg border border-red-800/30 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-400 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium text-red-300">
            {repo.open_issues_count} issues
          </span>
        </div>
      </div>

      {repo.topics && repo.topics.length > 0 && (
        <div className="bg-slate-800/70 rounded-xl border border-slate-700/50 p-5 shadow-lg">
          <h4 className="text-sm font-medium text-blue-300 mb-3 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            Topics
          </h4>
          <div className="flex flex-wrap gap-2">
            {repo.topics.map((topic) => (
              <span
                key={topic}
                className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-xs font-medium border border-blue-800/30"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RepoDetails;
