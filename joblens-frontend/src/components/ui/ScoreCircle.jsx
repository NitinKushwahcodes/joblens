export default function ScoreCircle({ score, size = 'md' }) {
  const r = size === 'lg' ? 54 : 36;
  const cx = r + 10;
  const circumference = 2 * Math.PI * r;
  const fill = ((score || 0) / 100) * circumference;

  const color =
    score >= 60 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';

  const dim = (r + 10) * 2;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={dim} height={dim}>
        <circle
          cx={cx} cy={cx} r={r}
          fill="none" stroke="currentColor"
          strokeWidth="8"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx={cx} cy={cx} r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - fill}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cx})`}
        />
        <text
          x={cx} y={cx}
          textAnchor="middle" dominantBaseline="central"
          fill={color}
          fontSize={size === 'lg' ? 22 : 14}
          fontFamily="JetBrains Mono, monospace"
          fontWeight="600"
        >
          {score ?? '—'}
        </text>
      </svg>
    </div>
  );
}
