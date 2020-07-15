export interface PieChartData {
  data: number;
  color: string;
  label: string;
}

export interface JobStateItem extends PieChartData {
  description: string;
}

export interface QueryURL {
  protocol: 'http:' | 'https:';
  hostname: string;
  pathname: string;
  port: number | undefined;
  search: string;
}

export interface Query extends QueryURL {
  id: string;
  timestamp: Date;
}

export interface JobResultSuccess {
  state: 'success';
  httpCode: number;
  executionTime: number;
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

export * from './history';
export * from './full-jobs';
