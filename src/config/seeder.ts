import { tables } from "./table.ts";

export const seeder = {
  [tables.EMAIL_USERS]: [
    {
      id: 1,
      email: "mateuszmatecki25@gmail.com",
    },
  ],
  [tables.USERS]: [
    {
      name: "onhq",
      otp_user_id: null,
      email_user_id: 1,
      is_disabled: 0,
      expires_at: null,
      created_at: new Date().toISOString(),
    },
  ],
};
