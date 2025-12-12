import { Spinner } from './Spinner';
import styles from './Button.module.css';

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon: Icon,
  onClick,
  type = 'button',
  ...props
}) => {
  const className = `${styles.button} ${styles[variant]} ${styles[size]} ${
    fullWidth ? styles.fullWidth : ''
  }`;

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Spinner size="small" color={variant === 'secondary' ? 'primary' : 'white'} />
      ) : (
        Icon && <Icon size={18} />
      )}
      {children}
    </button>
  );
};
