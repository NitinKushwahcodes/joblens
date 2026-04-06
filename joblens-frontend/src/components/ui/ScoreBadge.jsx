export default function ScoreBadge({ score }) {
  const color =
    score >= 60 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
    : score >= 40 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400'
    : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';

  return (
    <span className={`font-mono text-sm font-semibold px-2 py-0.5 rounded-md ${color}`}>
      {score}%
    </span>
  );
}
