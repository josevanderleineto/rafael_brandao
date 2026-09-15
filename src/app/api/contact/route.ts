import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type ContactPayload = {
  name?: unknown;
  phone?: unknown;
  message?: unknown;
};

function requiredText(value: unknown, maxLength: number) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

export async function POST(request: Request) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || gmailUser;

  if (!gmailUser || !gmailAppPassword || !receiverEmail) {
    return NextResponse.json(
      { error: "O envio de mensagens ainda não está configurado." },
      { status: 503 },
    );
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  if (
    !requiredText(payload.name, 120) ||
    !requiredText(payload.phone, 40) ||
    !requiredText(payload.message, 5000)
  ) {
    return NextResponse.json({ error: "Preencha todos os campos corretamente." }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });

  try {
    await transporter.sendMail({
      from: gmailUser,
      to: receiverEmail,
      replyTo: gmailUser,
      subject: `Novo contato pelo site: ${payload.name}`,
      text: [
        `Nome: ${payload.name}`,
        `Telefone: ${payload.phone}`,
        "",
        "Mensagem:",
        payload.message,
      ].join("\n"),
    });
  } catch (error) {
    console.error("Falha ao enviar contato por e-mail:", error);
    return NextResponse.json(
      { error: "Não foi possível enviar sua mensagem. Tente novamente." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
