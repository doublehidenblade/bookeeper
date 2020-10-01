export enum LoadState {
  loading,
  loaded,
  error
}

export type Entries = {
  [key: string]: any
}

export type ListData = {
  category: string;
  data: {
    key: string;
    label: string;
    value: number;
  }[];
}[];