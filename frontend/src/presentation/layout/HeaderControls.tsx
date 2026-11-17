import { Icon } from '@/presentation/components/Icon'
import { useI18n } from '@/presentation/i18n/i18nContext'
import { useTheme } from '@/presentation/theme/themeContext'

import styles from './HeaderControls.module.css'

export function HeaderControls() {
  const { locale, setLocale, t } = useI18n()
  const { theme, toggleTheme } = useTheme()
  const isArabic = locale === 'ar'

  return (
    <div className={styles.actions}>
      <span className={styles.note}>{t('header.note')}</span>

      <button
        type="button"
        className={styles.control}
        onClick={() => setLocale(isArabic ? 'en' : 'ar')}
        aria-label={
          isArabic ? t('header.switchToEnglish') : t('header.switchToArabic')
        }
        title={
          isArabic ? t('header.switchToEnglish') : t('header.switchToArabic')
        }
      >
        <Icon name="globe" size={16} />
        <span>
          {isArabic ? t('header.switchToEnglish') : t('header.switchToArabic')}
        </span>
      </button>

      <button
        type="button"
        className={`${styles.control} ${styles.iconOnly}`}
        onClick={toggleTheme}
        aria-label={
          theme === 'dark'
            ? t('header.themeToLight')
            : t('header.themeToDark')
        }
        title={
          theme === 'dark'
            ? t('header.themeToLight')
            : t('header.themeToDark')
        }
      >
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} />
      </button>
    </div>
  )
}
