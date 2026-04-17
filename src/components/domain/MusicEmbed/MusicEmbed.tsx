import React, { useState, useEffect } from 'react';
import type { MusicLink } from '@/features/encounters/types/Encounter';
import './MusicEmbed.css';

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const list = parsed.searchParams.get('list');
    if (list && parsed.hostname.includes('youtube.com')) {
      return `https://www.youtube.com/embed/videoseries?list=${list}&autoplay=1`;
    }
    const v = parsed.searchParams.get('v');
    if (v) return `https://www.youtube.com/embed/${v}?autoplay=1`;
    if (parsed.hostname === 'youtu.be') {
      const id = parsed.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (parsed.hostname.includes('youtube.com') && parsed.pathname.startsWith('/embed/')) {
      const embedParsed = new URL(url);
      embedParsed.searchParams.set('autoplay', '1');
      return embedParsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

interface MusicEmbedProps {
  musicLinks?: MusicLink[];
}

export const MusicEmbed: React.FC<MusicEmbedProps> = ({ musicLinks = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Reset active index when links change
  useEffect(() => {
    setActiveIndex(0);
  }, [musicLinks.length]);

  const validLinks = musicLinks
    .map((l, i) => ({ ...l, embedUrl: getYouTubeEmbedUrl(l.url), i }))
    .filter(l => l.embedUrl !== null);

  if (validLinks.length === 0) return null;

  const clampedIndex = Math.min(activeIndex, validLinks.length - 1);
  const active = validLinks[clampedIndex];

  return (
    <div className="music-embed">
      {validLinks.length > 1 && (
        <div className="music-embed-tabs">
          {validLinks.map((l, idx) => (
            <button
              key={l.i}
              className={`music-embed-tab ${idx === clampedIndex ? 'music-embed-tab-active' : ''}`}
              onClick={() => setActiveIndex(idx)}
              title={l.description || l.url}
            >
              {l.description || `Track ${idx + 1}`}
            </button>
          ))}
        </div>
      )}
      {/* iframe is always rendered so music keeps playing when the panel is hidden via CSS */}
      <div className="music-embed-wrapper">
        <iframe
          key={active.embedUrl}
          src={active.embedUrl!}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={active.description || 'Battle Music'}
        />
      </div>
    </div>
  );
};
