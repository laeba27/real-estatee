'use client';
import { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { supabase } from '@/utils/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Building2, Phone, User, CheckCircle2, Mail, MapPin, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserProperties from '@/app/_components/UserProperties';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company_name: '',
  });
  const [originalData, setOriginalData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // Profile doesn't exist, create one
            const newProfile = {
              user_id: user.id,
              name: user.fullName || '',
              phone: '',
              company_name: '',
            };

            const { data: createdProfile, error: createError } = await supabase
              .from('user_profiles')
              .insert([newProfile])
              .select()
              .single();

            if (createError) throw createError;
            
            setFormData(createdProfile);
            setOriginalData(createdProfile);
          } else {
            throw error;
          }
        } else {
          setFormData(data);
          setOriginalData(data);
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, toast]);

  useEffect(() => {
    // Check if form data is different from original data
    const changed = Object.keys(formData).some(
      key => formData[key] !== originalData[key]
    );
    setHasChanges(changed);
  }, [formData, originalData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setOriginalData(formData);
      toast({
        title: "Success",
        description: "Profile updated successfully",
        icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-4xl mx-auto py-10">
        {/* Profile Header */}
        <div className="mb-8 text-center">
          <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-white shadow-lg">
            <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
            <AvatarFallback className="text-lg">
              {user?.fullName?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.fullName}</h1>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Mail className="h-4 w-4" />
            {user?.emailAddresses[0].emailAddress}
          </p>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader className="bg-primary/5 border-b border-border/20">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>
              Update your profile details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="transition-all hover:border-primary/50 focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
      <Label htmlFor="phone" className="flex items-center gap-2 text-sm">
        <Phone className="h-4 w-4 text-muted-foreground" />
        Phone Number
      </Label>
      <Input
        id="phone"
        name="phone"
        value={formData.phone}
        onInput={(e) => {
          // Allow only numbers and limit input to 10 characters
          const input = e.target.value.replace(/\D/g, '').slice(0, 10);
          setFormData({ ...formData, phone: input });
        }}
        placeholder="Enter your phone number"
        maxLength={10} // Ensures the input field only allows 10 characters
        className="transition-all hover:border-primary/50 focus:border-primary"
      />
    </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="company_name" className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Company Name
                  </Label>
                  <Input
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="Enter your company name (optional)"
                    className="transition-all hover:border-primary/50 focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={saving || !hasChanges}
                  className="min-w-[140px] transition-all"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {hasChanges ? (
                        'Save Changes'
                      ) : (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Up to Date
                        </span>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-border/40">
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Profile Created</p>
                  <p>{new Date(originalData.created_at).toLocaleDateString()}</p>
                </div>
                {originalData.updated_at && (
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">Last Updated</p>
                    <p>{new Date(originalData.updated_at).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info Card */}
        <Card className="mt-6 border-none shadow-xl">
          <CardHeader className="bg-primary/5 border-b border-border/20">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle>Account Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 text-sm">
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Account Type</span>
                <span className="font-medium">Standard</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">
                  {new Date(originalData.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Properties Section */}
        <Card className="mt-6 border-none shadow-xl">
          <CardHeader className="bg-primary/5 border-b border-border/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle>My Properties</CardTitle>
              </div>
              <Link href="/post-property">
                <Button>
                  <Plus/> Post New Property
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <UserProperties userId={user.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 