const classes = {
  labelText: "capitalize",
  requiredStar: "mis-1 c-red11",
};

type LabelProps = {
  preStyled?: boolean;
  children?: React.ReactNode;
  required?: boolean;
};

export default function Legend({ children, required, preStyled = false }: LabelProps) {
  if (!children) return <></>;
  return (
    <legend>
      <span className={`${preStyled ?  classes.labelText : ""}`}>{children}</span>
      {required && (
        <span aria-hidden={true} className={classes.requiredStar}>
          *
        </span>
      )}
    </legend>
  );
}
