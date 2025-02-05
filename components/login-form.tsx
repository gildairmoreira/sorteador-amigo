"use client";

import React, { useActionState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { login, LoginState } from "@/app/(auth)/login/actions";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Loader, MessageCircle } from "lucide-react";

function LoginForm() {
    const [state, formAction, pending] = useActionState<LoginState, FormData>(
        login,
        {
            success: null,
            message: ""
        }
    );


  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Digite seu email para receber um link de login
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <div className="grid gap-4">
            <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="maria@gmail.com"
              required
            />
          </div>

            {state.success === true && (
                <Alert className="text-muted-foreground">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-gray-50">Email enviado</AlertTitle>
                    <AlertDescription className="text-gray-50">
                        Verifique sua caixa de entrada
                    </AlertDescription>
                </Alert>
            )}

            {state.success === false && (
                <Alert className="text-muted-foreground">
                    <MessageCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-gray-50">Erro!</AlertTitle>
                    <AlertDescription className="text-gray-50">
                        Ocorreu Um Erro ao enviar o Link de Login. Por Favor Tente Novamente.
                    </AlertDescription>
                </Alert>
            )}

            <Button type="submit" className="w-full">
                {pending && <Loader className="animate-spin h-4 w-4 mr-2" />}
                Login
            </Button>
        </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default LoginForm;
