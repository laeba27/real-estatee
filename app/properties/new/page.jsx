import PropertyForm from '@/app/_components/PropertyForm';
import { Card } from "@/components/ui/card";

export default function NewPropertyPage() {
  return (
    <div className="container max-w-4xl mx-auto py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Post New Property</h1>
        <PropertyForm />
      </Card>
    </div>
  );
} 