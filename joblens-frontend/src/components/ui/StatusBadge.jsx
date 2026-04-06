export default function StatusBadge({ status }) {
  return status === 'applied' ? (
    <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 px-2 py-0.5 rounded-md font-medium">
      Applied
    </span>
  ) : (
    <span className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 px-2 py-0.5 rounded-md font-medium">
      Not Ready
    </span>
  );
}
