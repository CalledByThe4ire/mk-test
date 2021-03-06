'use strict';

const gulp = tars.packages.gulp;
const runSequence = tars.packages.runSequence.use(gulp);
const watcherLog = tars.helpers.watcherLog;

/**
 * Watcher for ie8 stylies
 */
module.exports = () => {
    if (tars.flags.ie8 || tars.flags.ie) {
        return tars.packages.chokidar
            .watch(
                [
                    `markup/${tars.config.fs.componentsFolderName}/**/ie8.${tars.cssPreproc.ext}`,
                    `markup/${tars.config.fs.componentsFolderName}/**/ie8.css`,
                ],
                tars.options.watch,
            )
            .on('all', (event, watchedPath) => {
                watcherLog(event, watchedPath);
                runSequence('css:compile-css-for-ie8');
            });
    }

    return false;
};
