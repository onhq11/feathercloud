import { disableExpiredUsers } from "@/cron/disableExpiredUsers";
import cron from "node-cron";

cron.schedule("0 * * * *", disableExpiredUsers);
