import { PrismaClient, Role, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const db = new PrismaClient();

async function main() {
  const email = "admin@gmail.com";

  const existingAdmin = await db.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("Adm#iN12@30*", 10);

  const admin = await db.user.create({
    data: {
      fullName: "System Admin",
      email,
      phoneNumber: "0000000000",
      password: hashedPassword,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  let settingsData = [

    {
      key: "luckySpin",
      value: 0,
    },
    {
      key: "gen_1",
      value: 10,
    },
    {
      key: "gen_2",
      value: 7,
    },
    {
      key: "gen_3",
      value: 5,
    },
    {
      key: "job_par_refresh",
      value: 5,
    }
  ];

  const settings = await db.settings.createMany({
    data: settingsData
  })


}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });