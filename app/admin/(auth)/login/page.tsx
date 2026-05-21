"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SITE_LOGO, SITE_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLoginPage() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const password = new FormData(e.currentTarget).get("password");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (!res.ok) {
      setErr("Invalid password");
      return;
    }
    router.push("/admin/menu-items");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="items-center text-center">
        <Image
          src={SITE_LOGO}
          alt={SITE_NAME}
          width={120}
          height={120}
          className="mx-auto mb-2 h-20 w-auto object-contain"
        />
        <CardTitle>{SITE_NAME}</CardTitle>
        <p className="text-sm text-zinc-500">Admin login</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1"
            />
          </div>
          {err ? <p className="text-sm text-red-600">{err}</p> : null}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "..." : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
