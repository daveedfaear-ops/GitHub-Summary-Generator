
export interface GitHubUrlParts {
  owner: string;
  repo: string;
  type: 'repo' | 'file' | 'issue' | 'pr';
  path?: string; // for file path
  id?: string;   // for issue/pr number
}

// This interface is specific to the content API response for files/dirs
export interface GitHubContentResponse {
  content: string;
  encoding: 'base64';
  name: string;
  path: string;
  sha: string;
  size: number;
  type: 'file' | 'dir';
  url: string;
  git_url: string;
  html_url: string;
  download_url: string;
}
