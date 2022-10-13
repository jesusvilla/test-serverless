export default {
  info(...args: any) {
    // eslint-disable-next-line
    console.log.apply(console, args.map((item: any) => JSON.stringify(item)));
  },
  error(exception: any) {
    // eslint-disable-next-line
    console.error(exception);
  },
};
