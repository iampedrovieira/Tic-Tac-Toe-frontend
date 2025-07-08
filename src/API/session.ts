import {Request, Response } from 'express';

module.exports = {
  async tokenValidation(req:Request, res:Response) {
    try {
      
      return res.json({'teste':'teste'});
    } catch (error) {}
  },
};
