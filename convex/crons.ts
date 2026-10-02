import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

crons.hourly('sweep orphaned uploads', { minuteUTC: 17 }, internal.storage.sweepOrphanedUploads);
crons.hourly('sweep orphaned scans', { minuteUTC: 47 }, internal.scanUploadsNode.sweepOrphanedScans);

export default crons;
