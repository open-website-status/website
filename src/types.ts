export interface PieChartData {
  data: number;
  color: string;
  label: string;
}

export interface QueryURL {
  protocol: 'http:' | 'https:';
  hostname: string;
  pathname: string;
  port: number | undefined;
  search: string;
}

export interface BaseHistoryJob {
  id: string;
  queryId: string;
  jobState: string;
}

export interface DispatchedJob {
  jobState: 'dispatched';
}

export interface AcceptedJob {
  jobState: 'accepted';
}

export interface RejectedJob {
  jobState: 'rejected';
}

export interface CanceledJob {
  jobState: 'canceled';
}

export interface JobResultSuccess {
  state: 'success',
  httpCode: number,
  executionTime: number,
}

export interface JobResultTimeout {
  state: 'timeout';
  executionTime: number;
}

export interface JobResultError {
  state: 'error';
  errorCode: string;
}

export type JobResult = JobResultSuccess | JobResultTimeout | JobResultError;

export interface CompletedJob<T = JobResult> {
  jobState: 'completed';
  result: T;
}

export type HistoryJob<T = JobResult> = BaseHistoryJob & (DispatchedJob | AcceptedJob | RejectedJob | CanceledJob | CompletedJob<T>);

export interface HistoryQuery extends QueryURL {
  id: string;
  timestamp: Date;
  jobs: HistoryJob[];
}
