import { protectedProcedure } from "~/server/api/trpc";
import { AbilityTuple, MongoAbility, MongoQuery } from "@casl/ability";
import { TRPCError } from "@trpc/server";
import { defineAbilitiesFor } from "./user.access";

type MiddlewareFunction = Parameters<typeof protectedProcedure.use>[0];
type Option = Parameters<MiddlewareFunction>[0];

type Ability = MongoAbility<AbilityTuple, MongoQuery>;

export const accessControl = <T>(
  callback: (_option: T, ability: Ability) => Promise<boolean>,
) => {
  return async (option: T) => {
    const opt = option as Option;
    const user = opt.ctx.session?.user;
    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });
    const ability = defineAbilitiesFor(user);
    let hasAccess;
    try {
      hasAccess = await callback(option, ability);
    } catch (error) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    if (!hasAccess) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return opt.next();
  };
};
