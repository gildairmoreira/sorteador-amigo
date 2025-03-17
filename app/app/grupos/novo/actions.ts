"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Resend } from "resend";

export type CreateGroupState = {
  success: null | boolean;
  message?: string;
};

export async function createGroup(
  _previousState: CreateGroupState,
  formData: FormData
) {
  const supabase = await createClient();

  const { data: authUser, error: authError } = await supabase.auth.getUser();

  if (authError) {
    return {
      success: false,
      message: "Ocorreu um erro ao criar o grupo",
    };
  }

  const names = formData.getAll("name");
  const emails = formData.getAll("email");
  const groupName = formData.get("group-name");

  const { data: newGroup, error } = await supabase
    .from("groups")
    .insert({
      name: groupName,
      owner_id: authUser?.user.id,
    })
    .select()
    .single();

  if (error) {
    return {
      success: false,
      message: "Ocorreu um erro ao criar o grupo. Por favor tente novamente.",
    };
  }

  const participants = names.map((name, index) => ({
    group_id: newGroup.id,
    name,
    email: emails[index],
  }));

  const { data: createdParticipants, error: errorParticipants } = await supabase
    .from("participants")
    .insert(participants)
    .select();

  if (errorParticipants) {
    return {
      success: false,
      message:
        "Ocorreu um erro ao adicionar os participantes ao grupo. Por favor tente novamente.",
    };
  }

  const drawnParticipants = drawGroup(createdParticipants);

  const { error: errorDraw } = await supabase
    .from("participants")
    .upsert(drawnParticipants);

  if (errorDraw) {
    return {
      success: false,
      message:
        "Ocorreu um erro ao sortear os participantes do grupo. Por favor tente novamente.",
    };
  }

  const { error: errorResend } = await sendEmailToParticipants(
    drawnParticipants,
    groupName as string
  );

  if (errorResend) {
    return {
      success: false,
      message: errorResend,
    };
  }

  redirect(`/app/grupos/${newGroup.id}`);
}

type Participant = {
  id: string;
  group_id: string;
  name: string;
  email: string;
  assigned_to: string | null;
  created_at: string;
};

function drawGroup(participants: Participant[]) {
  const selectedParticipants: string[] = [];

  return participants.map((participant) => {
    const availableParticipants = participants.filter(
      (p) => p.id !== participant.id && !selectedParticipants.includes(p.id)
    );

    const assignedParticipant =
      availableParticipants[
        Math.floor(Math.random() * availableParticipants.length)
      ];

    selectedParticipants.push(assignedParticipant.id);

    return {
      ...participant,
      assigned_to: assignedParticipant.id,
    };
  });
}

async function sendEmailToParticipants(
  participants: Participant[],
  groupName: string
) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    console.log(
      "Iniciando envio de emails para",
      participants.length,
      "participantes"
    );

    const emailPromises = participants.map((participant) => {
      const friendName = participants.find(
        (p) => p.id === participant.assigned_to
      )?.name;

      if (!friendName) {
        throw new Error(
          `Amigo secreto não encontrado para ${participant.name}`
        );
      }

      return resend.emails.send({
        from: "send@gildairmoreira.com",
        to: participant.email,
        subject: `Sorteio de amigo secreto - ${groupName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>🎁 Seu amigo secreto foi sorteado!</h1>
            <p>Olá ${participant.name},</p>
            <p>Você está participando do amigo secreto do grupo <strong>"${groupName}"</strong>.</p>
            <p>O seu amigo secreto é:</p>
            <h2 style="color: #e63946; text-align: center; padding: 20px;">
              ${friendName}
            </h2>
            <p>Bom presente! 🎉</p>
          </div>
        `,
      });
    });

    const results = await Promise.all(emailPromises);
    console.log("Resultados dos envios:", results);
    return { error: null };
  } catch (error) {
    console.error("Erro ao enviar emails:", error);
    return {
      error: `Ocorreu um erro ao enviar os emails: ${
        error instanceof Error ? error.message : "Erro desconhecido"
      }`,
    };
  }
}
