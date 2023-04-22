const express = require("express");
const app = express();
const cors = require('cors')

app.use(express.json());
app.use(cors());

const db = require('./models');

//Routers
const CadernoEleitoralRouter = require('./routes/CadernoEleitoral');
app.use("/caderno_eleitoral", CadernoEleitoralRouter);

const CartoesRouter = require('./routes/Cartoes');
app.use("/cartoes", CartoesRouter);

const ClubesRouter = require('./routes/Clubes');
app.use("/clubes", ClubesRouter);

const EquipaJogadoresRouter = require('./routes/EquipaJogadores');
app.use("/equipa_jogadores", EquipaJogadoresRouter);

const EquipaRouter = require('./routes/Equipas');
app.use("/equipa", EquipaRouter);

const EscalaoRouter = require('./routes/Escalao');
app.use("/escalao", EscalaoRouter);

const GolosRouter = require('./routes/Golos');
app.use("/golos", GolosRouter);

const JogadoresRouter = require('./routes/Jogadores');
app.use("/jogadores", JogadoresRouter);

const JogoRouter = require('./routes/Jogo');
app.use("/jogo", JogoRouter);

const TorneioRouter = require('./routes/Torneio');
app.use("/torneio", TorneioRouter);

const UsersRouter = require('./routes/Users');
app.use("/users", UsersRouter);

const UsersTypeRouter = require('./routes/UsersType');
app.use("/users_type", UsersTypeRouter);

const EquipaTecnicaRouter = require('./routes/EquipaTecnica');
app.use("/equipa_tecnica", EquipaTecnicaRouter);

const JogoTypeRouter = require('./routes/JogoType');
app.use("/jogo_type", JogoTypeRouter);

const TecnicosTypeRouter = require('./routes/TecnicosType');
app.use("/tecnicos_type", TecnicosTypeRouter);

const TecnicosRouter = require('./routes/Tecnicos');
app.use("/tecnicos", TecnicosRouter);


db.sequelize.sync().then(()=> {
    app.listen(3001, () =>{
        console.log("Server running on port 3001");
    });
});