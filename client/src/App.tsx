import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import MusicPage from "@/pages/music";
import PhotographyPage from "@/pages/photography";
import MerchandisePage from "@/pages/merchandise";
import PhilosophyPage from "@/pages/philosophy";
import FuturePage from "@/pages/future";
import CodePage from "@/pages/code";
import SearchPage from "@/pages/search";
import AdminPage from "@/pages/admin";
import MinimalNavigation from "@/components/minimal-navigation";
import MinimalHero from "@/components/minimal-hero";
import Lightbox from "@/components/lightbox";

function MinimalPortfolio() {
  return (
    <div className="min-h-screen" style={{backgroundColor: '#F3EFE0'}}>
      <MinimalHero />
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <MinimalNavigation />
      {children}
      <Lightbox />
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={() => <Redirect to="/view" />} />
        <Route path="/home" component={Home} />
        <Route path="/echo" component={MusicPage} />
        <Route path="/view" component={PhotographyPage} />
        <Route path="/form" component={MerchandisePage} />
        <Route path="/core" component={PhilosophyPage} />
        <Route path="/note" component={FuturePage} />
        <Route path="/look" component={SearchPage} />
        <Route path="/code" component={CodePage} />
        <Route path="/admin" component={AdminPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
