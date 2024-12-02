import { Form, useFormHook } from "@/components/react-hook-form";
import Icon from "@/components/ui/Icon";
import fetchAPI from "@/utils/fetchAPI";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import Button from "../ui/Button";
import { useGlobalContext } from "../Provider";

const schema = z.object({
  email: z
    .string()
    .min(1, "Please enter user's Email")
    .min(5, "Email must be 5 characters or longer")
    .email({ message: "Please enter a valid email." }),
  password: z.string().min(2, "Password must be 8 characters or longer"),
  // use code below for validation
  // password: z
  //   .string()
  //   .min(8, "min")
  //   .max(64, "max")
  //   .regex(/[A-Z]/, "uppercase")
  //   .regex(/[a-z]/, "lowercase")
  //   .regex(/\d/, "digit")
  //   .regex(/[ `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/, "special"), // not sure if this works correctly
  confirmPassword: z.string().min(1, "Please fill in the confirm password"),
});

export default function SignUpBox() {
  // const queryClient = useQueryClient();

  const queryClient = useQueryClient();
  const { setShowAuthModal } = useGlobalContext();

  const onSubmit = async ({
    email,
    password,
    confirmPassword,
  }: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (password !== confirmPassword) {
      console.log("Passwords must match. Try again.");
      // error message should be farsi if locale is fa.
      throw new Error("Passwords must match. Try again.");
    }
    const data = await fetchAPI.POST("/auth/signup", { email, password });
    if (data.error) throw new Error("Something went wrong");
    toast.success("You are successfully signed up.");
    // queryClient.setQueryData(['userMe'], () => data.user);
    queryClient.invalidateQueries({ queryKey: ["userMe"], refetchType: "all" });
    queryClient.setQueryData(["userMe"], () => data.user);
    setShowAuthModal(false);
  };

  const form = useFormHook({ schema, onSubmit });
  const [isPassVisible, setIsPassVisible] = useState<boolean>(false);

  if (form.formState.isSubmitSuccessful) {
    return <p>You signed up successfully. Please check your email and confirm it.</p>;
  }
  return (
    <div className="space-y-2 ">
      <div className="">
        <Form form={form} onSubmit={onSubmit} className="" submitText="Sign Up" hasSubmitButton={false}>
          <Form.Input name="email" required label={"Email"} />
          <Form.Input
            name="password"
            type={isPassVisible ? "text" : "password"}
            required
            label={"Password"}
            outerSuffix={
              <Button iconButton variant="text" type="button" onClick={() => setIsPassVisible((s) => !s)}>
                <span className="sr-only">Show Password</span>
                {!isPassVisible && <Icon name="bf-i-ph-eye" subdued={false} />}
                {isPassVisible && <Icon name="bf-i-ph-eye-closed" subdued={false} />}
              </Button>
            }
          />
          <Form.Input
            name="confirmPassword"
            type={isPassVisible ? "text" : "password"}
            required
            label={"Confirm Password"}
            outterSuffix={
              <Button iconButton variant="text" type="button" onClick={() => setIsPassVisible((s) => !s)}>
                <span className="sr-only">Show Password</span>
                {!isPassVisible && <Icon name="bf-i-ph-eye" subdued={false} />}
                {isPassVisible && <Icon name="bf-i-ph-eye-closed" subdued={false} />}
              </Button>
            }
          />
          <div className="h-6"></div>
          <Form.ServerErrorMessage />
          <Form.SubmitButton variant="solid" className="w-full">
            {"Submit"}
          </Form.SubmitButton>
        </Form>
      </div>
    </div>
  );
}
