import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DumbbellIcon, Smartphone, BarChart3, Users, ArrowRight } from 'lucide-react';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="overflow-hidden relative py-12 bg-gradient-to-b sm:py-20 from-primary/5 to-background">
        <div className="container relative z-10 px-4 sm:px-6">
          <div className="grid gap-8 items-center lg:grid-cols-2 lg:gap-12">
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Transform Your Body,<br className="hidden sm:block" />Transform Your Life
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-[600px]">
                  Join Freaky Fit and discover a personalized fitness journey that adapts to your goals, schedule, and preferences.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                {!isAuthenticated ? (
                  <>
                    <Link to="/register">
                      <Button size="lg" className="px-6 h-12 sm:px-8">Get Started Free</Button>
                    </Link>
                    <Link to="/about">
                      <Button variant="outline" size="lg" className="px-6 h-12 sm:px-8">Learn More</Button>
                    </Link>
                  </>
                ) : (
                  <Link to="/dashboard">
                    <Button size="lg" className="px-6 h-12 sm:px-8">Go to Dashboard</Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop"
                alt="Fitness Training"
                className="object-cover w-full rounded-lg shadow-2xl"
                style={{ aspectRatio: '16/9' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20">
        <div className="container px-4 sm:px-6">
          <div className="mb-8 text-center sm:mb-12">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
              Why Choose Freaky Fit?
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-muted-foreground">
              Experience a new way of achieving your fitness goals
            </p>
          </div>
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: DumbbellIcon,
                title: "Personalized Workouts",
                description: "Get custom workout plans tailored to your fitness level and goals"
              },
              {
                icon: Smartphone,
                title: "Track Progress",
                description: "Monitor your workouts, nutrition, and progress all in one place"
              },
              {
                icon: BarChart3,
                title: "Data Analytics",
                description: "Visualize your progress with detailed analytics and insights"
              },
              {
                icon: Users,
                title: "Community Support",
                description: "Join a community of fitness enthusiasts and share your journey"
              }
            ].map((feature, index) => (
              <Card key={index} className="border-none shadow-none">
                <CardHeader>
                  <feature.icon className="w-12 h-12 text-primary" />
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-primary/5">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
              Ready to Start Your Journey?
            </h2>
            <p className="max-w-[600px] text-base sm:text-lg md:text-xl text-muted-foreground">
              Join thousands of others who have transformed their lives with Freaky Fit
            </p>
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button size="lg" className="px-6 mt-4 h-12 sm:px-8">
                {isAuthenticated ? "Go to Dashboard" : "Get Started Today"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 