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
    if (!user) throw new TRPCError({ code: "UNAUTHORIZED", message: "Please sign in to access." });
    const ability = defineAbilitiesFor(user);
    let hasAccess;
    hasAccess = await callback(option, ability);
    if (!hasAccess) throw new TRPCError({ code: "UNAUTHORIZED", message: "You don't have access to this." });
    return opt.next();
  };
};
