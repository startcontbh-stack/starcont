import { AuthorEditor } from "@/components/admin/AuthorEditor";

export default function NovoAutorPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-azul-escuro">
        Novo autor
      </h1>
      <p className="mt-1 text-cinza">
        Cadastre alguém da equipe para assinar artigos.
      </p>
      <div className="mt-8">
        <AuthorEditor />
      </div>
    </div>
  );
}
