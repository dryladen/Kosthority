import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { apartmentRouter } from "./routers/apartmentRouter";
import { authRouter } from "./routers/authRouter";
import { roomRouter } from "./routers/roomRouter";
import { tenantRouter } from "./routers/tenantRouter";
import { rentalRouter } from "./routers/rentalRouter";
import { paymentRouter } from "./routers/paymentRouter";
import { reportRouter } from "./routers/reportRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  apartment: apartmentRouter,
  room: roomRouter,
  tenant: tenantRouter,
  rental: rentalRouter,
  payment: paymentRouter,
  report: reportRouter,
  auth: authRouter,
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
