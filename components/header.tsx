import { Button } from "@/components/ui/button";
import { Gift, UsersRound } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container p-4 mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/app" className="flex items-center gap-2 text-2xl font-bold">
            <Gift className="w-6 h-6 text-yellow-400" />
            <span>
              Amigo
              <span className="font-thin">Secreto</span>
            </span>
          </Link>

          <nav className="flex items-center space-x-4">
            <Link
              href="/app/grupos"
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <UsersRound className="w-4 h-4" />
              Meu grupos
            </Link>

            <Button asChild variant="outline">
              <Link href="/app/grupos/novo">Novo grupo</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}