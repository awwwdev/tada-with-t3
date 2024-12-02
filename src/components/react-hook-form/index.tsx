import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import TextArea from "@/components/ui/TextArea";
import { HTMLProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useId } from "react";
import { FormProvider, useForm, useFormContext, UseFormProps } from "react-hook-form";
import { z, ZodObject } from "zod";

type FormProps = React.ComponentPropsWithoutRef<"form"> & {
  form: any;
  children: React.ReactNode;
  submitText?: string;
  hasSubmitButton?: boolean;
};

type UseFormHookProps = UseFormProps & {
  schema: ZodObject<any>;
  onSubmit: (values: z.infer<UseFormHookProps["schema"]>, event?: React.FormEvent) => void;
  shouldResetOnSuccess?: boolean;
};

export const useFormHook = ({ schema, onSubmit, shouldResetOnSuccess = true, ...formOptions }: UseFormHookProps) => {
  type FormTypes = z.infer<typeof schema>;
  const { handleSubmit, ...f } = useForm<FormTypes>({ resolver: zodResolver(schema), ...formOptions });
  const _onSubmit = async (fromValues, event) => {
    try {
      await onSubmit(fromValues, event);
      if (shouldResetOnSuccess) {
        f.reset(); // resetting the forma values, so users wont resubmit the same data after a successful submit
      }
    } catch (err) {
      console.log("catching error", err?.message);
      f.setError("root.submit", { message: err?.message });
    }
  };
  return { ...f, onSubmit: handleSubmit(_onSubmit) };
};

export const Form = ({ form, children, hasSubmitButton = true, submitText = "submit", ...props }: FormProps) => (
  <FormProvider {...form}>
    <form {...props} onSubmit={form.onSubmit}>
      {children}
      {hasSubmitButton && (
        <>
          <ErrMsg name="root.submit" />
          <button type="submit" className="btn-prm !mt-8 !mb-8" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <LoadingSpinner /> : submitText}
          </button>
        </>
      )}
    </form>
  </FormProvider>
);

Form.displayName = "From";

type InputElProps = React.ComponentPropsWithoutRef<"input"> & {
  name: string;
  hasErrorMessage?: boolean;
};
type InputProps = InputElProps & {
  hint?: React.ReactNode;
  label?: React.ReactNode;
  hasErrorMessage?: boolean;
  errorMessage?: string;
};

type TextAreaElProps = React.ComponentPropsWithoutRef<"textarea"> & {
  name: string;
  hasErrorMessage?: boolean;
};
type TextAreaProps = TextAreaElProps & { hint?: React.ReactNode; label?: React.ReactNode; hasErrorMessage?: boolean };

const FormInput = ({ label, hasErrorMessage = true, name, errorMessage, ...inputProps }: InputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  if (["checkbox", "radio"].includes(inputProps?.type ?? "")) {
    return (
      <label className="block space-y-1">
        <div className="flex gap-1">
          <InputEl name={name} {...inputProps} className={`${inputProps.className ?? ""} field `} />
          <span className="c-sand11 fw-500 capitalize">{label ?? name}</span>
        </div>
        {hasErrorMessage && <ErrMsg name={name} />}
      </label>
    );
  }

  return (
    <Input
      {...inputProps}
      {...register(name)}
      label={label ?? name}
      errorMessage={errorMessage ?? error?.message?.toString() ?? ""}
    />
  );
};

Form.Input = FormInput;

const FormTextArea = ({ label, hasErrorMessage = true, name, ...inputProps }: TextAreaProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  return <TextArea {...inputProps} {...register(name)} label={label} errorMessage={error?.message?.toString() ?? ""} />;
};

Form.TextArea = FormTextArea;

export const InputEl = ({ name, ...inputProps }: InputElProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  return <input {...register(name)} aria-invalid={error ? "true" : "false"} {...inputProps} />;
};

