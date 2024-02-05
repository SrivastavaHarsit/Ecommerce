// This middleware is likely intended to be used as a catch-all error handler. When an error occurs during the processing of a request, this middleware will be invoked, and it will send a JSON response containing information about the error back to the client. The client can then use this information for debugging or logging purposes.

export const globalErrhandler = (err, req, res, next)=>{
    // stack (which and how error)
    //message
    const stack = err?.stack; // The stack trace provides information about the sequence of function calls that led to the error. It's useful for debugging.
    // const statusCode = err?.statusCode?err?.statusCode : 500;
    const statusCode = err?.statusCode ?? 500;
    const message = err?.message;

    res.status(statusCode).json({
        stack,
        message,
    });
};

// int the above function we are not using next() like below function because if we dont
// use next() that means we are exiting the application, it should not move

// 404 handler
export const notFound = (req, res, next)=>{
    const err = new Error(`Route ${req.originalUrl} not found`);
    next(err);
};