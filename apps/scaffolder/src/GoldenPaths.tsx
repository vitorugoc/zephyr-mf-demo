import { Badge, Button, Card, PageHeader } from '@portal/ui';
import { useId, useState } from 'react';
import { buildGenerateCommand } from './build-generate-command';
import { goldenPaths } from './data/golden-paths';
import styles from './GoldenPaths.module.css';
import { validateName } from './validate-name';

export default function GoldenPaths() {
  const [selectedId, setSelectedId] = useState(goldenPaths[0]?.id);
  const [name, setName] = useState('');
  const inputId = useId();
  const errorId = useId();

  const selected = goldenPaths.find((path) => path.id === selectedId);
  const error = name === '' ? null : validateName(name);
  const command = selected && name !== '' && !error ? buildGenerateCommand(selected, name) : null;

  return (
    <section className={styles.page}>
      <PageHeader
        title="Golden Paths"
        description="Start a new app from a supported template. Pick a path, name it, run the command."
      />

      <div className={styles.grid}>
        {goldenPaths.map((path) => {
          const isSelected = path.id === selectedId;
          return (
            <div key={path.id} className={isSelected ? styles.selected : undefined}>
              <Card title={path.name}>
                <p className={styles.description}>{path.description}</p>
                <div className={styles.meta}>
                  {path.availability === 'example' && <Badge tone="warning">Example</Badge>}
                  {path.stack.map((tech) => (
                    <Badge key={tech}>{tech}</Badge>
                  ))}
                </div>
                <Button
                  variant={isSelected ? 'primary' : 'secondary'}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedId(path.id)}
                >
                  Use {path.name}
                </Button>
              </Card>
            </div>
          );
        })}
      </div>

      <div className={styles.form}>
        <label className={styles.label} htmlFor={inputId}>
          App name
        </label>
        <input
          id={inputId}
          className={styles.input}
          value={name}
          placeholder="incidents"
          spellCheck={false}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => setName(event.target.value)}
        />
        {error && (
          <p id={errorId} className={styles.error}>
            {error}
          </p>
        )}
        {command && (
          <output className={styles.command}>
            <code>{command}</code>
          </output>
        )}
      </div>
    </section>
  );
}
