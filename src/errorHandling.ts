export default (fn, message) => (...params) => {
  return fn(...params).catch(function(err) {
    console.log(message);
    console.error(err);
    process.exit(1);
  });
};
