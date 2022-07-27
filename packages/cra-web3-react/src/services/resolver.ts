import { Resolver } from "react-hook-form";

export type CollectionType = {
  collection: string;
};
export type NFTType = {
  collection: string;
  codename: number;
  description: string;
  url: string;
};

export const resolverError = (key: string, type: string, message: string) => {
  return {
    [key]: {
      type,
      message,
    },
  };
};

export const createCollectionResolver: Resolver<CollectionType> = async (
  values
) => {
  let errors = {};
  if (!values.collection) {
    errors = {
      ...errors,
      ...resolverError(
        "collection",
        "required",
        "Collection name is required!"
      ),
    };
  } else {
    if (values.collection.length < 4) {
      errors = {
        ...errors,
        ...resolverError(
          "collection",
          "required",
          "Collection name must be more than 4 characters!"
        ),
      };
    }
  }
  return { values, errors };
};
export const mintNFTResolver: Resolver<NFTType> = async (values) => {
  let errors = {};
  if (!values.collection) {
    errors = {
      ...errors,
      ...resolverError(
        "collection",
        "required",
        "Collection name is required!"
      ),
    };
  }
  if (!values.codename) {
    errors = {
      ...errors,
      ...resolverError("codename", "required", "Code name is required!"),
    };
  }
  if (!values.description) {
    errors = {
      ...errors,
      ...resolverError("description", "required", "Description is required!"),
    };
  }
  return { values, errors };
};
