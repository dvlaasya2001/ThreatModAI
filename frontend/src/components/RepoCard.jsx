const RepoCard = ({ repo, isSelected, onSelect }) => {
  return (
    <div
      className={`border rounded-xl p-4 cursor-pointer transition-all ${
        isSelected
          ? "border-blue-500/50 bg-blue-500/10 shadow-lg"
          : "border-slate-700 bg-slate-800/50 hover:border-blue-500/30 hover:shadow-md hover:bg-slate-700/50"
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start">
        <h3
          className={`font-medium text-lg ${
            isSelected ? "text-blue-400" : "text-slate-200"
          }`}
        >
          {repo.name}
        </h3>
        <div className="flex items-center text-sm bg-slate-900/50 px-2.5 py-1 rounded-full border border-slate-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1 text-yellow-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-medium text-slate-300">
            {repo.stargazers_count}
          </span>
        </div>
      </div>

      <p className="text-sm text-slate-400 mt-2 line-clamp-2">
        {repo.description || "No description available"}
      </p>

      <div className="mt-4 flex justify-between items-center text-xs">
        <span className="bg-blue-900/30 text-blue-300 font-medium px-2.5 py-1 rounded-full border border-blue-800/30">
          {repo.language || "Unknown"}
        </span>
        <span className="text-slate-500">
          Updated {new Date(repo.updated_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default RepoCard;
