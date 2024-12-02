import { folderRouter, postRouter } from "~/server/api/routers/folder.route";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { taskRouter } from "./routers/task.route";
import { listRouter } from "./routers/list.route";
import { userRouter } from "./routers/user.route";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  // post: postRouter,
  task: taskRouter,
  list: listRouter,
  folder: folderRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
