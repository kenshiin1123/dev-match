class AppError extends Error {
  constructor(message, status, data) {
    super();
    this.message = message;
    this.status = status;
    this.data = data;
  }
}

export default AppError;
