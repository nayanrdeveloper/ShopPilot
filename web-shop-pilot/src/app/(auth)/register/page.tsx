"use client";

import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, User, Store, Mail, Lock } from "lucide-react";
import Link from "next/link";

const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!, $name: String!, $storeName: String!) {
    register(email: $email, password: $password, name: $name, storeName: $storeName) {
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

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        storeName: ""
    });
    const [error, setError] = useState("");

    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const [registerMutation, { loading }] = useMutation(REGISTER_MUTATION, {
        onCompleted: (data) => {
            login(data.register.token, data.register.user, data.register.store);
            router.push("/dashboard");
        },
        onError: (err) => {
            setError(err.message || "Registration failed");
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        registerMutation({ variables: formData });
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <div className="space-y-2 text-center lg:text-left">
                <h1 className="text-3xl font-bold tracking-tight">Start your journey</h1>
                <p className="text-muted-foreground">
                    Create your store in seconds. no credit card required.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="name"
                                placeholder="John Doe"
                                className="pl-9 h-11 bg-background"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="storeName">Store Name</Label>
                        <div className="relative">
                            <Store className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="storeName"
                                placeholder="My Shop"
                                className="pl-9 h-11 bg-background"
                                value={formData.storeName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            className="pl-9 h-11 bg-background"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="Create a strong password"
                            className="pl-9 h-11 bg-background"
                            value={formData.password}
                            onChange={handleChange}
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
                            Creating Account...
                        </>
                    ) : (
                        <>
                            Create Account <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </form>
            <div className="mt-4 text-center text-sm text-muted-foreground">
                Already have a store? <Link href="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
            </div>
        </motion.div>
    );
}
