// Copyright 2022 Fewcha. All rights reserved.

import Joi from "joi";
// import Ajv, { JSONSchemaType } from "ajv";
// const ajv = new Ajv();

export type AppReducer = {
  isLoggedIn: boolean;
  openSidebar: boolean;
  installed: boolean;
  hasWallet: boolean;

  loading: boolean;
  version: string;
};

export const defaultAppReducer: AppReducer = {
  isLoggedIn: false,
  openSidebar: false,
  installed: false,
  hasWallet: false,

  loading: false,
  version: "0.1.0",
};

// const schema: JSONSchemaType<AppReducer> = {
//   type: "object",
//   properties: {
//     isLoggedIn: {
//       type: "boolean",
//       nullable: false,
//       default: false,
//     },
//     openSidebar: {
//       type: "boolean",
//       nullable: false,
//       default: false,
//     },
//     installed: {
//       type: "boolean",
//       nullable: false,
//       default: false,
//     },
//     hasWallet: {
//       type: "boolean",
//       nullable: false,
//       default: false,
//     },

//     loading: { type: "boolean", nullable: false, default: false },
//     version: { type: "string", nullable: false, default: "0.1.0" },
//   },
//   required: [
//     "isLoggedIn",
//     "openSidebar",
//     "installed",
//     "hasWallet",
//     "loading",
//     "version",
//   ],
//   additionalProperties: false,
// };

const schema = Joi.object<AppReducer>({
  isLoggedIn: Joi.boolean().default(false).required(),
  openSidebar: Joi.boolean().default(false).required(),
  installed: Joi.boolean().default(false).required(),
  hasWallet: Joi.boolean().default(false).required(),

  loading: Joi.boolean().default(false).required(),
  version: Joi.string().default("0.1.0").required(),
});

// export const appValidate = ajv.compile(schema);
export const appValidate = (data: AppReducer) => schema.validate(data);
