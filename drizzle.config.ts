// Create Tables in Supabase
import { config } from "dotenv";

config({path:'./.env'});
export default ({
    schema:'./drizzle/schema.ts',
    out:'./drizzle/migrations',
    dialect:'postgresql',
    dbCredentials:{
        url:process.env.DATABASE_URL_POSTGRES!,
    }
})