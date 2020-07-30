import {
  CompletedJob, Job,
  JobResultError,
  JobResultSuccess,
  JobResultTimeout, Query,
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
  port: number | null;
  search: string;
}

export interface CompletedJobSuccess extends CompletedJob {
  result: JobResultSuccess;
}

export interface CompletedJobError extends CompletedJob {
  result: JobResultError;
}

export interface CompletedJobTimeout extends CompletedJob {
  result: JobResultTimeout;
}

export interface QueryWithJobs extends Query {
  jobs: Job[];
}
