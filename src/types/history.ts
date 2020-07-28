import { QueryURL } from '@/types';
import {JobResult} from "@open-website-status/api";

export interface BaseHistoryJob {
  id: string;
  queryId: string;
  jobState: string;
}

export interface DispatchedHistoryJob extends BaseHistoryJob {
  jobState: 'dispatched';
}

export interface AcceptedHistoryJob extends BaseHistoryJob {
  jobState: 'accepted';
}

export interface RejectedHistoryJob extends BaseHistoryJob {
  jobState: 'rejected';
}

export interface CanceledHistoryJob extends BaseHistoryJob {
  jobState: 'canceled';
}

export interface CompletedHistoryJob<T = JobResult> extends BaseHistoryJob {
  jobState: 'completed';
  result: T;
}

export type HistoryJob<T = JobResult> = DispatchedHistoryJob | AcceptedHistoryJob | RejectedHistoryJob | CanceledHistoryJob | CompletedHistoryJob<T>;

export interface HistoryQuery extends QueryURL {
  id: string;
  timestamp: Date;
  jobs: HistoryJob[];
}
