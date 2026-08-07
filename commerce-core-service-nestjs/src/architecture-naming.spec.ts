import { readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

type ControllerFile = {
  fileName: string;
  filePath: string;
  source: string;
};

const modulesDir = join(__dirname, 'modules');

function listControllerFiles(dir: string): ControllerFile[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      return listControllerFiles(entryPath);
    }

    if (!entry.name.endsWith('.controller.ts')) {
      return [];
    }

    return [
      {
        fileName: entry.name,
        filePath: entryPath,
        source: readFileSync(entryPath, 'utf8'),
      },
    ];
  });
}

function getControllerRoute(source: string): string | null {
  const match = source.match(/@Controller\(\s*['"`]([^'"`]+)['"`]\s*\)/);
  return match?.[1] ?? null;
}

function getExportedControllerClass(source: string): string | null {
  const match = source.match(/export\s+class\s+(\w+Controller)\b/);
  return match?.[1] ?? null;
}

describe('architecture controller audience naming', () => {
  const controllerFiles = listControllerFiles(modulesDir);

  it('uses cms file and class prefixes for CMS controllers', () => {
    const violations = controllerFiles.flatMap(
      ({ fileName, filePath, source }) => {
        const route = getControllerRoute(source);

        if (!route?.startsWith('cms')) {
          return [];
        }

        const className = getExportedControllerClass(source);
        const errors: string[] = [];

        if (!fileName.startsWith('cms-')) {
          errors.push(
            `${basename(filePath)} handles ${route} but is not cms-*`,
          );
        }

        if (!className?.startsWith('Cms')) {
          errors.push(
            `${basename(filePath)} exports ${className ?? 'no controller'} for ${route}`,
          );
        }

        return errors;
      },
    );

    expect(violations).toEqual([]);
  });

  it('uses client file and class prefixes for client controllers', () => {
    const violations = controllerFiles.flatMap(
      ({ fileName, filePath, source }) => {
        const route = getControllerRoute(source);

        if (!route?.startsWith('client')) {
          return [];
        }

        const className = getExportedControllerClass(source);
        const errors: string[] = [];

        if (!fileName.startsWith('client-')) {
          errors.push(
            `${basename(filePath)} handles ${route} but is not client-*`,
          );
        }

        if (!className?.startsWith('Client')) {
          errors.push(
            `${basename(filePath)} exports ${className ?? 'no controller'} for ${route}`,
          );
        }

        return errors;
      },
    );

    expect(violations).toEqual([]);
  });
});
