// export const handleError = (fn: any) => (...params: any[]) =>
//   fn(...params).catch((error: any) => {
//     console.error(error);
//     process.exit(1);
//   });

// make a function to handle that error
export function handleError(fn: any) {
  return function(...params: any[]) {
    return fn(...params)
      .catch(function(err: any) {
      console.error(err);
      process.exit(1);
    });
  };
}
