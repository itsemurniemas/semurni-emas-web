"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="py-24 bg-foreground text-background section-container">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-xs uppercase tracking-[0.3em] opacity-60 mb-6 block">
          Stay Connected
        </span>
        <h2 className="text-3xl md:text-5xl font-light mb-8">
          Join the World of Linea
        </h2>
        <p className="text-background/70 font-light text-lg mb-12 max-w-2xl mx-auto">
          Subscribe to receive updates on new collections, exclusive events, and
          the art of fine jewelry.
        </p>

        {!subscribed ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
          >
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent border-background/20 focus:border-background rounded-none h-14 text-lg"
            />
            <Button
              type="submit"
              variant="outline"
              className="bg-background text-foreground hover:bg-background/90 border-none rounded-none h-14 px-8 text-sm tracking-widest uppercase font-medium"
            >
              Subscribe
            </Button>
          </form>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="text-xl font-light">Thank you for joining us.</p>
          </div>
        )}

        <p className="mt-8 text-xs text-background/40 font-light italic">
          By subscribing, you agree to our Terms of Use and Privacy Policy.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
