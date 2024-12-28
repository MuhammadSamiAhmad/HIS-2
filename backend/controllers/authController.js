const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const { use } = require("../routes/login");
// const { sign } = require("jsonwebtoken");

const prisma = new PrismaClient();

const handleLogin = async (req, res) => {
  // const { data, person } = req.body;
  // console
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  // Ckeck if user with that userName exists
  const foundUser = await prisma.profileLogin.findFirst({
    where: { username: username },
  });
  if (!foundUser) return res.status(401).json({ error: "User doesn't exist" }); //Unauthorized
  console.log("Plaintext Password:", password);
  console.log("Plaintext username:", username);
  console.log("Hashed Password from DB:", foundUser.password);

  // evaluate password
  const match = await bcrypt
    .compare(password, foundUser.password)
    .then((match) => {
      if (!match) res.status(401).json({ error: "Incorrect Password" });
    });

  //check userType
  // if (foundUser.userType != person) return res.status(401).json({ error: "Unauthorized" });
  let user;
  // let accessToken;
  if (foundUser.userType === "patient") {
    user = await prisma.patient.findFirst({
      where: { patientID: foundUser.patientId },
    });
    // accessToken = sign(
    //   { username: userName, id: user.patientID },
    //   process.env.ACCESS_TOKEN_SECRET,
    //   { expiresIn: "1d" }
    // );
    // refreshToken = sign(
    //   { username: userName, id: user.patientID },
    //   process.env.REFRESH_TOKEN_SECRET,
    //   { expiresIn: "1d" }
    // );
  } else if (foundUser.userType === "doctor") {
    user = await prisma.dentist.findFirst({
      where: { dentistSSN: foundUser.dentistSsn },
    });
    // accessToken = sign(
    //   { username: userName, id: user.DentistSSN },
    //   process.env.ACCESS_TOKEN_SECRET,
    //   { expiresIn: "1d" }
    // );
    // refreshToken = sign(
    //   { username: userName, id: user.DentistSSN },
    //   process.env.REFRESH_TOKEN_SECRET,
    //   { expiresIn: "1d" }
    // );
  } else {
    user = await prisma.employee.findFirst({
      where: { EmployeeSSN: foundUser.employeeSsn },
    });
    // accessToken = sign(
    //   { username: userName, id: user.EmployeeSSN },
    //   process.env.ACCESS_TOKEN_SECRET,
    //   { expiresIn: "1d" }
    // );
    // refreshToken = sign(
    //   { username: userName, id: user.EmployeeSSN },
    //   process.env.REFRESH_TOKEN_SECRET,
    //   { expiresIn: "1d" }
    // );
  }
  console.log(user);
  res.status(200).json({user, role: foundUser.userType});
  //------------------------should be a field in the database for each user------------------------------------
  // user.refreshToken = refreshToken
  // res.json(accessToken);

  // const accessToken = jwt.sign({username: foundUser.username, id: person=="patient"? foundUser.patientId:person=="doctor"? foundUser.dentistSsn:foundUser.employeeSsn}, "importantSecret")
  // res.json(accessToken)
  // if (match) {
  //     const roles = Object.values(foundUser.roles).filter(Boolean)
  //     // create JWTs
  //     const accessToken = jwt.sign(
  //         {
  //             "UserInfo": {
  //                 "username": foundUser.username,
  //                 "roles": roles
  //             }
  //         },
  //         process.env.ACCESS_TOKEN_SECRET,
  //         { expiresIn: '10s' }
  //     );
  //     const refreshToken = jwt.sign(
  //         { "username": foundUser.username },
  //         process.env.REFRESH_TOKEN_SECRET,
  //         { expiresIn: '1d' }
  //     );
  //     // Saving refreshToken with current user
  //     foundUser.refreshToken = refreshToken
  //     const result = await foundUser.save()
  //     console.log(result)
  //     console.log(roles)

  //     // Creates Secure Cookie with refresh token
  //     res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })

  //     // Send authorization roles and access token to user
  //     res.json({ roles, accessToken })

  // } else {
  //     res.sendStatus(401)
  // }
};

module.exports = { handleLogin };
