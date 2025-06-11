const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");
ffmpeg.setFfmpegPath("C:\\Program Files\\ffmpeg\\ffmpeg.exe");

const resolutions = [
  { label: "360p", size: "640x360", bitrate: "800k", audioBitrate: "96k" },
  { label: "720p", size: "1280x720", bitrate: "2800k", audioBitrate: "128k" },
  { label: "1080p", size: "1920x1080", bitrate: "5000k", audioBitrate: "192k" },
];

const uploadVideo = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "Файл не найден" });

    const inputPath = file.path;
    const videoId = Date.now().toString();
    const outputDir = path.join(__dirname, "..", "uploads", "videos", videoId);
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const masterPlaylistPath = path.join(outputDir, "master.m3u8");

    const createStream = ({ label, size, bitrate, audioBitrate }) => {
      return new Promise((resolve, reject) => {
        const streamDir = path.join(outputDir, label);
        if (!fs.existsSync(streamDir)) fs.mkdirSync(streamDir);

        const playlistName = "index.m3u8";
        const playlistPath = path.join(streamDir, playlistName);

        ffmpeg(inputPath)
          .size(size)
          .videoCodec("libx264")
          .audioCodec("aac")
          .audioBitrate(audioBitrate)
          .videoBitrate(bitrate)
          .outputOptions([
            "-preset veryfast",
            "-g 48",
            "-sc_threshold 0",
            "-hls_time 10",
            "-hls_playlist_type vod",
            `-hls_segment_filename ${path.join(streamDir, "segment_%03d.ts")}`,
          ])
          .output(playlistPath)
          .on("end", () =>
            resolve({ label, playlist: `./${label}/${playlistName}`, bitrate })
          )
          .on("error", (err) => reject(err))
          .run();
      });
    };

    const streams = await Promise.all(resolutions.map(createStream));

    fs.unlinkSync(inputPath);

    let masterPlaylistContent = "#EXTM3U\n#EXT-X-VERSION:3\n";

    streams.forEach(({ label, playlist, bitrate }) => {
      const bandwidth = parseInt(bitrate.replace("k", "")) * 1000;
      masterPlaylistContent +=
        `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${label}\n` +
        `${playlist}\n`;
    });

    fs.writeFileSync(masterPlaylistPath, masterPlaylistContent);

    res.status(200).json({
      message: "Видео успешно перекодировано в адаптивный HLS",
      hlsUrl: `/uploads/videos/${videoId}/master.m3u8`,
    });
  } catch (err) {
    console.error("Ошибка при перекодировке:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

module.exports = { uploadVideo };
