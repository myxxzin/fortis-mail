import { useLanguage } from '../contexts/LanguageContext';

export default function AboutUs() {
  const { t } = useLanguage();

  return (
    <div className="flex-1 flex flex-col p-6 min-h-full">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-corporate-900 dark:text-white mb-2">
            {t('sidebar.aboutUs')}
          </h1>
          <p className="text-sm font-medium text-corporate-500 dark:text-corporate-400">
            {t('about.subtitle')}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-corporate-200 dark:border-slate-800 p-8 flex-1">
        <div className="prose dark:prose-invert max-w-4xl">
          <h2 className="text-xl font-semibold mb-4 text-corporate-800 dark:text-white">{t('about.ourMission')}</h2>
          <p className="text-corporate-600 dark:text-gray-300 mb-6 font-medium">
            {t('about.bodyText')}
          </p>
        </div>
      </div>
    </div>
  );
}
