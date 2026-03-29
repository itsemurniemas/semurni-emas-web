export type DataViewState<T> =
  | { type: "initiate" }
  | { type: "loading" }
  | { type: "success"; data: T }
  | { type: "error"; message?: string };

export const DataViewState = {
  initiate: <T>(): DataViewState<T> => ({ type: "initiate" }),
  loading: <T>(): DataViewState<T> => ({ type: "loading" }),
  success: <T>(data: T): DataViewState<T> => ({ type: "success", data }),
  error: <T>(message?: string): DataViewState<T> => ({
    type: "error",
    message,
  }),
};
