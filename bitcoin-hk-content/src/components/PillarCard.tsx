import type { ContentPillar } from '../types';

interface Props {
  pillar: ContentPillar;
  postCount: number;
  onClick: () => void;
}

export default function PillarCard({ pillar, postCount, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="text-left w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{pillar.icon}</span>
        <span
          className="text-xs font-semibold px-2 py-1 rounded-full text-white"
          style={{ backgroundColor: pillar.color }}
        >
          {postCount} posts
        </span>
      </div>
      <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-orange-600 transition-colors">
        {pillar.name}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
        {pillar.description}
      </p>
      <div className="flex flex-wrap gap-1">
        {pillar.hashtags.slice(0, 3).map(tag => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: `${pillar.color}18`, color: pillar.color }}
          >
            {tag}
          </span>
        ))}
        {pillar.hashtags.length > 3 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
            +{pillar.hashtags.length - 3}
          </span>
        )}
      </div>
    </button>
  );
}
