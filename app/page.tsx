import Empty from "@/components/empty";
import { UserForm } from "@/components/form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center pt-24 gap-8" >
      <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-2xl">
        Press ⌥ and hover the component.
      </h1>
      <Empty />
      <UserForm />
    </main>
  );
}
