"use client";

import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import {
  createUser,
  getUsers,
  resetUserPassword,
  updateUserRole,
  updateUserStatus,
} from "@/lib/api";
import {
  createUserFormSchema,
  resetPasswordFormSchema,
  type CreateUserFormValues,
  type ResetPasswordFormValues,
} from "@/lib/schemas/user";
import type { User, UserRole } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminUserManagementProps {
  onUnauthorized?: () => void;
}

export default function AdminUserManagement({ onUnauthorized }: AdminUserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetUserId, setResetUserId] = useState<string | null>(null);

  const createForm = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "Staff",
    },
  });

  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: { password: "" },
  });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not load users.";
      if (message.includes("session has expired")) {
        onUnauthorized?.();
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [onUnauthorized]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  async function onCreateUser(values: CreateUserFormValues) {
    try {
      await createUser(values);
      toast.success("User created.");
      createForm.reset({ email: "", password: "", role: "Staff" });
      await loadUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create user.");
    }
  }

  async function handleRoleChange(userId: string, role: UserRole) {
    try {
      await updateUserRole(userId, role);
      toast.success("Role updated.");
      await loadUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update role.");
    }
  }

  async function handleStatusToggle(user: User) {
    try {
      await updateUserStatus(user.id, !user.isActive);
      toast.success(user.isActive ? "User deactivated." : "User activated.");
      await loadUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update status.");
    }
  }

  async function onResetPassword(values: ResetPasswordFormValues) {
    if (!resetUserId) {
      return;
    }

    try {
      await resetUserPassword(resetUserId, values);
      toast.success("Password reset.");
      resetForm.reset();
      setResetUserId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not reset password.");
    }
  }

  const { errors: createErrors, isSubmitting: isCreating } = createForm.formState;
  const { errors: resetErrors, isSubmitting: isResetting } = resetForm.formState;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold">Staff accounts</h2>
        <p className="mt-2 text-muted-foreground">
          Create staff accounts, manage roles, and reset passwords.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create user</CardTitle>
          <CardDescription>Add a new admin or staff account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={createForm.handleSubmit(onCreateUser)} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="create-email">Email</Label>
              <Input
                id="create-email"
                type="email"
                autoComplete="off"
                {...createForm.register("email")}
                aria-invalid={!!createErrors.email}
              />
              {createErrors.email && (
                <p className="text-sm text-destructive">{createErrors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-password">Password</Label>
              <Input
                id="create-password"
                type="password"
                autoComplete="new-password"
                {...createForm.register("password")}
                aria-invalid={!!createErrors.password}
              />
              {createErrors.password && (
                <p className="text-sm text-destructive">{createErrors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-role">Role</Label>
              <Controller
                control={createForm.control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="create-role" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Staff">Staff</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="sm:col-span-2">
              <Button type="submit" disabled={isCreating} className="rounded-full">
                {isCreating ? (
                  <>
                    <Loader2Icon className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create user"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((item) => (
            <Card key={item}>
              <CardHeader>
                <Skeleton className="h-5 w-48" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id}>
              <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
                <div>
                  <CardTitle className="text-base">{user.email}</CardTitle>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">{user.role}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Select
                  value={user.role}
                  onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusToggle(user)}
                >
                  {user.isActive ? "Deactivate" : "Activate"}
                </Button>

                <Dialog
                  open={resetUserId === user.id}
                  onOpenChange={(open) => {
                    if (!open) {
                      setResetUserId(null);
                      resetForm.reset();
                    }
                  }}
                >
                  <DialogTrigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setResetUserId(user.id)}
                      />
                    }
                  >
                    Reset password
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reset password</DialogTitle>
                      <DialogDescription>
                        Set a new password for {user.email}.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`reset-password-${user.id}`}>New password</Label>
                        <Input
                          id={`reset-password-${user.id}`}
                          type="password"
                          autoComplete="new-password"
                          {...resetForm.register("password")}
                          aria-invalid={!!resetErrors.password}
                        />
                        {resetErrors.password && (
                          <p className="text-sm text-destructive">{resetErrors.password.message}</p>
                        )}
                      </div>
                      <DialogFooter>
                        <DialogClose render={<Button variant="outline" type="button" />}>
                          Cancel
                        </DialogClose>
                        <Button type="submit" variant="destructive" disabled={isResetting}>
                          {isResetting ? (
                            <>
                              <Loader2Icon className="animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Reset password"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
