import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Track {
  trackName: string;
  trackId: string;
  artistName: string;
  artistId: string;
  artistMonthlyListeners: number;
  releaseYear: number;
  popularity: {
    playCount: number;
    youtubeViews: number;
    youtubeLikes: number;
    youtubeComments: number;
  };
  indicator: number;
}

interface TracksData {
  version: string;
  generatedAt: string;
  totalTracks: number;
  tracks: Track[];
}

interface Stats {
  count: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  stdDev: number;
  q1: number;
  q3: number;
  sum: number;
}

function calculateStats(values: number[]): Stats {
  if (values.length === 0) {
    return {
      count: 0,
      min: 0,
      max: 0,
      mean: 0,
      median: 0,
      stdDev: 0,
      q1: 0,
      q3: 0,
      sum: 0,
    };
  }

  // 排序數值
  const sorted = [...values].sort((a, b) => a - b);
  const count = sorted.length;

  // 最小值和最大值
  const min = sorted[0];
  const max = sorted[count - 1];

  // 總和
  const sum = sorted.reduce((acc, val) => acc + val, 0);

  // 平均值
  const mean = sum / count;

  // 中位數
  const median =
    count % 2 === 0
      ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
      : sorted[Math.floor(count / 2)];

  // 標準差
  const variance =
    sorted.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
  const stdDev = Math.sqrt(variance);

  // 四分位數
  const q1Index = Math.floor(count * 0.25);
  const q3Index = Math.floor(count * 0.75);
  const q1 = sorted[q1Index];
  const q3 = sorted[q3Index];

  return {
    count,
    min,
    max,
    mean,
    median,
    stdDev,
    q1,
    q3,
    sum,
  };
}

function formatNumber(num: number): string {
  return num.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function printStats(label: string, stats: Stats) {
  console.log(`\n${label}`);
  console.log("=".repeat(60));
  console.log(`資料筆數: ${formatNumber(stats.count)}`);
  console.log(`總和:     ${formatNumber(stats.sum)}`);
  console.log(`最小值:   ${formatNumber(stats.min)}`);
  console.log(`最大值:   ${formatNumber(stats.max)}`);
  console.log(`平均值:   ${formatNumber(stats.mean)}`);
  console.log(`中位數:   ${formatNumber(stats.median)}`);
  console.log(`標準差:   ${formatNumber(stats.stdDev)}`);
  console.log(`第一四分位數 (Q1): ${formatNumber(stats.q1)}`);
  console.log(`第三四分位數 (Q3): ${formatNumber(stats.q3)}`);
  console.log(`四分位距 (IQR):    ${formatNumber(stats.q3 - stats.q1)}`);
}

function main() {
  // 讀取 JSON 檔案
  const dataPath = path.join(__dirname, "../public/data/tracks.json");
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const data: TracksData = JSON.parse(rawData);

  console.log("=".repeat(60));
  console.log("音樂人氣度統計分析");
  console.log("=".repeat(60));
  console.log(`資料版本: ${data.version}`);
  console.log(`資料生成時間: ${data.generatedAt}`);
  console.log(`總歌曲數: ${formatNumber(data.totalTracks)}`);

  // 提取各項人氣度指標
  const playCount: number[] = [];
  const youtubeViews: number[] = [];
  const youtubeLikes: number[] = [];
  const youtubeComments: number[] = [];

  data.tracks.forEach((track) => {
    playCount.push(track.popularity.playCount);
    youtubeViews.push(track.popularity.youtubeViews);
    youtubeLikes.push(track.popularity.youtubeLikes);
    youtubeComments.push(track.popularity.youtubeComments);
  });

  // 計算並顯示各項指標的統計特徵
  printStats("播放次數 (Play Count)", calculateStats(playCount));
  printStats("YouTube 觀看次數 (YouTube Views)", calculateStats(youtubeViews));
  printStats("YouTube 按讚數 (YouTube Likes)", calculateStats(youtubeLikes));
  printStats(
    "YouTube 留言數 (YouTube Comments)",
    calculateStats(youtubeComments),
  );

  // 找出極值對應的歌曲
  console.log("\n");
  console.log("=".repeat(60));
  console.log("極值歌曲資訊");
  console.log("=".repeat(60));

  // 播放次數最高
  const maxPlayCountTrack = data.tracks.reduce((max, track) =>
    track.popularity.playCount > max.popularity.playCount ? track : max,
  );
  console.log(
    `\n播放次數最高: ${maxPlayCountTrack.trackName} - ${maxPlayCountTrack.artistName}`,
  );
  console.log(
    `  播放次數: ${formatNumber(maxPlayCountTrack.popularity.playCount)}`,
  );

  // YouTube 觀看次數最高
  const maxYoutubeViewsTrack = data.tracks.reduce((max, track) =>
    track.popularity.youtubeViews > max.popularity.youtubeViews ? track : max,
  );
  console.log(
    `\nYouTube 觀看次數最高: ${maxYoutubeViewsTrack.trackName} - ${maxYoutubeViewsTrack.artistName}`,
  );
  console.log(
    `  YouTube 觀看次數: ${formatNumber(maxYoutubeViewsTrack.popularity.youtubeViews)}`,
  );

  // YouTube 按讚數最高
  const maxYoutubeLikesTrack = data.tracks.reduce((max, track) =>
    track.popularity.youtubeLikes > max.popularity.youtubeLikes ? track : max,
  );
  console.log(
    `\nYouTube 按讚數最高: ${maxYoutubeLikesTrack.trackName} - ${maxYoutubeLikesTrack.artistName}`,
  );
  console.log(
    `  YouTube 按讚數: ${formatNumber(maxYoutubeLikesTrack.popularity.youtubeLikes)}`,
  );

  // YouTube 留言數最高
  const maxYoutubeCommentsTrack = data.tracks.reduce((max, track) =>
    track.popularity.youtubeComments > max.popularity.youtubeComments
      ? track
      : max,
  );
  console.log(
    `\nYouTube 留言數最高: ${maxYoutubeCommentsTrack.trackName} - ${maxYoutubeCommentsTrack.artistName}`,
  );
  console.log(
    `  YouTube 留言數: ${formatNumber(maxYoutubeCommentsTrack.popularity.youtubeComments)}`,
  );

  console.log("\n");
}

main();
