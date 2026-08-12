import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

const port =config.port

async function main() {
  try {
    // await prisma.$connect();
    // console.log("connected prisma orm");

    app.listen(port, () => {
      console.log(`server is running on ${port}`);
    });
  } catch (error) {
    console.log("server error ", error);
    process.exit(1);
  }
}
main();
