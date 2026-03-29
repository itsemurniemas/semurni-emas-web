import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-6xl font-light text-foreground mb-4">404</h1>
      <h2 className="text-2xl font-light text-foreground mb-6">
        Page Not Found
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Button asChild className="rounded-none px-8">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
