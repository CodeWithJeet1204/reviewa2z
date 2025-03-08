
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Settings, UserCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const ProfilePage = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container px-4 md:px-6 mx-auto py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl font-medium">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container px-4 md:px-6 mx-auto py-8 mt-24">
        <div className="max-w-3xl mx-auto">
          <Card className="glass shadow-lg">
            <CardHeader className="flex flex-col items-center space-y-4 pb-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center space-y-1">
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <UserCircle className="mr-2 h-5 w-5 text-primary" />
                  Account Details
                </h3>
                <div className="grid gap-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">User ID</span>
                    <span className="font-mono text-sm">{user.id.substring(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Account Created</span>
                    <span>Recently</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-primary" />
                  Account Settings
                </h3>
                <p className="text-muted-foreground mb-4">
                  You can update your profile or manage your account settings.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end pt-4 pb-6">
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
