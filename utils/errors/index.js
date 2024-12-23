const NODE_ENV = process.env.NODE_ENV;

module.exports = (app) => {
  app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    let message;

    if (statusCode === 500 && NODE_ENV === "production") {
      message = "Internal server error";
    } else {
      if (statusCode === 500) {
        console.error(error);
      }
      message = error.message;
    }

    return res.status(statusCode).json({
      status: false,
      code: statusCode,
      message: message,
      data: null,
    });
  });
};
