import axios from 'axios';
import express from "express";
import cors from "cors";


type LD = {
  id: number;
  filmName: string;
  rotationType: "CAV" | "CLV";
  region: string;
  lengthMinutes: number;
  videoFormat: "NTSC" | "PAL";
};


let LDs: LD[] = [
  { id: 1, filmName: "Lakers", rotationType: "CAV", region: "USA", lengthMinutes: 12, videoFormat: "NTSC" },
  { id: 2, filmName: "Celtics", rotationType: "CLV", region: "EU", lengthMinutes: 24, videoFormat: "PAL" },
];

const validateLD = (data: any): string | null => {
  if (!data) return "No se ha proporcionado ningún cuerpo de solicitud.";
  const { filmName, rotationType, region, lengthMinutes, videoFormat } = data;

  if (typeof filmName !== "string" || filmName.trim().length < 2)
    return "El nombre debe ser una cadena con al menos 2 caracteres.";
  if (typeof rotationType !== "string" || (rotationType !== "CLV" && rotationType !== "CAV"))
    return "El rotationType debe ser CLV o CAV.";
  if (typeof region !== "string" || region.trim().length < 2)
    return "El region debe ser una cadena con al menos 2 caracteres.";
  if (typeof lengthMinutes !== "number")
    return "El lengthMinutes debe ser un número.";
  if (typeof videoFormat !== "string" || (videoFormat !== "NTSC" && videoFormat !== "PAL"))
    return "El videoFormat debe ser NTSC o PAL.";

  return null;
};


const app = express();
app.use(cors());
app.use(express.json());


app.get("/ld", (req, res) => res.json(LDs));


app.get("/ld/:id", (req, res) => {
  const id = Number(req.params.id);
  const ld = LDs.find((e) => e.id === id);
  if (!ld) return res.status(404).json({ message: "LD no existe" });
  res.json(ld);
});


app.post("/ld", (req, res) => {
  const error = validateLD(req.body);
  if (error) return res.status(400).json({ error });

  const newLD: LD = { id: Date.now(), ...req.body };
  LDs.push(newLD);
  res.status(201).json(newLD);
});


app.put("/ld/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = LDs.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ error: "LD no encontrada" });

  const error = validateLD(req.body);
  if (error) return res.status(400).json({ error });

  LDs[index] = { ...LDs[index], ...req.body };
  res.json({ message: "LD actualizada correctamente", LD: LDs[index] });
});


app.delete("/ld/:id", (req, res) => {
  const id = Number(req.params.id);
  LDs = LDs.filter((p) => p.id !== id);
  res.json({ message: "LD eliminada correctamente" });
});


app.listen(3000, () => console.log("Servidor en http://localhost:3000"));










  //1. obtener todos los lds

  const getLd = async (id?: number) => {
    try {
      const url = id
        ? `http://localhost:3000/ld/${id}`
        : "http://localhost:3000/ld";
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("Axios error: " + err.message);
      } else {
        console.log("Error: " + err);
      }
    }
  };

// 2. muestra la lista inicial por consola
  console.log(await getLd())


// 3. crear nuevo disco
  const postLd= async (filmName: string,rotationType:string,region:string,lenghtMinutes:number,videoFormat:string) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/ld`, {"filmName":filmName,"rotationType":rotationType,"region": region,"lenghtMinutes":lenghtMinutes,"videoFormat":videoFormat}
      );
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("Axios error: " + err.message);
      } else {
        console.log("Error: " + err);
      }
    }
  };

  console.log(await postLd("name3","CAV","JAP",200,"PAL"))


  // 4. volver a imprimir todos los lds
  // 5. comprueba que aparece el nuevo equipo
  console.log(await getLd())



  // 6. eliminar ld
  const deleteLd = async (id: number) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/ld/${id}`
      );
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("Axios error: " + err.message);
      } else {
        console.log("Error: " + err);
      }
    }
  };

  console.log(await deleteLd(2))

// 6-7 Cambiar o renovar dato

const putLd = async (id: number)=>{
  try {
      const res = await axios.put(
        `http://localhost:3000/ld/${id}`
      );
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("Axios error: " + err.message);
      } else {
        console.log("Error: " + err);
      }
    }

}

// 7. mostrar lista final
  console.log(await getLd())

