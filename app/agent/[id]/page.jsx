'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, Phone, Mail, MapPin } from "lucide-react";
import PropertyList from '@/app/_components/PropertyList';

export default function AgentProfile({ params }) {
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgentDetails();
  }, []);

  const fetchAgentDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      
      setAgent(data);
    } catch (error) {
      console.error('Error fetching agent details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!agent) return <div>Agent not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <Card className="mb-8">
          <CardHeader className="text-center border-b">
            <Avatar className="h-32 w-32 mx-auto mb-4">
              <AvatarImage src={agent.avatar_url} />
              <AvatarFallback>{agent.name?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl mb-2">{agent.name}</CardTitle>
            <div className="text-lg text-muted-foreground flex items-center justify-center gap-2">
              <Building2 className="h-5 w-5" />
              {agent.company_name}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  {agent.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  {agent.email}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Listed Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyList userId={agent.user_id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 