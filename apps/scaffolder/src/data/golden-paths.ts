export type GoldenPath = {
  id: string;
  name: string;
  description: string;
  /** NX generator that scaffolds the path, as `<plugin>:<generator>`. */
  generator: string;
  stack: readonly string[];
  /** `example` paths are illustrative; their generators don't exist in this repo. */
  availability: 'available' | 'example';
};

export const goldenPaths: readonly GoldenPath[] = [
  {
    id: 'react-remote',
    name: 'React remote',
    description:
      'A federated React page with Rsbuild, Module Federation, Zephyr deploys and Rstest, registered in the portal shell.',
    generator: '@portal/plugin:remote',
    stack: ['react', 'rsbuild', 'module-federation', 'zephyr'],
    availability: 'example',
  },
  {
    id: 'node-bff-lambda',
    name: 'Node BFF on Lambda',
    description: 'A backend-for-frontend on AWS Lambda and API Gateway, with OpenTofu and alarms.',
    generator: '@portal/plugin:bff',
    stack: ['node', 'lambda', 'api-gateway', 'opentofu'],
    availability: 'example',
  },
  {
    id: 'shared-react-lib',
    name: 'Shared React library',
    description: 'A versioned component library with changelogs and release automation.',
    generator: '@portal/plugin:library',
    stack: ['react', 'rslib', 'nx-release'],
    availability: 'example',
  },
  {
    id: 'terraform-module',
    name: 'Terraform module',
    description: 'A reusable infrastructure module with tests and docs.',
    generator: '@portal/plugin:terraform-module',
    stack: ['terraform', 'opentofu'],
    availability: 'example',
  },
];
