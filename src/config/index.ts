import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  app_url: process.env.APP_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_token: process.env.JWT_ACCESS_SECRET!,
  jwt_refresh_token: process.env.JWT_REFRESH_SECRET!,
  jwt_access_token_aspiredIn: process.env.JWT_ACCESS_EXPIRES_IN!,
  jwt_refresh_token_aspiredIn: process.env.JWT_REFRESH_EXPIRES_IN!,
  stripe_product_id: process.env.STRIPE_PRODUCT_ID!,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY!,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET!
};
