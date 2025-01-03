import { useTranslation } from 'react-i18next';
import './assets/modal.css';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  content: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, content }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal__content">
        {content}
        <button className="modal__close-button" onClick={onClose}>
          {t('shared.components.atoms.modal.close')}
        </button>
      </div>
    </div>
  );
};
