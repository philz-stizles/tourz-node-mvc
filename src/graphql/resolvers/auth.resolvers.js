exports.authMutations = {
  signup: async (_parent, args, context) => {
    const { fullname, username, email, password } = args.credentials;
    const createdUser = await context.dataSources.users.create({
      fullname,
      username,
      email,
      password,
    });
    console.log(createdUser);
    return {
      code: '201',
      message: 'Signup successful',
      success: true,
      data: createdUser,
    };
  },
  login: async (_parent, args, context) => {
    const loggedInUser = await context.dataSources.users.login(
      args.credentials
    );
    return {
      code: '200',
      message: 'Login successful',
      success: true,
      data: loggedInUser,
    };
  },
};

exports.authQueries = {};
