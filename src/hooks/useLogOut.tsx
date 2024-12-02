import fetchAPI from '@/utils/fetchAPI';
import { createClientForBrowser } from "@/utils/supabase/client";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default () => {
  const queryClient = useQueryClient();
  const supabase = createClientForBrowser();
  return  useMutation({
    mutationFn: async () => {
      // const data = await fetchAPI.POST(`/auth/logout`);
      const { error } = await supabase.auth.signOut();
      if ( error ) throw new Error(error.message);
      // queryClient.invalidateQueries({ queryKey: ["userMe"] });
    },
    onError: (err) => {
      toast.error("Error: " + err.message);
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(["userMe"], null);
      queryClient.removeQueries(); // removes cached data for all queries
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["userMe"] });
      await queryClient.resetQueries(); // reset all queyries to their initial state
    },
  });

}