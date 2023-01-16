import Joi, * as joi from 'joi';

export const JoiValidationSchema = joi.object({
    PORT: joi.number(),
    NODE_ENV: joi.string().valid('dev','prod'),
    HOST_DB:joi.string(),
    PORT_DB:joi.string(),
    USERNAME_DB:joi.string(),
    PASSWORD_DB:joi.string(),
    DATABASE_NAME:joi.string(),
    HOST_API:joi.string(),
    JWT_SECRET: joi.string()
});