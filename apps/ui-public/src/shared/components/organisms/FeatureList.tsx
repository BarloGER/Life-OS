import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MdLockPerson } from 'react-icons/md';
import { FaChevronRight, FaCalendarAlt } from 'react-icons/fa';
import { FaMoneyBillTrendUp } from 'react-icons/fa6';
import { LuCookingPot } from 'react-icons/lu';
import { FaTasks } from 'react-icons/fa';
import './assets/feature-list.css';

export const FeatureList = () => {
  const { t } = useTranslation();

  return (
    <div className="feature-list__container">
      <div className="feature-list">
        <h1>{t('shared.components.organisms.featureOverview.title')}</h1>
        <p>{t('shared.components.organisms.featureOverview.titleInfo')}</p>

        <ul>
          <li>
            <Link to={'/password-manager/vault'}>
              <div className="feature-info__container">
                <div className="feature-info__left">
                  <MdLockPerson className="feature__icon" />
                  <div className="feature__info">
                    <h3>
                      {t(
                        'shared.components.organisms.featureOverview.links.passwordManager'
                      )}
                    </h3>
                    <span>
                      {t(
                        'shared.components.organisms.featureOverview.info.passwordManager'
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="feature-info__right">
                <FaChevronRight />
              </div>
            </Link>
          </li>
          <li>
            <Link to={'#'}>
              <div className="feature-info__container">
                <div className="feature-info__left">
                  <FaMoneyBillTrendUp className="feature__icon" />
                  <div className="feature__info">
                    <h3>
                      {t(
                        'shared.components.organisms.featureOverview.links.budgetPlaner'
                      )}
                    </h3>
                    <span>
                      {t(
                        'shared.components.organisms.featureOverview.info.budgetPlaner'
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="feature-info__right">
                <span className="feature__not-ready feature__not-ready--currently">
                  {t('shared.components.organisms.featureOverview.currently')}
                </span>
              </div>
            </Link>
          </li>
          <li>
            <Link to={'#'}>
              <div className="feature-info__container">
                <div className="feature-info__left">
                  <FaCalendarAlt className="feature__icon" />
                  <div className="feature__info">
                    <h3>
                      {t(
                        'shared.components.organisms.featureOverview.links.calendar'
                      )}
                    </h3>
                    <span>
                      {t(
                        'shared.components.organisms.featureOverview.info.calendar'
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="feature-info__right">
                <span className="feature__not-ready feature__not-ready--planned">
                  {t('shared.components.organisms.featureOverview.planned')}
                </span>
              </div>
            </Link>
          </li>
          <li>
            <Link to={'#'}>
              <div className="feature-info__container">
                <div className="feature-info__left">
                  <LuCookingPot className="feature__icon" />
                  <div className="feature__info">
                    <h3>
                      {t(
                        'shared.components.organisms.featureOverview.links.publicCookbook'
                      )}
                    </h3>
                    <span>
                      {t(
                        'shared.components.organisms.featureOverview.info.publicCookbook'
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="feature-info__right">
                <span className="feature__not-ready feature__not-ready--planned">
                  {t('shared.components.organisms.featureOverview.planned')}
                </span>
              </div>
            </Link>
          </li>
          <li>
            <Link to={'#'}>
              <div className="feature-info__container">
                <div className="feature-info__left">
                  <FaTasks className="feature__icon" />
                  <div className="feature__info">
                    <h3>
                      {t(
                        'shared.components.organisms.featureOverview.links.taskManagement'
                      )}
                    </h3>
                    <span>
                      {t(
                        'shared.components.organisms.featureOverview.info.taskManagement'
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="feature-info__right">
                <span className="feature__not-ready feature__not-ready--planned">
                  {t('shared.components.organisms.featureOverview.planned')}
                </span>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
