import { useState } from "react";
import "./styles/global.css";
import { useForm } from "react-hook-form";

function App() {
  const [output, setOutput] = useState("");
  const { register, handleSubmit } = useForm();

  function createUser(data: any) {
    setOutput(JSON.stringify(data, null, 2));
    console.log(data);
  }

  return (
    <main className="h-screen bg-zinc-950 text-zinc-300 flex flex-col gap-10 items-center justify-center">
      <form action="" onSubmit={handleSubmit(createUser)} className="flex flex-col gap-4 w-full max-w-xs">
        <div className="flex flex-col gap-1">
          <label htmlFor="">Email</label>
          <input type="email" className="border border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white" {...register("email")} />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="">Password</label>
          <input type="password" className="border border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white" {...register("password")} />
        </div>

        <button type="submit" className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600">
          Salvar
        </button>
      </form>
      <pre>{output}</pre>
    </main>
  );
}

export default App;
