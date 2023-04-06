import { useState } from "react";
import "./styles/global.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createUserFormSchema = z.object({
  email: z.string().email("Formato de e-mail inválido").nonempty("Email é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type createUserFormData = z.infer<typeof createUserFormSchema>;

function App() {
  const [output, setOutput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });

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
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="">Password</label>
          <input type="password" className="border border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white" {...register("password")} />
          {errors.password && <span>{errors.password.message}</span>}
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
