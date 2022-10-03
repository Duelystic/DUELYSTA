import * as desktop from './gulp/desktop';

gulp.task('clean:desktop', clean.desktop);

// Define desktop tasks
const desktopPlatforms = ['darwin', 'win32'];
desktopPlatforms.forEach((platform) => {
  gulp.task(`desktop:build:${platform}`, (cb) => desktop.build({ platform }, cb));
  gulp.task(`desktop:build:steam:${platform}`, (cb) => desktop.build({ platform, steam: true }, cb));
  gulp.task(`desktop:zip:${platform}`, (cb) => desktop.zip(platform, cb));
});
gulp.task('desktop:copy', desktop.copy);
gulp.task('desktop:npm', desktop.npm);
gulp.task('desktop:shasums', desktop.shasums);
gulp.task('desktop:setup', desktop.setup);
gulp.task('desktop:git:clone', git.desktopClone);
gulp.task('desktop:git:sync', git.desktopSync);
gulp.task('desktop:git:commit', git.desktopCommit);
gulp.task('desktop:git:push', git.desktopPush);
// gulp.task('desktop:git:diff', git.desktopDiff);
// gulp.task('desktop:git:publish', git.desktopPublish);
gulp.task('desktop:git', gulp.series(
  'clean:git',
  'desktop:git:clone',
  'desktop:git:sync',
  'desktop:git:commit',
  'desktop:git:push',
  // 'desktop:git:diff',
));
gulp.task('desktop:build', gulp.series(
  validateConfigForDesktop,
  'clean:all',
  // overrideCdnUrl,
  'source',
  // restoreCdnUrl,
  'rsx:codex_urls',
  'rsx:copy',
  'desktop:setup',
  'desktop:npm',
  'desktop:copy',
  'desktop:build:darwin',
  'desktop:build:win32',
));
gulp.task('desktop:build:steam', gulp.series(
  validateConfigForDesktop,
  'clean:all',
  // overrideCdnUrl,
  'source',
  // restoreCdnUrl,
  'rsx:codex_urls',
  'rsx:copy',
  'desktop:setup',
  'desktop:npm',
  'desktop:copy',
  'desktop:build:steam:darwin',
  'desktop:build:steam:win32',
));
gulp.task('desktop:package', gulp.series(
  'desktop:zip:darwin',
  'desktop:zip:win32',
  'desktop:git',
  'desktop:shasums',
  // 'desktop:git:publish',
));
gulp.task('desktop:package:steam', gulp.series(
  desktop.steamPrep,
  desktop.steamUpload,
));
gulp.task('desktop:build:dev', gulp.series(
  'rsx:packages',
  'source',
  'rsx:copy',
  'desktop:copy',
));