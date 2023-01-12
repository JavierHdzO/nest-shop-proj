import * as joi from 'joi';

export const JoiValidationSchema = joi.object({
    PORT: joi.number()
});