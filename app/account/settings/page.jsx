'use client';
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { user } = useUser();

  const openClerkSettings = () => {
    if (window.Clerk) {
      window.Clerk.openUserProfile();
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={openClerkSettings}
              className="w-full"
            >
              Open Clerk Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 