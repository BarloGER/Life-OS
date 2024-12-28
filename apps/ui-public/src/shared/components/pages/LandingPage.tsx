import { LandingPageTemplate } from '../templates';
import {
  LandingPageHero,
  LandingPageFeatures,
  LandingPageInstructions,
} from '../organisms';

export const LandingPage = () => {
  return (
    <LandingPageTemplate>
      <section id="hero" className="landing-page-template__section">
        <LandingPageHero />
      </section>
      <section id="features" className="landing-page-template__section">
        <LandingPageFeatures />
      </section>
      <section id="instructions" className="landing-page-template__section">
        <LandingPageInstructions />
      </section>
    </LandingPageTemplate>
  );
};
