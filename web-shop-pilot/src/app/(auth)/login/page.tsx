"use client";

import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
      store {
        id
        slug
      }
    }
  }
`;

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION, {
        onCompleted: (data) => {
            login(data.login.token, data.login.user, data.login.store);
            router.push("/dashboard");
        },
        onError: (err) => {
            setError(err.message || "Invalid credentials");
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        loginMutation({ variables: { email, password } });
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <div className="space-y-2 text-center lg:text-left">
                <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                <p className="text-muted-foreground">
                    Enter your email to sign in to your store
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            className="pl-9 h-11 bg-background"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="#" className="text-sm font-medium text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-9 h-11 bg-background"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium border border-destructive/20"
                    >
                        {error}
                    </motion.div>
                )}

                <Button type="submit" className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/25" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        <>
                            Sign In <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </form>

            <div className="relative flex items-center justify-center my-6">
                <Separator className="w-full" />
                <span className="absolute bg-gray-50 dark:bg-background px-3 text-xs text-muted-foreground uppercase">
                    Or continue with
                </span>
            </div>

            <Button variant="outline" type="button" className="w-full h-11 bg-background">
                Google (Coming Soon)
            </Button>

            <div className="mt-4 text-center text-sm text-muted-foreground">
                Don't have a store? <Link href="/register" className="font-semibold text-primary hover:underline">Create an account</Link>
            </div>
        </motion.div>
    );
}
