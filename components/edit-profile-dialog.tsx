"use client";

import { useId, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getMyAccount, updateProfile } from "@/lib/actions/account.actions";

export default function EditProfileDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const id = useId();
  const { update } = useSession();
  const queryClient = useQueryClient();
  const { data: account } = useQuery({
    queryKey: ["account"],
    queryFn: () => getMyAccount(),
    enabled: open,
  });
  // Re-seed the form whenever a fresh account record arrives.
  const seed = account?.user;
  const [seededFrom, setSeededFrom] = useState<typeof seed>(undefined);
  const [form, setForm] = useState({ name: "", phone: "", bio: "" });
  const [saving, setSaving] = useState(false);
  if (seed && seed !== seededFrom) {
    setSeededFrom(seed);
    setForm({ name: seed.name ?? "", phone: seed.phone ?? "", bio: seed.bio ?? "" });
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateProfile(form);
    setSaving(false);
    if (!res.success) return toast.error(res.error);
    await update({ name: form.name });
    queryClient.invalidateQueries({ queryKey: ["account"] });
    toast.success("Profile updated");
    onOpenChange(false);
  };

  const field = (name: keyof typeof form) => ({
    id: `${id}-${name}`,
    value: form[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [name]: e.target.value })),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>{account?.user.email}</DialogDescription>
        </DialogHeader>
        <form onSubmit={save} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${id}-name`}>Full name</Label>
            <Input {...field("name")} required minLength={2} maxLength={80} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-phone`}>Phone (optional)</Label>
            <Input {...field("phone")} type="tel" maxLength={30} placeholder="+234…" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-bio`}>About you (optional)</Label>
            <Textarea {...field("bio")} rows={4} maxLength={500} placeholder="What are you learning for?" />
            <p className="text-right text-xs text-muted-foreground">{form.bio.length}/500</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="animate-spin" />} Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
