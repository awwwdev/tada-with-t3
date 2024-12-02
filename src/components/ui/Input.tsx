import { HTMLProps } from "@/types";
import { CSSProperties, forwardRef, useId } from "react";
import Label from "./Label";
import { getSizeStyles, Size, ui } from "./ui-config";

type InputProps = {
  name?: string;
  label?: React.ReactNode;
  hint?: string;
  required?: boolean;
  prefixx?: React.ReactNode;
  suffix?: React.ReactNode;
  outerPrefix?: React.ReactNode;
  outerSuffix?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue?: (val: string) => void;
  errorMessage?: string;
  uiSize?: Size;
} & HTMLProps<"input">;
type Ref = HTMLInputElement;
type AllProps = React.ComponentPropsWithoutRef<"input"> & InputProps;

const Input = forwardRef<Ref, AllProps>(function (
  {
    hint,
    label,
    name,
    className,
    required,
    prefixx,
    suffix,
    outerSuffix,
    outerPrefix,
    disabled,
    onChange,
    setValue,
    errorMessage,
    uiSize = "md",
    ...props
  },
  ref
) {
  const classes = {
    hint: "text-xs c-base11 italic pt-0.3em pb-0.5em",
    wrapper: {
      base: `${ui.h[uiSize]} ${ui.rd[uiSize]} leading-1em overflow-hidden  whitespace-nowrap
       b-1 b-base7 hover:b-base8
       bg-base3 px-2
       grid grid-auto-flow-col items-center
       focus-within:outline-transparent focus-within:b-accent9 focus-within:hover:b-accent9 `,
      disabled: "aria-[disabled]:cursor-not-allowed  aria-[disabled]:c-base10",
    },
    prefixBox: "",
    inputElement: {
      base: ` ${ui.pd.x.xs} ${ui.h[uiSize]} bg-transparent focus:outline-none focus:outline-transpanrent line-height-1 `,
      disabled: "",
    },
    suffixBox: "",
    errorMessage: "",
  };

  const id = useId();

  const hintId = hint ? `${id}-hint` : "";
  const errorMessageId = errorMessage ? `${id}-error-message` : "";

  return (
    <div className="grid ">
      <Label name={name} required={required}>
        {label}
      </Label>
      <Hint id={hintId} hint={hint} />
      <div
        className={`${classes.wrapper.base} ${disabled && classes.wrapper.disabled} `}
        style={
          {
            gridTemplateColumns: `${outerPrefix ? "auto" : ""} ${prefixx ? "auto" : ""} 1fr ${suffix ? "auto" : ""} ${
              outerSuffix ? "auto" : ""
            }`,
            ...getSizeStyles(uiSize),
            padding: undefined,
            "--padding": getSizeStyles(uiSize).padding,
          } as CSSProperties
        }
      >
        <OuterPrefixBox outerPrefix={prefixx} />
        <PrefixBox prefix={prefixx}  />
        <input
          ref={ref}
          name={name}
          id={id}
          className={` ${classes.inputElement.base}  ${disabled && classes.inputElement.disabled} `}
          aria-describedby={`${errorMessageId} ${hintId}`}
          aria-invalid={!!errorMessage}
          onChange={(e) => {
            setValue?.(e.target.value);
            onChange?.(e);
          }}
          style={{
            padding: getSizeStyles(uiSize).padding,
          }}
          {...props}
        />
        <SuffixBox suffix={suffix}  />
        <OuterSuffixBox outerSuffix={outerSuffix} />
      </div>
      {/* <div className="line-clamp-1" style={{height: 'var(--line-height)'}}>
        <ErrorMessage id={errorMessageId} >{errorMessage}</ErrorMessage>
      </div> */}
    </div>
  );
});

Input.displayName = "Input";
export default Input;

function Hint({ hint, id }) {
  if (!hint) return <></>;
  return (
    <p className={classes.hint} id={id}>
      {hint}
    </p>
  );
}

function PrefixBox({ prefix }: { prefix?: React.ReactNode;}) {
  if (!prefix) return <></>;
  return (
    <div
      className={`h-full flex items-center `}
      style={{
        paddingInline: "var(--padding)",
      }}
    >
      {prefix}
    </div>
  );
}

function SuffixBox({ suffix }: { suffix?: React.ReactNode;  }) {
  if (!suffix) return <></>;
  return (
    <div
      className={`h-full flex items-center`}
      style={{
        paddingInline: "var(--padding)",
      }}
    >
      {suffix}
    </div>
  );
}

function OuterPrefixBox({ outerPrefix }: { outerPrefix?: React.ReactNode; }) {
  if (!outerPrefix) return <></>;
  return (
    <div
      className={`bg-base6 h-full flex items-center`}
      style={{
        paddingInline: "var(--padding)",
      }}
    >
      {outerPrefix}
    </div>
  );
}

function OuterSuffixBox({ outerSuffix }: { outerSuffix?: React.ReactNode;  }) {
  if (!outerSuffix) return <></>;
  return (
    <div
      className={`bg-base6 h-full  flex items-center`}
      style={{
        paddingInline: "var(--padding)",
      }}
    >
      {outerSuffix}
    </div>
  );
}
