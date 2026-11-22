import { Play, Pause } from "lucide-react";
import { useState, useRef } from "react";

export default function FloatingControlMusic() {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <audio ref={audioRef} src="/music/song.mp3" loop autoPlay />

      <div className="va-float va-float--right mb-15">
        <button
          className="va-fab va-fab--square"
          style={{ width: "auto", padding: "0 16px", gap: "8px" }}
          onClick={togglePlay}
          title={isPlaying ? "Jeda musik" : "Putar musik"}
          aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
        >
          {isPlaying ? (
            <>
              <Pause size={18} />
              <span>Jeda Musik</span>
            </>
          ) : (
            <>
              <Play size={18} />
              <span>Putar Musik</span>
            </>
          )}
        </button>
      </div>
    </>
  );
}
