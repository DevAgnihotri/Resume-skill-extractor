import React from 'react';
import { Route, Switch } from 'wouter';
import Header from './components/Header';
import { Footer } from './components/Footer';
import Home from './pages/Home';
import Results from './pages/Results';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/results/:skillsData" component={Results} />
        <Route>
          <div className="flex-grow flex justify-center items-center">
            <h1 className="text-2xl">404 - Page Not Found</h1>
          </div>
        </Route>
      </Switch>
      <Footer />
    </div>
  );
};

export default App;