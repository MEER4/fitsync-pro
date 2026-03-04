import { RoutineForm } from '../components/routines/RoutineForm';
import { useTranslation } from 'react-i18next';

const CreateRoutinePage = () => {
    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-text-main mb-2">{t('routines.create.title')}</h1>
                <p className="text-text-muted">{t('routines.create.subtitle')}</p>
            </div>

            <RoutineForm />
        </div>
    );
};

export default CreateRoutinePage;
