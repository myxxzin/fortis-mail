import { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const replayProductTour = (uid: string) => {
  localStorage.removeItem(`fortis_tour_${uid}`);
  window.dispatchEvent(new Event('fortis-replay-tour'));
};

export default function ProductTour({ isReady }: { isReady: boolean }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    const handleReplay = () => setRunKey(k => k + 1);
    window.addEventListener('fortis-replay-tour', handleReplay);
    return () => window.removeEventListener('fortis-replay-tour', handleReplay);
  }, []);

  useEffect(() => {
    if (!isReady || !user) return;

    const tourKey = `fortis_tour_${user.uid}`;
    if (localStorage.getItem(tourKey)) return;

    const driverObj = driver({
      showProgress: true,
      animate: true,
      popoverClass: 'fortis-tour-theme',
      nextBtnText: t('tour.next'),
      prevBtnText: t('tour.prev'),
      doneBtnText: t('tour.done'),
      allowClose: true,
      onDestroyed: () => {
        localStorage.setItem(tourKey, 'completed');
      },
      steps: [
        {
          popover: {
            title: t('tour.welcome.title'),
            description: t('tour.welcome.desc'),
            side: "over",
            align: 'start'
          }
        },
        {
          element: '#tour-compose',
          popover: {
            title: t('tour.compose.title'),
            description: t('tour.compose.desc'),
            side: "right",
            align: 'start'
          }
        },
        {
          element: '#tour-inbox',
          popover: {
            title: t('tour.inbox.title'),
            description: t('tour.inbox.desc'),
            side: "right",
            align: 'start'
          }
        },
        {
          element: '#tour-sent',
          popover: {
            title: t('tour.sent.title'),
            description: t('tour.sent.desc'),
            side: "right",
            align: 'start'
          }
        },
        {
          element: '#tour-drafts',
          popover: {
            title: t('tour.drafts.title'),
            description: t('tour.drafts.desc'),
            side: "right",
            align: 'start'
          }
        },
        {
          element: '#tour-contacts',
          popover: {
            title: t('tour.contacts.title'),
            description: t('tour.contacts.desc'),
            side: "right",
            align: 'start'
          }
        },
        {
          element: '#tour-about',
          popover: {
            title: t('tour.about.title'),
            description: t('tour.about.desc'),
            side: "right",
            align: 'start'
          }
        },
        {
          element: '#tour-settings',
          popover: {
            title: t('tour.settings.title'),
            description: t('tour.settings.desc'),
            side: "right",
            align: 'start'
          }
        },
        {
          element: '#tour-theme',
          popover: {
            title: t('tour.theme.title'),
            description: t('tour.theme.desc'),
            side: "bottom",
            align: 'end'
          }
        },
        {
          element: '#tour-language',
          popover: {
            title: t('tour.language.title'),
            description: t('tour.language.desc'),
            side: "bottom",
            align: 'end'
          }
        },
        {
          element: '#tour-notifications',
          popover: {
            title: t('tour.notifications.title'),
            description: t('tour.notifications.desc'),
            side: "bottom",
            align: 'end'
          }
        }
      ]
    });

    // Add a slight delay to ensure UI is fully mounted and animations completed
    const timeout = setTimeout(() => {
       driverObj.drive();
    }, 500);

    return () => {
       clearTimeout(timeout);
       driverObj.destroy();
    };

  }, [isReady, user, t, runKey]);

  return null;
}
