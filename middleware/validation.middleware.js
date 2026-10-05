const validationMiddleware = (schema) => {
    return (req, res, next) => {
       const { error } = schema.validate(req.body);

       if(error){
        const errorMesage = error.details[0].message;
        return res.status(422).send({error : errorMesage});
       }
       next();
    };
};

module.exports = validationMiddleware;
