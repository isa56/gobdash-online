import { useLanguage } from '~/lib/i18n';

function Footer() {
  const { t } = useLanguage();
  return (
    <footer className='bg-espresso text-white py-4 px-6 flex flex-col justify-center items-center w-full'>
      <p className='text-sm'>
        <span className='font-titles drop-shadow-espresso-dark text-2xl'>GobDash</span>.
      </p>
      <p>
        {t('developedBy')}{' '}
        <a
          href='https://www.linkedin.com/in/isadorafer/'
          className='text-sunlit-clay underline'
          target='_blank'
          rel='noopener noreferrer'>
          Isadora Gonçalves
        </a>
        . {t('checkOutMy')}{' '}
        <a
          className='text-sunlit-clay underline'
          href='http://github.com/isa56'
          target='_blank'
          rel='noopener noreferrer'>
          {t('githubPage')}
        </a>
        .
      </p>
    </footer>
  );
}

export default Footer;
