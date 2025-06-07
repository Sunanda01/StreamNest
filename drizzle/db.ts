import { drizzle } from "drizzle-orm/xata-http";
import { getXataClient } from "@/xata"; // Generated client

const xata = getXataClient();
export const db = drizzle(xata);
