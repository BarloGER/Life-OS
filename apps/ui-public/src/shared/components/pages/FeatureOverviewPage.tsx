import { FeatureOverviewTemplate } from '../templates/FeatureOverviewTemplate';
import { FeatureList } from '../organisms';

export const FeatureOverviewPage = () => {
  return (
    <FeatureOverviewTemplate>
      <section
        id="feature-overview"
        className="feature-overview-template__section"
      >
        <FeatureList />
      </section>
    </FeatureOverviewTemplate>
  );
};
