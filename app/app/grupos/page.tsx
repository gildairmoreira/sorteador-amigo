import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/server";
import { Calendar } from "lucide-react";
import Link from "next/link";

export default async function GruposPage() {
  const supabase = await createClient();

  const { data: authUser } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("groups")
    .select(
      `
      id,
      name,
      owner_id,
      created_at,
      participants!inner(email)
    `
    )
    .eq("participants.email", authUser?.user?.email);

  console.log(authUser);

  if (error) {
    return <p>Erro ao carregar grupos</p>;
  }

  return (
    <main className="container p-4 mx-auto">
      <h1 className="mb-4 text-3xl font-bold">Meus grupos</h1>

      <Separator className="my-4" />

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((group) => (
            <Link
              href={`/app/grupos/${group.id}`}
              key={group.id}
              className="cursor-pointer"
            >
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>{group.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(group.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </main>
  );
}