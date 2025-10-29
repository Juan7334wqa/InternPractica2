import express from 'express';
import axios from 'axios';
import cors from 'cors';
 
 
 
type LD = {
id: number
filmName: string 
rotationType: "CAV" | "CLV",
region: string,
lengthMinutes: number,
videoFormat: "NTSC" | "PAL"
}

let LDs:LD[]=[
   { id: 1, filmName: "Lakers", rotationType: "CAV", region: "",lengthMinutes: 12, videoFormat:"NTSC"},

 { id: 2, filmName: "Celtics", rotationType: "CLV", region: "",lengthMinutes: 24, videoFormat:"PAL" },

]
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

  // Si todo está bien, no hay errores
  return null;
};




const app = express();

const port = 3000;





app.use(cors()); // se usa cuando no estas usadon el sever o 2 maquinas
app.use(express.json()); // le estas diciendo que estas aciendo en Api no en paginas web o otras cosas


app.get("/Id",(req, res)=>{
  res.json(LDs);

});
app.get("/Id/:id",(req, res)=>{// id = string
  const id = Number(req.params.id);// para sacar id que ha introducido
const eqpenc = LDs.find((elem)=>{
  if(elem.id===id){
    res.status(201).json({message:"LD encontrado"})
    res.json(elem);
  }
  else{
    res.status(404).json({message:"LD no existe"})
  }
})

});

app.post("/Id", (req, res) => {
  try {
    const error = validateLD(req.body);
    if (error) return res.status(400).json({ error });

    const newUser: LD = {
      id: Date.now().toString(),
      ...req.body,
    };

    LDs.push(newUser);
    res.status(201).json(newUser);
  } catch (err: any) {
    res
      .status(500)
      .json({ error: "Error al crear la persona", detail: err.message });
  }
});

app.put("/Id/:id", (req, res) => {
  try {
    const  id  = Number(req.params);
    const index = LDs.findIndex((p) => p.id === id);

    if (index === -1)
      return res.status(404).json({ error: "Persona no encontrada" });

    const error = validateLD(req.body);
    if (error) return res.status(400).json({ error });

    LDs[index] = { ...LDs[index], ...req.body };
  
    res.json({
      message: "Persona actualizada correctamente",
      LD: LDs[index],
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ error: "Error al actualizar la persona", detail: err.message });
  }
});

app.delete("/Id/:id", (req, res) => {
  try {
    const  id  = Number(req.params);
    const exists = LDs.some((p) => p.id === id);

    if (!exists)
      return res.status(404).json({ error: "LD no encontrada" });

    LDs = LDs.filter((p) => p.id !== id);

    res.json({ message: "LD eliminada correctamente" });
  } catch (err: any) {
    res
      .status(500)
      .json({ error: "Error al eliminar LD", detail: err.message });
  }
});


app.listen(port,()=>{
  console.log("Servidor en http://localhost:"+port )
})












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

