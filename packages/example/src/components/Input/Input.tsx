// Copyright 2022 Fewcha. All rights reserved.

import React, { forwardRef } from "react";
import cn from "../../services/cn";

export interface FormInputProps {
  name: string;
  placeholder: string;
  type?: string;
  hasError?: boolean;
  hasWarning?: boolean;
  hasHelp?: boolean;
  autoComplete?: string;
  defaultValue?: string;
  className?: string;
  required?: boolean;
  isError?: boolean;
  ourOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.ForwardRefExoticComponent<
  FormInputProps & React.RefAttributes<HTMLInputElement>
> = forwardRef<
  HTMLInputElement,
  FormInputProps & React.InputHTMLAttributes<HTMLInputElement>
>(
  (
    {
      placeholder,
      hasError = false,
      hasWarning = false,
      hasHelp = false,
      type = "text",
      autoComplete,
      defaultValue = "",
      className = "",
      required,
      isError,
      onChange,
      ourOnChange,
      ...props
    },
    ref
  ) => {
    return (
      <input
        className={cn(
          "block sm:w-2/3 lg:w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400",
          "focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
          "disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none",
          "invalid:border-pink-500 invalid:text-pink-600",
          "focus:invalid:border-pink-500 focus:invalid:ring-pink-500",
          {
            "border-pink-500 text-pink-600 focus:border-pink-500 focus:ring-pink-500":
              isError,
          }
        )}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete || undefined}
        defaultValue={defaultValue}
        required={required}
        ref={ref}
        onChange={(e) => {
          if (ourOnChange) ourOnChange(e);
          if (onChange) onChange(e);
        }}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export default Input;
