import { useTranslation } from 'react-i18next';
import './assets/checkbox.css';

type CheckboxProps = {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  onChange: Function;
};

export const Checkbox: CheckboxProps = ({
  id,
  name,
  label,
  checked,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <label htmlFor={id || name} className="checkbox">
      {t(label)}
      <input
        id={id || name}
        name={name}
        type="checkbox"
        className="checkbox__input"
        checked={checked}
        onChange={onChange}
      />
    </label>
  );
};
