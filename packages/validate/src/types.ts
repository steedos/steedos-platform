export interface Issue {
  file: string;
  level: 'error' | 'warning';
  rule: string;
  message: string;
}

export interface ScanResult {
  packageJsonPath: string | null;
  packageServicePath: string | null;
  objectFiles: Array<{ path: string; objectName: string }>;
  fieldFiles: Array<{ path: string; objectName: string }>;
  buttonFiles: Array<{ path: string; objectName: string }>;
  listviewFiles: Array<{ path: string; objectName: string }>;
  permissionFiles: Array<{ path: string; objectName: string }>;
  triggerFiles: Array<{ path: string; location: 'triggers' | 'objects' }>;
  functionFiles: Array<{ path: string; location: 'functions' | 'objects' }>;
  appFiles: string[];
  tabFiles: string[];
  pageYmlFiles: string[];
  pageAmisFiles: string[];
}

export interface ValidationResult {
  packagePath: string;
  summary: { files: number; errors: number; warnings: number };
  issues: Issue[];
}
