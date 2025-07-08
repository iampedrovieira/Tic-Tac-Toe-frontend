//Middlewares token validations 

import {NextFunction, Request, Response } from 'express';

module.exports = {
  tokenValidation(req:Request, res:Response,next:NextFunction) {
    console.log('teste mid')
    next();
  },
};
