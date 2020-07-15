import { JobResult } from '@/types';

export interface BaseFullJob {
  id: string;
  queryId: string;
  jobState: string;
  dispatchTimestamp: Date;
  countryCode: string;
  regionCode: string;
  ispName: string;
}

export interface DispatchedFullJob extends BaseFullJob {
  jobState: 'dispatched';
}

export interface AcceptedFullJob extends BaseFullJob {
  jobState: 'accepted';
  acceptTimestamp: Date;
}

export interface RejectedFullJob extends BaseFullJob {
  jobState: 'rejected';
  rejectTimestamp: Date;
}

export interface CanceledFullJob extends BaseFullJob {
  jobState: 'canceled';
  acceptTimestamp: Date;
  cancelTimestamp: Date;
}

export interface CompletedFullJob<T = JobResult> extends BaseFullJob {
  jobState: 'completed';
  result: T;
  acceptTimestamp: Date;
  completeTimestamp: Date;
}

export type FullJob<T = JobResult> = DispatchedFullJob | AcceptedFullJob | RejectedFullJob | CanceledFullJob | CompletedFullJob<T>;
