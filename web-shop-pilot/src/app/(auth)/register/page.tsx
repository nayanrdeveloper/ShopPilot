"use client";

import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

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
            login(data.register.token, data.register.user);
            // Redirect to dashboard (or maybe onboarding later)
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="border-none shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Start your Journey</CardTitle>
                    <CardDescription>
                        Create your store and start selling in minutes
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Your Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="storeName">Store Name</Label>
                            <Input
                                id="storeName"
                                placeholder="My Awesome Shop"
                                value={formData.storeName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-500 font-medium">{error}</div>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Store...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm text-gray-500">
                        Already have a store? <a href="/login" className="text-primary hover:underline">Sign in</a>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
