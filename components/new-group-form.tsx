"use client";

import { createGroup, CreateGroupState } from "@/app/app/grupos/novo/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader, Mail, Trash2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

interface Participant {
  name: string;
  email: string;
}

export default function NewGroupForm({
  loggedUser,
}: {
  loggedUser: { email: string; id: string };
}) {
  const { toast } = useToast();
  const [participants, setParticipants] = useState<Participant[]>([
    { name: "", email: loggedUser.email },
  ]);

  const [groupName, setGroupName] = useState("");

  const [state, formAction, pending] = useActionState<
    CreateGroupState,
    FormData
  >(createGroup, {
    success: null,
    message: "",
  });

  function updateParticipant(
    index: number,
    field: keyof Participant,
    value: string
  ) {
    const updatedParticipants = [...participants];
    updatedParticipants[index][field] = value;
    setParticipants(updatedParticipants);
  }

  function removeParticipant(index: number) {
    setParticipants(participants.filter((_, i) => i !== index));
  }

  function addParticipant() {
    setParticipants(participants.concat({ name: "", email: "" }));
  }

  useEffect(() => {
    if (state.success === false) {
      toast({
        variant: "destructive",
        description: state.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Novo grupo</CardTitle>
        <CardDescription>Convide seus amigos para participar</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Nome do grupo</Label>
            <Input
              id="group-name"
              name="group-name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Digite o nome do grupo"
              required
            />
          </div>

          <h2 className="!mt-12">Participantes</h2>
          {participants.map((participant, index) => (
            <div
              key={index}
              className="flex flex-col items-end space-y-4 md:flex-row md:space-y-0 md:space-x-4"
            >
              <div className="flex-grow w-full space-y-2">
                <Label htmlFor={`name-${index}`}>Nome</Label>
                <Input
                  id={`name-${index}`}
                  name="name"
                  value={participant.name}
                  onChange={(e) => {
                    updateParticipant(index, "name", e.target.value);
                  }}
                  placeholder="Digite o nome da pessoa"
                  required
                />
              </div>

              <div className="flex-grow w-full space-y-2">
                <Label htmlFor={`email-${index}`}>Email</Label>
                <Input
                  id={`email-${index}`}
                  name="email"
                  type="email"
                  value={participant.email}
                  onChange={(e) => {
                    updateParticipant(index, "email", e.target.value);
                  }}
                  placeholder="Digite o email da pessoa"
                  className="readonly:text-muted-foreground"
                  readOnly={participant.email === loggedUser.email}
                  required
                />
              </div>

              <div className="min-w-9">
                {participants.length > 1 &&
                  participant.email !== loggedUser.email && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeParticipant(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
              </div>
            </div>
          ))}
        </CardContent>
        <Separator className="my-4" />
        <CardFooter className="flex flex-col justify-between space-y-4 md:flex-row md:space-y-0">
          <Button
            type="button"
            variant="outline"
            onClick={addParticipant}
            className="w-full md:w-auto"
          >
            Adicionar amigo
          </Button>

          <Button
            type="submit"
            className="flex items-center w-full space-x-2 md:w-auto"
          >
            <Mail className="w-3 h-3" /> Criar grupo e enviar emails
            {pending && <Loader className="animate-spin" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}