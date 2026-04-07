import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

let ffmpeg = null;

export const initFFmpeg = async (onProgress) => {
  if (ffmpeg) return ffmpeg;
  
  ffmpeg = new FFmpeg();
  
  if (onProgress) {
    ffmpeg.on('progress', ({ progress }) => {
      onProgress(Math.round(progress * 100));
    });
  }

  try {
    await ffmpeg.load({
      coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
      wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm',
    });
    return ffmpeg;
  } catch (error) {
    console.error("FFmpeg initialization failed:", error);
    throw new Error("Failed to initialize video processing engine.");
  }
};

export const trimVideo = async (videoFile, startTime, endTime, onProgress) => {
  const ff = await initFFmpeg(onProgress);
  const inputName = 'input.mp4';
  const outputName = 'output.mp4';

  await ff.writeFile(inputName, await fetchFile(videoFile));
  
  const duration = endTime - startTime;
  
  await ff.exec([
    '-ss', startTime.toString(),
    '-i', inputName,
    '-t', duration.toString(),
    '-c:v', 'copy',
    '-c:a', 'copy',
    outputName
  ]);

  const data = await ff.readFile(outputName);
  return new Blob([data.buffer], { type: 'video/mp4' });
};

export const adjustSpeed = async (videoFile, speedFactor, onProgress) => {
  const ff = await initFFmpeg(onProgress);
  const inputName = 'input.mp4';
  const outputName = 'output.mp4';

  await ff.writeFile(inputName, await fetchFile(videoFile));
  
  const videoFilter = `setpts=${1/speedFactor}*PTS`;
  const audioFilter = `atempo=${speedFactor}`;

  await ff.exec([
    '-i', inputName,
    '-filter_complex', `[0:v]${videoFilter}[v];[0:a]${audioFilter}[a]`,
    '-map', '[v]',
    '-map', '[a]',
    outputName
  ]);

  const data = await ff.readFile(outputName);
  return new Blob([data.buffer], { type: 'video/mp4' });
};

