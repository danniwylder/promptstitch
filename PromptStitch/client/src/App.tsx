import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout/layout";
import Home from "@/pages/home";
import Invocations from "@/pages/invocations";
import Ilk from "@/pages/ilk";
import Alchemy from "@/pages/alchemy";
import Settings from "@/pages/settings";
import Threads from "@/pages/threads";
import Sigils from "@/pages/sigils";
import Conflux from "@/pages/conflux";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/invocations" component={Invocations} />
        <Route path="/ilk" component={Ilk} />
        <Route path="/alchemy" component={Alchemy} />
        <Route path="/settings" component={Settings} />
        <Route path="/threads" component={Threads} />
        <Route path="/sigils" component={Sigils} />
        <Route path="/conflux" component={Conflux} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
