export const isCancelError = (e: any) => {
  return (
    e.code === 4001 ||
    e.message === "canceled" ||
    e.message === "Sign message cancelled"
  );
};
