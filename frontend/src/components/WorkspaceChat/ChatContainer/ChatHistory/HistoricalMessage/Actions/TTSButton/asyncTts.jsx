import { useEffect, useState, useRef } from "react";
import { SpeakerHigh, PauseCircle, CircleNotch } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import { useTranslation } from "react-i18next";

export default function AsyncTTSMessage({ slug, chatId }) {
  const { t } = useTranslation();
  const playerRef = useRef(null);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioSrc, setAudioSrc] = useState(null);

  function speakMessage() {
    if (speaking) {
      playerRef?.current?.pause();
      return;
    }

    try {
      if (!audioSrc) {
        setLoading(true);
        Workspace.ttsMessage(slug, chatId)
          .then((audioBlob) => {
            if (!audioBlob)
              throw new Error(`${t("tts-speak.failed-load-play-message")}`);
            setAudioSrc(audioBlob);
          })
          .catch((e) => showToast(e.message, "error", { clear: true }))
          .finally(() => setLoading(false));
      } else {
        playerRef.current.play();
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      setSpeaking(false);
    }
  }

  useEffect(() => {
    function setupPlayer() {
      if (!playerRef?.current) return;
      playerRef.current.addEventListener("play", () => {
        setSpeaking(true);
      });

      playerRef.current.addEventListener("pause", () => {
        playerRef.current.currentTime = 0;
        setSpeaking(false);
      });
    }
    setupPlayer();
  }, []);

  if (!chatId) return null;
  return (
    <div className="mt-3 relative">
      <button
        onClick={speakMessage}
        data-tooltip-id="message-to-speech"
        data-tooltip-content={
          speaking ? `${t("tts-speak.pause-message")}` : `${t("tts-speak.start-message")}`
        }
        className="border-none text-zinc-300"
        aria-label={speaking ? `${t("tts-speak.pause-speech")}` : `${t("tts-speak.start-speech")}`}
      >
        {speaking ? (
          <PauseCircle size={18} className="mb-1" />
        ) : (
          <>
            {loading ? (
              <CircleNotch size={18} className="mb-1 animate-spin" />
            ) : (
              <SpeakerHigh size={18} className="mb-1" />
            )}
          </>
        )}
        <audio
          ref={playerRef}
          hidden={true}
          src={audioSrc}
          autoPlay={true}
          controls={false}
        />
      </button>
      <Tooltip
        id="message-to-speech"
        place="bottom"
        delayShow={300}
        className="tooltip !text-xs"
      />
    </div>
  );
}
