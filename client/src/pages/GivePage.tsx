import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateDonation } from "@/hooks/use-donations";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heart, CreditCard, ShieldCheck } from "lucide-react";

// Frontend only schema enhancement for amount input as string then coerce
const donationFormSchema = z.object({
  amount: z.coerce.number().min(1, "Minimum donation is $1"),
});

export default function GivePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { mutate: donate, isPending } = useCreateDonation();
  const [givingType, setGivingType] = useState("one-time");

  const form = useForm<{ amount: number }>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      amount: 50,
    },
  });

  const onSubmit = (data: { amount: number }) => {
    // Convert to cents for storage
    const payload = {
      amount: Math.round(data.amount * 100),
      currency: "usd",
      status: "succeeded", // Simulating success for now
      userId: user?.id || null,
    };

    donate(payload, {
      onSuccess: () => {
        toast({
          title: "Thank You!",
          description: "Your generosity makes a difference.",
        });
        form.reset();
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Could not process donation. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  const predefinedAmounts = [25, 50, 100, 250, 500];

  return (
    <div className="min-h-screen bg-background pb-12 md:pb-20">
      <div className="relative py-12 md:py-20 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'url(/tokens.avif)', backgroundSize: '150px', backgroundRepeat: 'repeat' }}
        />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" />
        <div className="container px-3 md:px-4 text-center relative z-10">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold mb-4 md:mb-6 text-gray-900">
            Generosity
          </h1>
          <p className="text-base md:text-xl text-gray-700 max-w-2xl mx-auto">
            "Each of you should give what you have decided in your heart to
            give, not reluctantly or under compulsion, for God loves a cheerful
            giver."
          </p>
          <p className="mt-3 md:mt-4 text-gray-600 text-sm md:text-base">2 Corinthians 9:7</p>
        </div>
      </div>

      <div className="container px-3 md:px-4 mt-10 md:mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-7">
            <Card className="shadow-xl border-none">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="text-xl md:text-2xl">Make a Donation</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Secure, simple, and impactful.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="one-time" onValueChange={setGivingType}>
                  <TabsList className="grid w-full grid-cols-2 mb-6 md:mb-8">
                    <TabsTrigger value="one-time" className="text-sm md:text-base">One-Time</TabsTrigger>
                    <TabsTrigger value="recurring" className="text-sm md:text-base">Recurring</TabsTrigger>
                  </TabsList>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-5 md:space-y-6"
                    >
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 md:gap-3 mb-4 md:mb-6">
                        {predefinedAmounts.map((amt) => (
                          <Button
                            key={amt}
                            type="button"
                            variant={
                              form.watch("amount") === amt
                                ? "default"
                                : "outline"
                            }
                            onClick={() => form.setValue("amount", amt)}
                            className="h-10 md:h-12 text-sm md:text-lg"
                          >
                            ${amt}
                          </Button>
                        ))}
                      </div>

                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm md:text-base">Custom Amount ($)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                  $
                                </span>
                                <Input
                                  type="number"
                                  className="pl-7 md:pl-8 text-base md:text-lg h-10 md:h-12"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full text-base md:text-lg h-12 md:h-14"
                        disabled={isPending}
                      >
                        {isPending
                          ? "Processing..."
                          : `Give $${form.watch("amount") || 0} ${givingType === "recurring" ? "Monthly" : "Now"}`}
                      </Button>
                    </form>
                  </Form>

                  <div className="mt-4 md:mt-6 flex items-center justify-center gap-2 text-xs md:text-sm text-muted-foreground">
                    <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span>Secure 256-bit SSL Encryption</span>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Impact/Info */}
          <div className="lg:col-span-5 space-y-4 md:space-y-6">
            <div className="bg-secondary/50 p-4 md:p-6 rounded-xl border border-border">
              <h3 className="text-base md:text-xl font-bold mb-2 md:mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 md:w-5 md:h-5 text-primary" /> Why We Give
              </h3>
              <p className="text-muted-foreground text-sm md:text-base mb-3 md:mb-4">
                Giving is an act of worship. It's a way to show God that He is
                first in our lives and to support the work He is doing through
                our church.
              </p>
            </div>

            <div className="bg-secondary/50 p-4 md:p-6 rounded-xl border border-border">
              <h3 className="text-base md:text-xl font-bold mb-2 md:mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-primary" /> Other Ways to Give
              </h3>
              <ul className="space-y-2 md:space-y-3 text-muted-foreground text-sm md:text-base">
                <li>• Text "GIVE" to 555-1234</li>
                <li>• Mail checks to 123 Faith Ave</li>
                <li>• Drop in offering buckets on Sunday</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
