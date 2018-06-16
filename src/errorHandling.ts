export default (fn: any, message: string) => (...params: any[]) => {
  return fn(...params).catch(function(err: any) {
    console.log(message);
    console.error(err);
    process.exit(1);
  });
};
