// wrapAsync for socket.io
const wrapAsyncSocket = (fn, socket, responseEvent) => {
  return async (...args) => {
    try {
      await fn(...args);
    } catch (err) {
      if (!err.message) console.error(`Socket error on ${responseEvent}:`, err);
      socket.emit(`${responseEvent}_response`, {
        success: false,
        message: err.message || "Internal Server Error",
      });
    }
  };
};

export default wrapAsyncSocket;
