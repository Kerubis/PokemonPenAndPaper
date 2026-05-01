import React, { useState, useEffect, useRef } from 'react';
import type { MusicLink } from '@/features/encounters/types/Encounter';
import { useMusicContext } from '@/contexts/MusicContext';
import './MusicEmbed.css';

function getYouTubeEmbedUrl(url: string, origin: string): string | null {
  try {
    const parsed = new URL(url);
    const base = `enablejsapi=1&autoplay=1&origin=${encodeURIComponent(origin)}`;
    const list = parsed.searchParams.get('list');
    if (list && parsed.hostname.includes('youtube.com')) {
      return `https://www.youtube.com/embed/videoseries?list=${list}&${base}`;
    }
    const v = parsed.searchParams.get('v');
    if (v) return `https://www.youtube.com/embed/${v}?${base}`;
    if (parsed.hostname === 'youtu.be') {
      const id = parsed.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}?${base}`;
    }
    if (parsed.hostname.includes('youtube.com') && parsed.pathname.startsWith('/embed/')) {
      const embedParsed = new URL(url);
      embedParsed.searchParams.set('autoplay', '1');
      embedParsed.searchParams.set('enablejsapi', '1');
      embedParsed.searchParams.set('origin', origin);
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
  const { setIsPlaying } = useMusicContext();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Subscribe to onStateChange once the iframe has loaded
  const handleIframeLoad = () => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'listening' }),
      'https://www.youtube.com'
    );
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onStateChange'] }),
      'https://www.youtube.com'
    );
  };

  // Listen for YouTube player state messages
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.origin.includes('youtube.com')) return;
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data?.event === 'onStateChange') {
          setIsPlaying(data.info === 1);
        } else if (data?.event === 'infoDelivery' && data?.info?.playerState !== undefined) {
          setIsPlaying(data.info.playerState === 1);
        }
      } catch {
        // ignore non-JSON messages
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [setIsPlaying]);

  // Reset active index and playing state when links change
  useEffect(() => {
    setActiveIndex(0);
    setIsPlaying(false);
  }, [musicLinks.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const origin = window.location.origin;
  const validLinks = musicLinks
    .map((l, i) => ({ ...l, embedUrl: getYouTubeEmbedUrl(l.url, origin), i }))
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
          ref={iframeRef}
          key={active.embedUrl}
          src={active.embedUrl!}
          onLoad={handleIframeLoad}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={active.description || 'Battle Music'}
        />
      </div>
    </div>
  );
};