export const ErrMsg = ({ name }: { name: string }) => {
  const {
    formState: { errors },
  } = useFormContext();
  const error = errors[name];
  // console.log("we are the errors", name, errors);
  // return <ErrorMessage errors={errors} name={name} as="p" role="alert" className="c-red11 bf-i-ph-warning-octagon" />;
  return <ErrorMessage id="">{error?.message?.toString() ?? ""}</ErrorMessage>;
};

// const ErrMsgEl = ({ errors, name }: { errors: any; name: string }) => (
//   <ErrorMessage errors={errors} name={name} as="p" role="alert" className="c-red11 bf-i-ph-warning-octagon" />
// );

type ButtonProps = {
  variant?: "ghost" | "ghost-prm" | "solid" | "solid-prm" | "text" | "text-prm" | "soft" | "soft-prm";
  iconButton?: boolean;
  prereStyled?: boolean;
  width?: "parent" | "content" | "default";
} & React.ComponentPropsWithoutRef<"button">;

const FormSubmitButton = function ({
  children,
  variant = "solid-prm",
  className = "",
  width = "content",
}: ButtonProps) {
  const { register, formState } = useFormContext();

  return (
    <Button
      type="submit"
      className={className}
      variant={variant}
      width={width}
      disabled={formState.isSubmitting}
      isLoading={formState.isSubmitting}
    >
      {" "}
      {formState.isSubmitting ? <LoadingSpinner /> : children}
    </Button>
  );
};

Form.SubmitButton = FormSubmitButton;

const FormServerErrorMessage = function () {
  const {
    formState: { errors },
  } = useFormContext();
  const error = errors?.root?.submit;
  return <ErrorMessage id="">{error?.message?.toString() ?? ""}</ErrorMessage>;
};

Form.ServerErrorMessage = FormServerErrorMessage;

type OptionType = [string, string] | [boolean, string] | [number, number];
type SelectProps = {
  name: string;
  label?: React.ReactNode;
  hint?: string;
  required?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue?: (val: string) => void;
  errorMessage?: string;
  options: OptionType[];
} & HTMLProps<"select">;
type Ref = HTMLSelectElement;
type AllProps = React.ComponentPropsWithoutRef<"select"> & SelectProps;

const classes = {
  hint: "text-xs c-sand11 italic pt-0.3em pb-0.5em",
  wrapper: {
    base: `h-2.75em  rd-0.5em leading-1em overflow-hidden  whitespace-nowrap
     b-1 b-sand7 hover:b-sand8
     bg-base3
     grid grid-auto-flow-col
     focus-within:outline-transparent focus-within:b-accent9 focus-within:hover:b-accent9 `,
    disabled: "aria-[disabled]:cursor-not-allowed  aria-[disabled]:c-sand10",
  },
  selectElement: {
    base: ` px-0.75em py-0.375em bg-transparent focus:outline-transparent line-height-1`,
    disabled: "",
  },
  errorMessage: "",
};

const FormSelect = forwardRef<Ref, AllProps>(function (
  { placeholder, errorMessage, disabled, required, hint, label, options, name, ...selectProps },
  ref
) {
  const id = useId();

  const hintId = hint ? `${id}-hint` : "";
  const errorMessageId = errorMessage ? `${id}-error-message` : "";

  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  return (
    <div className="grid">
      <Label name={name} required={required}>
        {label}
      </Label>
      <Hint id={hintId} hint={hint} />
      <div className={`${classes.wrapper.base} ${disabled && classes.wrapper.disabled} `}>
        <select
          {...register(name)}
          className={`${classes.selectElement.base}   ${disabled && classes.selectElement.disabled}  `}
          {...selectProps}
          defaultValue=""
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="line-clamp-1" style={{ height: "var(--line-height)" }}>
        <ErrorMessage id={errorMessageId}>{errorMessage ?? error?.message?.toString() ?? ""}</ErrorMessage>
      </div>
    </div>
  );
});

FormSelect.displayName = "FormSelect";

function Hint({ hint, id }) {
  if (!hint) return <></>;
  return (
    <p className={classes.hint} id={id}>
      {hint}
    </p>
  );
}

Form.Select = FormSelect;
