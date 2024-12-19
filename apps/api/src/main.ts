import { initializeServer } from '@shared/frameworks/express';

export type AppDependencies = {
  message: string;
};

export function buildAppDependencies(): AppDependencies {
  return;
}

initializeServer(buildAppDependencies());
