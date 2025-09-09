// wrapAsync for socket.io
const wrapAsyncSocket = (fn, socket, responseEvent) => {
  return async (...args) => {
    try {
      await fn(...args);
    } catch (err) {
      console.error(`Socket error on ${responseEvent}:`, err);
      socket.emit(responseEvent, {
        success: false,
        message: err.message || "Internal Server Error",
      });
    }
  };
};

export default wrapAsyncSocket;
