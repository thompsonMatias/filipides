const
  { User } = require('app/models'),
  bcrypt = require('bcryptjs'),
  jwt = require('jsonwebtoken');

// TODO: Pasar al sensitive.conf
const SECRET_KEY = 'secret!';

const cookieSignIn = async (req, res) => {
  const accessToken = req.cookies['jwt'] || '';

  let payload;
  try {
    payload = jwt.verify(accessToken, SECRET_KEY);
  } catch (err) {
    res.status(500).send({
      success: false,
      message: `No tiene las Cookies necesarias.`,
    });
  }

  let email = payload.data.email;

  await User.findOne({email})
    .then(async user => {
      if (!user) {
        res.status(404).send({
          success: false,
          message: `No se puede encontrar el usuario: ${email}`,
        });
        return
      }

      const payload2 = {
        role: user.admin ? "admin" : "user",
        data: {
          name: user.name,
          email: user.email,
        }
      };

      res.send({
        success: true,
        message: `Bienvenido '${user._id}'`,
        user: payload2,
      })
    })
    .catch(err => {
      res.status(500).send({
        success: false,
        message: JSON.stringify(err, null, 2),
      });
    });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  await User.findOne({email})
    .then(async user => {
      if (!user) {
        res.status(401).send({
          success: false,
          message: 'El usuario y/o la contraseña son incorrectos',
        });
        return
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        res.status(401).send({
          success: false,
          message: 'Credenciales incorrectas',
        });
        return
      }

      const payload = {
        role: user.admin ? "admin" : "user",
        data: {
          name: user.name,
          email: user.email,
        }
      };

      const token = jwt.sign(payload, SECRET_KEY);

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: false, //on HTTPS
        domain: process.env.DOMAIN_FRONT.split(":")[0],
        path: "/",
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });

      res.send({
        success: true,
        message: `Bienvenido '${user._id}'`,
        user: payload,
      })
    })
    .catch(err => {
      res.status(500).send({
        success: false,
        message: JSON.stringify(err, null, 2),
      });
    });

};

const signOut = (req, res) => {
  res.clearCookie('jwt');

  res.send({
    success: true,
    message: `Hasta la proxima`,
  });
};

const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  console.log("hash", hash);

  await User.insertMany({_id: email, name, email, admin: false, password: hash})
    .then(user =>
      res.status(200).send({
        success: true,
        message: `Ya sos parte de la comunidad '${user[0]._id}'`,
      })
    )
    .catch(err =>
      res.status(500).send({
        success: false,
        message: `Error al crear el usuario`,
      })
    );
};

const deleteAccount = async (req, res) => {
  const { email } = req.body;

  await User.deleteOne({email})
    .then(user => {
      res.clearCookie('jwt');

      res.status(200).send({
        success: true,
        message: `Esperamos que vuelvas '${email}'`,
      });
    })
    .catch(err =>
      res.status(500).send({
        success: false,
        message: `Error al borrar el usuario`,
      })
    );
};


module.exports = {
  cookieSignIn,
  signIn,
  signOut,
  signUp,
  deleteAccount,
};
