import NewGroupForm from "@/components/new-group-form";
import { createClient } from "@/utils/supabase/server";

export default async function NewGroupPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const loggedUser = {
    id: data?.user?.id as string,
    email: data?.user?.email as string,
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-65px)]">
      <div className="w-full px-4 py-8">
        <NewGroupForm loggedUser={loggedUser} />
      </div>
    </div>
  );
}
