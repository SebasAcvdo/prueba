import styles from './Spinner.module.css';

export const Spinner = ({ size = 'medium', color = 'primary', centered = false }) => {
  const spinnerClass = `${styles.spinner} ${styles[size]} ${color === 'white' ? styles.white : ''}`;

  if (centered) {
    return (
      <div className={styles.spinnerContainer}>
        <div className={spinnerClass} />
      </div>
    );
  }

  return <div className={spinnerClass} />;
};
