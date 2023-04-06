import { useState } from "react";
import "./styles/global.css";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createUserFormSchema = z.object({
  name: z
    .string()
    .nonempty("Nome é obrigatório")
    .transform((name) =>
      name
        .trim()
        .split(" ")
        .map((word) => word[0].toLocaleUpperCase().concat(word.substring(1)))
        .join(" ")
    ),
  email: z
    .string()
    .email("Formato de e-mail inválido")
    .nonempty("Email é obrigatório")
    .toLowerCase()
    .refine((email) => email.endsWith("@test.com"), "O email precisa terminar em @test.com"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  languages: z
    .array(z.object({ title: z.string().nonempty("Título é obrigatório"), proficiency: z.coerce.number().min(0).max(5) }))
    .min(2, "Insira pelo menos 2 linguagens"),
});

type createUserFormData = z.infer<typeof createUserFormSchema>;

function App() {
  const [output, setOutput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<createUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "languages",
  });

  function addNewTech() {
    append({ title: "", proficiency: 1 });
  }

  function createUser(data: any) {
    setOutput(JSON.stringify(data, null, 2));
    console.log(data);
  }

  return (
    <main className="h-screen bg-zinc-950 text-zinc-300 flex flex-col gap-10 items-center justify-center">
      <form action="" onSubmit={handleSubmit(createUser)} className="flex flex-col gap-4 w-full max-w-xs">
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Name</label>
          <input type="name" className="border border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white" {...register("name")} />
          {errors.name && <span className="text-red-400 text-xs">{errors.name.message}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input type="email" className="border border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white" {...register("email")} />
          {errors.email && <span className="text-red-400 text-xs">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <input type="password" className="border border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white" {...register("password")} />
          {errors.password && <span className="text-red-400 text-xs">{errors.password.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="languages" className="flex items-center justify-between">
            Languages
            <button type="button" onClick={addNewTech} className="text-emerald-500 text-sm">
              Adicionar
            </button>
          </label>

          {fields.map((field, index) => {
            return (
              <div key={field.id} className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <label htmlFor="language">Language</label>
                  <label htmlFor="proficiency">Proficiency</label>
                </div>
                <div className="flex justify-between gap-4">
                  <input
                    type="text"
                    className="flex-1 border border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white"
                    {...register(`languages.${index}.title`)}
                  />

                  <input
                    type="number"
                    className="w-16 border border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white"
                    {...register(`languages.${index}.proficiency`)}
                  />
                </div>
                <div className="flex justify-between ">
                  {errors.languages?.[index]?.title && <span className="text-red-400 text-xs">{errors.languages?.[index]?.title?.message}</span>}
                  {errors.languages?.[index]?.proficiency && (
                    <span className="text-red-400 text-xs">{errors.languages?.[index]?.proficiency?.message}</span>
                  )}
                </div>
              </div>
            );
          })}
          {errors.languages && <span className="text-red-400 text-xs">{errors.languages.message}</span>}
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
