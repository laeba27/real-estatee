'use client';
import { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { supabase } from '@/utils/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function PropertyForm({ initialData = null }) {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    property_type: initialData?.property_type || '',
    listing_type: initialData?.listing_type || 'sale',
    bedrooms: initialData?.bedrooms || '',
    bathrooms: initialData?.bathrooms || '',
    parking: initialData?.parking || '',
    size: initialData?.size || '',
    images: initialData?.images || [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      if (!formData.title || !formData.price || !formData.address) {
        throw new Error('Please fill in all required fields');
      }

      const propertyData = {
        ...formData,
        user_id: user.id, // Add the user ID from Clerk
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        parking: parseInt(formData.parking),
        size: parseFloat(formData.size),
      };

      let result;
      if (initialData) {
        // Update existing property
        result = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', initialData.id)
          .select()
          .single();
      } else {
        // Insert new property
        result = await supabase
          .from('properties')
          .insert([propertyData])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: initialData 
          ? "Property updated successfully"
          : "Property created successfully",
      });

      router.push('/profile'); // Redirect to profile page
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter property title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (₹) *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter property description"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="listing_type">Listing Type *</Label>
          <Select
            name="listing_type"
            value={formData.listing_type}
            onValueChange={(value) => 
              setFormData(prev => ({ ...prev, listing_type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select listing type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="rent">For Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="property_type">Property Type</Label>
          <Select
            name="property_type"
            value={formData.property_type}
            onValueChange={(value) => 
              setFormData(prev => ({ ...prev, property_type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Add more form fields for address, bedrooms, etc. */}
        
        <div className="md:col-span-2 flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialData ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              initialData ? 'Update Property' : 'Create Property'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
} 