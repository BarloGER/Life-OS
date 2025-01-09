// src/features/landing/pages/LandingPage.tsx

import React from 'react';
import { LandingPageTemplate } from '../templates/LandingPageTemplate';
import { LandingPageHero } from '../organisms/LandingPageHero';
import { LandingPageFeatures } from '../organisms/LandingPageFeatures';
import { LandingPageCTA } from '../organisms/LandingPageCTA';
import { LandingPageInstructions } from '../organisms/LandingPageInstructions';

export const LandingPage: React.FC = () => {
  return (
    <LandingPageTemplate>
      {/* Hero → Full viewport height */}
      <section id="hero" className="landing-page-template__section">
        <LandingPageHero />
      </section>

      {/* Features */}
      <section id="features" className="landing-page-template__section">
        <LandingPageFeatures />
      </section>

      {/* CTA */}
      <section id="cta" className="landing-page-template__section">
        <LandingPageCTA />
      </section>

      {/* Instructions / Next steps */}
      <section id="instructions" className="landing-page-template__section">
        <LandingPageInstructions />
      </section>
    </LandingPageTemplate>
  );
};
