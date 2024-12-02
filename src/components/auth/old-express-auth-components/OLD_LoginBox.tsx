import { Form, useFormHook } from "@/components/react-hook-form";
import { useState } from "react";
import { set, z } from "zod";
// import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Icon from "@/components/ui/Icon";
import fetchAPI from "@/utils/fetchAPI";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Button from '../ui/Button';
import { useGlobalContext } from '../Provider';

export default function LoginBox() {

  const schema = z.object({
    email: z.string({ required_error: "Email is required!" }).email({ message: "Please enter a valid email." }),
    password: z
      .string({ required_error: "Password is required!" })
      .min(1, { message: "Password must be at least 8 characters long." }),
  });

  const queryClient = useQueryClient();

  const {setShowAuthModal} = useGlobalContext();

  const onSubmit = async ({ email, password }: { email: string; password: string }) => {
    const data = await fetchAPI.POST("/auth/login/with-password", { email, password });
    if (data.error) throw new Error(data.error.message ?? 'Something went wrong');
    toast.success("You are Logged in.");
    queryClient.setQueryData(["userMe"], () => data.user);
    queryClient.invalidateQueries({ queryKey: ["userMe"], refetchType: "all" });
    queryClient.removeQueries(); // removes cached data for all queries
    await queryClient.resetQueries(); // reset all queyries to their initial state
    setShowAuthModal(false);
  };

  const form = useFormHook({ schema, onSubmit });
  const [isPassVisible, setIsPassVisible] = useState<boolean>(false);
  return (
    <Form form={form} className="" hasSubmitButton={false}>
      <Form.Input name="email" label={"Email"} required />
      <div className="h-3"></div>
      <Form.Input
        name="password"
        type={isPassVisible ? "text" : "password"}
        required
        label={"Password"}
        suffix={
          <Button variant="text" iconButton  type="button" onClick={() => setIsPassVisible((s) => !s)}>
            <span className="sr-only">Show Password</span>
            {!isPassVisible && <Icon name="bf-i-ph-eye" subdued={false} />}
            {isPassVisible && <Icon name="bf-i-ph-eye-closed" subdued={false} />}
          </Button>
        }
      />
      <div className="h-3"></div>
      <Form.ServerErrorMessage />
      <div className="h-3"></div>
      <Form.SubmitButton variant='solid' className="w-full">Login</Form.SubmitButton>
    </Form>
  );
}
