const accountModel = require('./account-model');

async function test() {
  try {
    const user = await accountModel.getAccountByEmail("pulidoesr@gmail.com");
    console.log("User found:", user);
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
