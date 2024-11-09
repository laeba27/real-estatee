'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import PropertyForm from '@/app/_components/PropertyForm';
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function EditPropertyPage({ params }) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setProperty(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Edit Property</h1>
        <PropertyForm initialData={property} />
      </Card>
    </div>
  );
} 