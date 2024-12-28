import { useTranslation } from 'react-i18next';
import './assets/heading1.css';

type Heading1Props = {
  text: string;
};

export const Heading1: React.FC<Heading1Props> = ({ text }) => {
  const { t } = useTranslation();

  return <h1 className="title">{t(text)}</h1>;
};
