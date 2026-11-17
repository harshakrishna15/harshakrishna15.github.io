import records from '../../papers/papers.json';

type Paper = {
  id: string;
  title: string;
  authors?: string;
  venue?: string;
  submitted?: string;
  abstract?: string;
  links?: { label: string; url: string }[];
};

export const papers: Paper[] = records;
