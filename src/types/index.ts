import {
  CompletedJob,
  JobResultError,
  JobResultSuccess,
  JobResultTimeout,
} from '@open-website-status/api';

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

export * from './history';

export interface CompletedJobSuccess extends CompletedJob {
  result: JobResultSuccess;
}

export interface CompletedJobError extends CompletedJob {
  result: JobResultError;
}

export interface CompletedJobTimeout extends CompletedJob {
  result: JobResultTimeout;
}