export const exportComplexVideo = async ({ clips, audioTracks, textOverlays, aiFeatures, resolution, format, onProgress }) => {
  const ff = await initFFmpeg(onProgress);
  
  let hasText = (textOverlays && textOverlays.length > 0) || (aiFeatures?.subtitles?.enabled && aiFeatures.subtitles.data?.length > 0);
  if (hasText) {
    try {
      const fontUrl = 'https://raw.githubusercontent.com/google/fonts/main/ofl/roboto/Roboto-Regular.ttf';
      await ff.writeFile('font.ttf', await fetchFile(fontUrl));
    } catch(e) {
      console.warn("Failed to load font, text overlays might fail.");
      hasText = false;
    }
  }

  const inputArgs = [];
  let filterComplex = '';
  
  // 1. Write and add video clips
  for (let i = 0; i < clips.length; i++) {
    const clip = clips[i];
    const name = `clip_${i}.mp4`;
    await ff.writeFile(name, await fetchFile(clip.file));
    inputArgs.push('-i', name);
  }

  // 2. Write and add audio tracks
  const audioStartIndex = clips.length;
  for (let i = 0; i < audioTracks.length; i++) {
    const track = audioTracks[i];
    const name = `audio_${i}.mp3`;
    await ff.writeFile(name, await fetchFile(track.file));
    inputArgs.push('-i', name);
  }

  // Build filter_complex
  let videoOut = '';
  let audioOut = '';

  // Determine base scale based on resolution
  const resScale = resolution === '1080p' ? '1920:1080' : '1280:720';

  if (clips.length > 0) {
    let concatStr = '';
    for (let i = 0; i < clips.length; i++) {
      let vFilters = `scale=${resScale},setsar=1`;
      
      // Apply AI Color Correction
      if (aiFeatures?.colorCorrection?.enabled) {
        const { brightness, contrast, saturation } = aiFeatures.colorCorrection;
        const b = brightness / 100; // -1 to +1
        const c = 1 + (contrast / 100); // 0 to 2
        const s = 1 + (saturation / 100); // 0 to 2
        vFilters += `,eq=brightness=${b}:contrast=${c}:saturation=${s}`;
      }

      // Apply AI Auto Crop
      if (aiFeatures?.autoCrop?.enabled && aiFeatures.autoCrop.cropRegion) {
         // simple center crop as fallback in export for now
         vFilters += `,crop=iw*0.8:ih*0.8`;
      }

      filterComplex += `[${i}:v]${vFilters}[v${i}]; `;
      concatStr += `[v${i}][${i}:a]`;
    }
    filterComplex += `${concatStr}concat=n=${clips.length}:v=1:a=1[v_concat][a_base]; `;
    videoOut = '[v_concat]';
    audioOut = '[a_base]';
  }

  // Apply AI Noise Removal to base audio
  if (aiFeatures?.noiseRemoval?.enabled) {
      filterComplex += `[${audioOut}]highpass=f=200,lowpass=f=3000[a_denoised]; `;
      audioOut = '[a_denoised]';
  }

  // Add Text Overlays
  if (hasText) {
    let lastV = videoOut.replace(/[\[\]]/g, '');
    
    // Custom texts
    if (textOverlays && textOverlays.length > 0) {
        textOverlays.forEach((txt, idx) => {
        const nextV = `v_txt_${idx}`;
        const escapedText = txt.text.replace(/'/g, "\\'").replace(/:/g, "\\:");
        const drawtext = `drawtext=fontfile=font.ttf:text='${escapedText}':fontsize=${txt.size}:fontcolor=${txt.color.replace('#', '')}:x=${txt.x}:y=${txt.y}:enable='between(t,${txt.startTime},${txt.startTime + txt.duration})'`;
        filterComplex += `[${lastV}]${drawtext}[${nextV}]; `;
        lastV = nextV;
        });
    }

    // AI Subtitles
    if (aiFeatures?.subtitles?.enabled && aiFeatures.subtitles.data?.length > 0) {
        aiFeatures.subtitles.data.forEach((sub, idx) => {
            const nextV = `v_sub_${idx}`;
            const escapedText = sub.text.replace(/'/g, "\\'").replace(/:/g, "\\:");
            // Place at bottom center
            const drawtext = `drawtext=fontfile=font.ttf:text='${escapedText}':fontsize=32:fontcolor=white:bordercolor=black:borderw=2:x=(w-text_w)/2:y=h-100:enable='between(t,${sub.startTime},${sub.endTime})'`;
            filterComplex += `[${lastV}]${drawtext}[${nextV}]; `;
            lastV = nextV;
        });
    }

    videoOut = `[${lastV}]`;
  }

  // Mix Audio Tracks
  if (audioTracks.length > 0) {
    let amixStr = audioOut;
    for (let i = 0; i < audioTracks.length; i++) {
      const delay = audioTracks[i].startTime * 1000; // ms
      filterComplex += `[${audioStartIndex + i}:a]adelay=${delay}|${delay},volume=${audioTracks[i].volume / 100}[a_delayed_${i}]; `;
      amixStr += `[a_delayed_${i}]`;
    }
    filterComplex += `${amixStr}amix=inputs=${audioTracks.length + 1}:duration=first:dropout_transition=2[a_mix]; `;
    audioOut = `[a_mix]`;
  }

  const outputName = `output.${format}`;
  
  const cmd = [
    ...inputArgs,
    ...(filterComplex.trim() ? ['-filter_complex', filterComplex.trim()] : []),
    '-map', videoOut || '0:v',
    '-map', audioOut || '0:a',
    '-c:v', format === 'webm' ? 'libvpx-vp9' : 'libx264',
    '-c:a', format === 'webm' ? 'libvorbis' : 'aac',
    '-pix_fmt', 'yuv420p',
    '-y',
    outputName
  ];

  console.log("FFmpeg CMD:", cmd.join(' '));
  await ff.exec(cmd);

  const data = await ff.readFile(outputName);
  const mime = format === 'webm' ? 'video/webm' : 'video/mp4';
  return new Blob([data.buffer], { type: mime });
};