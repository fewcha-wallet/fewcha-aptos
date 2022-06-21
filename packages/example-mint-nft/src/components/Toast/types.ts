// Copyright 2022 Fewcha. All rights reserved.

import Joi from "joi";
// import Ajv, { JSONSchemaType } from "ajv";
// const ajv = new Ajv();

export interface ToastReducer {
  show: boolean;
  title: string;
  message: string;
  type: "success" | "warning" | "error" | "info";
}

// export const schema: JSONSchemaType<ToastReducer> = {
//   type: "object",
//   properties: {
//     show: { type: "boolean" },
//     title: { type: "string" },
//     message: { type: "string" },
//     type: { type: "string" },
//   },
//   required: ["show"],
//   additionalProperties: false,
// };

const schema = Joi.object<ToastReducer>({
  show: Joi.boolean().default(false).required(),
  title: Joi.string().default("").required(),
  message: Joi.string().default("").required(),
  type: Joi.string()
    .valid("success", "warning", "error", "info")
    .default("success")
    .required(),
});

// export const toastTypeValidate = ajv.compile(toastTypeSchema);
export const toastTypeValidate = (data: ToastReducer) => schema.validate(data);
