import "./styles/global.css";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { supabase } from "./lib/supabase";

const createUserFormSchema = z.object({
  avatar: z
    .instanceof(FileList)
    .transform((list) => list.item(0))
    .refine((file) => file!.size <= 5 * 1024 * 1024, "file must be smaller than 5Mb"),
  name: z
    .string()
    .nonempty("name is required")
    .transform((name) =>
      name
        .trim()
        .split(" ")
        .map((word) => word[0].toLocaleUpperCase().concat(word.substring(1)))
        .join(" ")
    ),
  email: z
    .string()
    .email("invalid email format")
    .nonempty("email is required")
    .toLowerCase()
    .refine((email) => email.endsWith("@test.com"), "email must end with '@test.com'"),
  password: z.string().min(6, "password must have at least 6 characters"),
  languages: z
    .array(z.object({ title: z.string().nonempty("language name is required"), proficiency: z.coerce.number().min(0).max(5) }))
    .min(2, "input at least 2 languages"),
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

  async function createUser(data: createUserFormData) {
    // await supabase.storage.from("storage-bucket-from-supabase").upload(data.avatar?.name, data.avatar);

    setOutput(JSON.stringify(data, null, 2));

    console.log(data);
  }

  return (
    <main className="h-screen bg-zinc-950 text-zinc-300 flex flex-col gap-10 items-center justify-center">
      <form action="" onSubmit={handleSubmit(createUser)} className="flex flex-col gap-4 w-full max-w-xs">
        <div className="flex flex-col gap-1">
          <label htmlFor="avatar">Avatar</label>
          <input
            type="file"
            accept="image/*"
            className="border border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white"
            {...register("avatar")}
          />
          {/* {errors.avatar && <span className="text-red-400 text-xs">{errors.avatar.message}</span>} */}
        </div>
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
            <button
              type="button"
              onClick={addNewTech}
              className="text-emerald-500 text-sm border border-zinc-800 rounded px-3 py-2 hover:bg-emerald-500 hover:text-white"
            >
              +
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
          Save
        </button>
      </form>
      <pre>{output}</pre>
    </main>
  );
}

export default App;
