const { Router } = require("express");
const router = Router();
const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Grupo = require("../models/Grupo");

const { KEY } = process.env;
router.get("/", (req, res) => res.send("HOLA MUNDO"));

const errors = [];

const { verifytoken } = require("../helpers/auth");

router.post("/signup", async (req, res) => {
  const { usunom, email, password, tipo, confirm_password } = req.body;
  if (password != confirm_password) {
    errors.push({ text: "pass" });
    return res.status(401).send("Contraseñas no coinciden");
  }
  if (password.length < 6) {
    errors.push({ text: "poco" });
    return res.status(401).send("Contraseñas deben ser mayor a 6 caracteres");
  }
  if (errors.length > 0) {
  } else {
    const emailuser = await Usuario.findOne({ email: email });
    if (emailuser) {
      return res.status(401).send("El correo ya existe");
    } else {
      const newUsuario = new Usuario({ usunom, email, password, tipo });
      newUsuario.password = await newUsuario.encryptPassword(password);
      await newUsuario.save();
      const token = jwt.sign({ _id: newUsuario._id }, `${KEY}`);
      return res.status(200).json({ token });
    }
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    return res.status(401).send("El correo no existe");
  } else {
    const match = await usuario.matchPassword(password);
    if (match) {
      const token = jwt.sign({ _id: usuario._id }, `${KEY}`);
      return res.status(200).json({ token });
    } else {
      return res.status(401).send("Contraseña Incorrecta");
    }
  }
});

router.get("/menu", verifytoken, async (req, res) => {
  const _id = req.userId;
  const usuario = await Usuario.findOne({ _id });
  res.json(usuario);
});

router.get("/menu/allgrupos", verifytoken, async (req, res) => {
  const grupo = await Grupo.find({tipo:"Jefe"},'nombre');
  res.json(grupo);
});

router.get("/menu/obtgrupos", verifytoken, async (req, res) => {
  const _id = req.userId;
  const usuario = await Usuario.findOne({ _id });
  const nombre = usuario.email;
  const grupo = await Grupo.find({usuario:nombre},'nombre');
  res.json(grupo);
});

router.get("/principal", (req, res) => {
  res.json([
    {
      _id: 2,
      name: "david",
    },
  ]);
});

router.post("/menu/crear", verifytoken, async (req, res) => {
  const _id = req.userId;
  const usuarios = await Usuario.findOne({ _id });
  const tipo = usuarios.tipo;
  const usuario = usuarios.email;
  const { nombre } = req.body;
  const newGrupo = new Grupo({ usuario, nombre, tipo });
  const nombres = await Grupo.findOne({ nombre });
  if (tipo === "Jefe") {
    if (nombres) {
      return res.status(401).send("Ya hay un grupo con este nombre");
    } else {
      await newGrupo.save();
      return res.status(200).send("Grupo Creado Correctamente");
    }
  } else {
    return res
      .status(401)
      .send("Su tipo de usuario no le permite crear un grupo");
  }
});

router.post("/menu/agregar", verifytoken, async (req, res) => {
  const _id = req.userId;
  const usuarios = await Usuario.findOne({ _id });
  const tipo = usuarios.tipo;
  const usuario = usuarios.email;
  const { nombre } = req.body;
  const newGrupo = new Grupo({ usuario, nombre, tipo });
  const gruponombre = await Grupo.findOne({ nombre });
  const grupousuario = await Grupo.findOne({ nombre,usuario });
  if (tipo === "Empleado") {
    if (gruponombre) {
      if(grupousuario){
        return res.status(401).send("Usted ya esta en este Grupo");
      }else{
        await newGrupo.save();
        return res.status(200).send("Se Ha Unido Correctamente");
      }     
    } else {
      return res.status(401).send("No hay un Grupo con ese Nombre");
    }
  } else {
    return res
      .status(401)
      .send("Su tipo de usuario no le permite unirse a un grupo");
  }
});

/*function verifytoken (req,res,next){
    if(!req.headers.authorization){
        return res.status(401).send('No estas autorizado');
    }
    const token = req.headers.authorization.split(' ')[1]
    if (token==='null'){
        return res.status(401).send('No estas autorizado');
    }

    const payload = jwt.verify(token, `${KEY}`)
     req.userId = payload._id;
     next();
}*/
module.exports = router;
