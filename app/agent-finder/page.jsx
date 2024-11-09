'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MapPin, Building2, Phone, Mail } from "lucide-react";
import Link from 'next/link';

export default function AgentFinder() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAgents, setFilteredAgents] = useState([]);

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    // Filter agents based on search term
    const filtered = agents.filter(agent => 
      agent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAgents(filtered);
  }, [searchTerm, agents]);

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          properties: properties(count)
        `)
        .not('company_name', 'eq', '');

      if (error) throw error;
      
      setAgents(data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Real Estate Agent</h1>
          <p className="text-lg text-muted-foreground">
            Connect with experienced agents who can help you find your dream property
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search agents by name or company..."
              className="pl-10 py-6 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center border-b">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={agent.avatar_url} />
                  <AvatarFallback>{agent.name?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl mb-2">{agent.name}</CardTitle>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-2 capitalize">
                  <Building2 className="h-4 w-4" />
                  {agent.company_name}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {agent.phone}
                  </div>
            
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    {agent.properties?.[0]?.count || 0} Listed Properties
                  </div>
                </div>
                <div className="mt-6">
                  <Link href={`/agent/${agent.id}`}>
                    <Button className="w-full">View Profile</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAgents.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No agents found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 