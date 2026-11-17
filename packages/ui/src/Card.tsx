import { type ReactNode, useId } from 'react';
import styles from './Card.module.css';

export type CardProps = {
  title: string;
  children: ReactNode;
};

export function Card({ title, children }: CardProps) {
  const titleId = useId();
  return (
    <section className={styles.card} aria-labelledby={titleId}>
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      {children}
    </section>
  );
}
