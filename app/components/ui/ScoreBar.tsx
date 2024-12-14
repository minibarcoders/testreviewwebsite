interface ScoreBarProps {
  score: number;
  label: string;
  description?: string;
}

const ScoreBar = ({ score, label, description }: ScoreBarProps) => {
  // Convert score to percentage (assuming score is 0-10)
  const percentage = (score / 10) * 100;
  
  // Determine color based on score
  const getColor = (score: number) => {
    if (score >= 8) return 'bg-emerald-500';
    if (score >= 6) return 'bg-blue-500';
    if (score >= 4) return 'bg-yellow-500';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <div>
          <span className="font-medium text-gray-900">{label}</span>
          {description && (
            <span className="ml-2 text-sm text-gray-500">{description}</span>
          )}
        </div>
        <span className="font-bold text-xl text-gray-900">{score}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getColor(score)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ScoreBar;
