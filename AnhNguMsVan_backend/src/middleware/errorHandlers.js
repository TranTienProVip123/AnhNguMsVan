const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "có lỗi xảy ra!" });
};

export default errorHandler;