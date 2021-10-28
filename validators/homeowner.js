const { body, param, validationResult } = require('express-validator');
const parser = require('fast-xml-parser');

exports.create = async (req, res, next) => {
    await validateXML(req, res, next);
}

exports.update = async (req, res, next) => {
    await body('id')
            .notEmpty()
            .withMessage("The value should not be empty")
            .run(req);
    await validateXML(req, res, next);
}

exports.getBy = async(req, res, next) => {
    next();
}

exports.getAll = async(req, res, next) => {
    next();
}

exports.getById = async(req, res, next) => {
    await body('id')
            .notEmpty()
            .withMessage("The value should not be empty")
            .run(req);
    const errors = validationResult(req);
    if(errors.isEmpty()){
        next(); return;
    }
    return res.status(422).json({errors});
}

exports.remove = async(req, res, next) => {
    next();
}

validateXML = async(req, res, next) => {
    await body('xml')
            .notEmpty()
            .withMessage("xml cannot be empty")
            .run(req);
    const errors = validationResult(req);
    if(errors.isEmpty()){
        const validateXml = parser.validate(req.body.xml);
        if(validateXml.err != undefined) return res.status(422).json(validateXml.err.msg);

        const parsedXml = parser.parse(req.body.xml);
        if(parsedXml.homeowner == undefined) return res.status(422).json("Unable to find tag <Homeowner>");
        req.body.data = parsedXml.homeowner;
        req.body.data.dob = new Date(req.body.data.dob);
        next(); return;
    }
    return res.status(422).json({errors});
}