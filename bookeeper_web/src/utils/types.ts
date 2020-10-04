export enum LoadState {
  loading = 'loading',
  loaded = 'loaded',
  error = 'error',
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

export enum FieldTypes {
  string = 'string',
  number = 'number',
  currency = 'currency',
  integer = 'integer',
  selector = 'selector',
  email = 'email',
  password = 'password',
  date = 'date',
}