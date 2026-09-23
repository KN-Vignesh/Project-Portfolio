import { useEffect, useState } from 'react';
import { fetchProjects } from '../data/projectSource';
import { ProjectItem } from '../types';

let projectsPromise: Promise<ProjectItem[]> | null = null;

function getProjects(): Promise<ProjectItem[]> {
  projectsPromise ??= fetchProjects();
  return projectsPromise;
}

export function useProjects() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    getProjects()
      .then((result) => {
        if (!cancelled) setProjects(result);
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(requestError instanceof Error ? requestError : new Error('Project registry unavailable.'));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { projects, loading, error };
}