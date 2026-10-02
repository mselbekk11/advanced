import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

crons.hourly('sweep orphaned uploads', { minuteUTC: 17 }, internal.storage.sweepOrphanedUploads);

export default crons;
